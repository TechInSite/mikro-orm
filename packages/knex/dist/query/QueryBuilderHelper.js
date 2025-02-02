"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilderHelper = void 0;
const util_1 = require("util");
const core_1 = require("@mikro-orm/core");
const enums_1 = require("./enums");
/**
 * @internal
 */
class QueryBuilderHelper {
    constructor(entityName, alias, aliasMap, subQueries, metadata, knex, platform) {
        this.entityName = entityName;
        this.alias = alias;
        this.aliasMap = aliasMap;
        this.subQueries = subQueries;
        this.metadata = metadata;
        this.knex = knex;
        this.platform = platform;
    }
    mapper(field, type = enums_1.QueryType.SELECT, value, alias) {
        var _a;
        const isTableNameAliasRequired = this.isTableNameAliasRequired(type);
        const fields = core_1.Utils.splitPrimaryKeys(field);
        if (fields.length > 1) {
            return this.knex.raw('(' + fields.map(f => this.knex.ref(this.mapper(f, type, value, alias))).join(', ') + ')');
        }
        let ret = field;
        const customExpression = QueryBuilderHelper.isCustomExpression(field, !!alias);
        const [a, f] = this.splitField(field);
        const prop = this.getProperty(f, a);
        const noPrefix = prop && prop.persist === false;
        if (prop === null || prop === void 0 ? void 0 : prop.fieldNameRaw) {
            return this.knex.raw(this.prefix(field, isTableNameAliasRequired));
        }
        if ((_a = prop === null || prop === void 0 ? void 0 : prop.customType) === null || _a === void 0 ? void 0 : _a.convertToJSValueSQL) {
            const prefixed = this.prefix(field, isTableNameAliasRequired, true);
            const valueSQL = prop.customType.convertToJSValueSQL(prefixed, this.platform);
            if (alias === null) {
                return this.knex.raw(valueSQL);
            }
            /* istanbul ignore next */
            return this.knex.raw(valueSQL + ' as ' + this.platform.quoteIdentifier(alias !== null && alias !== void 0 ? alias : prop.fieldNames[0]));
        }
        // do not wrap custom expressions
        if (!customExpression) {
            ret = this.prefix(field);
        }
        if (alias) {
            ret += ' as ' + alias;
        }
        if (customExpression) {
            return this.knex.raw(ret, value);
        }
        if (!isTableNameAliasRequired || this.isPrefixed(ret) || noPrefix) {
            return ret;
        }
        return this.alias + '.' + ret;
    }
    processData(data, convertCustomTypes, multi = false) {
        if (Array.isArray(data)) {
            return data.map(d => this.processData(d, convertCustomTypes, true));
        }
        data = Object.assign({}, data); // copy first
        const meta = this.metadata.find(this.entityName);
        Object.keys(data).forEach(k => {
            if (!(meta === null || meta === void 0 ? void 0 : meta.properties[k])) {
                return;
            }
            const prop = meta.properties[k];
            if (prop.joinColumns && Array.isArray(data[k])) {
                const copy = data[k];
                delete data[k];
                prop.joinColumns.forEach((joinColumn, idx) => data[joinColumn] = copy[idx]);
                return;
            }
            if (prop.customType && convertCustomTypes && !this.platform.isRaw(data[k])) {
                data[k] = prop.customType.convertToDatabaseValue(data[k], this.platform, true);
            }
            if (prop.customType && 'convertToDatabaseValueSQL' in prop.customType && !this.platform.isRaw(data[k])) {
                const quoted = this.platform.quoteValue(data[k]);
                data[k] = this.knex.raw(prop.customType.convertToDatabaseValueSQL(quoted, this.platform));
            }
            /* istanbul ignore next */
            if (!prop.customType && (Array.isArray(data[k]) || core_1.Utils.isPlainObject(data[k]))) {
                data[k] = JSON.stringify(data[k]);
            }
            if (prop.fieldNames) {
                core_1.Utils.renameKey(data, k, prop.fieldNames[0]);
            }
        });
        if (!core_1.Utils.hasObjectKeys(data) && meta && multi) {
            data[meta.primaryKeys[0]] = this.platform.usesDefaultKeyword() ? this.knex.raw('default') : undefined;
        }
        return data;
    }
    joinOneToReference(prop, ownerAlias, alias, type, cond = {}) {
        const meta = this.metadata.find(prop.type);
        const prop2 = meta.properties[prop.mappedBy || prop.inversedBy];
        const table = this.getTableName(prop.type);
        const joinColumns = prop.owner ? prop.referencedColumnNames : prop2.joinColumns;
        const inverseJoinColumns = prop.referencedColumnNames;
        const primaryKeys = prop.owner ? prop.joinColumns : prop2.referencedColumnNames;
        return {
            prop, type, cond, ownerAlias, alias, table,
            joinColumns, inverseJoinColumns, primaryKeys,
        };
    }
    joinManyToOneReference(prop, ownerAlias, alias, type, cond = {}) {
        return {
            prop, type, cond, ownerAlias, alias,
            table: this.getTableName(prop.type),
            joinColumns: prop.referencedColumnNames,
            primaryKeys: prop.fieldNames,
        };
    }
    joinManyToManyReference(prop, ownerAlias, alias, pivotAlias, type, cond, path) {
        const ret = {
            [`${ownerAlias}.${prop.name}`]: {
                prop, type, cond, ownerAlias,
                alias: pivotAlias,
                inverseAlias: alias,
                joinColumns: prop.joinColumns,
                inverseJoinColumns: prop.inverseJoinColumns,
                primaryKeys: prop.referencedColumnNames,
                table: prop.pivotTable,
                path: path.endsWith('[pivot]') ? path : `${path}[pivot]`,
            },
        };
        if (type === 'pivotJoin') {
            return ret;
        }
        const prop2 = this.metadata.find(prop.pivotTable).properties[prop.type + (prop.owner ? '_inverse' : '_owner')];
        ret[`${pivotAlias}.${prop2.name}`] = this.joinManyToOneReference(prop2, pivotAlias, alias, type);
        ret[`${pivotAlias}.${prop2.name}`].path = path;
        return ret;
    }
    joinPivotTable(field, prop, ownerAlias, alias, type, cond = {}) {
        const prop2 = this.metadata.find(field).properties[prop.mappedBy || prop.inversedBy];
        return {
            prop, type, cond, ownerAlias, alias,
            table: this.metadata.find(field).collection,
            joinColumns: prop.joinColumns,
            inverseJoinColumns: prop2.joinColumns,
            primaryKeys: prop.referencedColumnNames,
        };
    }
    processJoins(qb, joins) {
        Object.values(joins).forEach(join => {
            const table = `${join.table} as ${join.alias}`;
            const method = join.type === 'pivotJoin' ? 'leftJoin' : join.type;
            return qb[method](table, inner => {
                join.primaryKeys.forEach((primaryKey, idx) => {
                    const left = `${join.ownerAlias}.${primaryKey}`;
                    const right = `${join.alias}.${join.joinColumns[idx]}`;
                    inner.on(left, right);
                });
                this.appendJoinClause(inner, join.cond);
            });
        });
    }
    mapJoinColumns(type, join) {
        if (join.prop && join.prop.reference === core_1.ReferenceType.ONE_TO_ONE && !join.prop.owner) {
            return join.prop.fieldNames.map((fieldName, idx) => {
                return this.mapper(`${join.alias}.${join.inverseJoinColumns[idx]}`, type, undefined, fieldName);
            });
        }
        return [
            ...join.joinColumns.map(col => this.mapper(`${join.alias}.${col}`, type, undefined, `fk__${col}`)),
            ...join.inverseJoinColumns.map(col => this.mapper(`${join.alias}.${col}`, type, undefined, `fk__${col}`)),
        ];
    }
    isOneToOneInverse(field) {
        const meta = this.metadata.find(this.entityName);
        const prop = meta.properties[field];
        return prop && prop.reference === core_1.ReferenceType.ONE_TO_ONE && !prop.owner;
    }
    getTableName(entityName) {
        const meta = this.metadata.find(entityName);
        return meta ? meta.collection : entityName;
    }
    /**
     * Checks whether the RE can be rewritten to simple LIKE query
     */
    isSimpleRegExp(re) {
        if (!(re instanceof RegExp)) {
            return false;
        }
        // when including the opening bracket/paren we consider it complex
        return !re.source.match(/[{[(]/);
    }
    getRegExpParam(re) {
        const value = re.source
            .replace(/\.\*/g, '%') // .* -> %
            .replace(/\./g, '_') // .  -> _
            .replace(/\\_/g, '.') // \. -> .
            .replace(/^\^/g, '') // remove ^ from start
            .replace(/\$$/g, ''); // remove $ from end
        if (re.source.startsWith('^') && re.source.endsWith('$')) {
            return value;
        }
        if (re.source.startsWith('^')) {
            return value + '%';
        }
        if (re.source.endsWith('$')) {
            return '%' + value;
        }
        return `%${value}%`;
    }
    appendQueryCondition(type, cond, qb, operator, method = 'where') {
        const m = operator === '$or' ? 'orWhere' : 'andWhere';
        Object.keys(cond).forEach(k => {
            if (k === '$and' || k === '$or') {
                if (operator) {
                    return qb[m](inner => this.appendGroupCondition(type, inner, k, method, cond[k]));
                }
                return this.appendGroupCondition(type, qb, k, method, cond[k]);
            }
            if (k === '$not') {
                const m = operator === '$or' ? 'orWhereNot' : 'whereNot';
                return qb[m](inner => this.appendQueryCondition(type, cond[k], inner));
            }
            this.appendQuerySubCondition(qb, type, method, cond, k, operator);
        });
    }
    appendQuerySubCondition(qb, type, method, cond, key, operator) {
        const m = operator === '$or' ? 'orWhere' : method;
        if (this.isSimpleRegExp(cond[key])) {
            return void qb[m](this.mapper(key, type), 'like', this.getRegExpParam(cond[key]));
        }
        if (core_1.Utils.isPlainObject(cond[key]) || cond[key] instanceof RegExp) {
            return this.processObjectSubCondition(cond, key, qb, method, m, type);
        }
        if (QueryBuilderHelper.isCustomExpression(key)) {
            return this.processCustomExpression(qb, m, key, cond, type);
        }
        const op = cond[key] === null ? 'is' : '=';
        if (this.subQueries[key]) {
            return void qb[m](this.knex.raw(`(${this.subQueries[key]})`), op, cond[key]);
        }
        qb[m](this.mapper(key, type, cond[key], null), op, cond[key]);
    }
    processCustomExpression(clause, m, key, cond, type = enums_1.QueryType.SELECT) {
        // unwind parameters when ? found in field name
        const count = key.concat('?').match(/\?/g).length - 1;
        const value = core_1.Utils.asArray(cond[key]);
        const params1 = value.slice(0, count).map((c) => core_1.Utils.isObject(c) ? JSON.stringify(c) : c);
        const params2 = value.slice(count);
        const k = this.mapper(key, type, params1);
        if (params2.length > 0) {
            const val = params2.length === 1 && params2[0] === null ? null : this.knex.raw('?', params2);
            return void clause[m](k, val);
        }
        clause[m](k);
    }
    processObjectSubCondition(cond, key, qb, method, m, type) {
        // grouped condition for one field
        let value = cond[key];
        if (core_1.Utils.getObjectKeysSize(value) > 1) {
            const subCondition = Object.entries(value).map(([subKey, subValue]) => ({ [key]: { [subKey]: subValue } }));
            return subCondition.forEach(sub => this.appendQueryCondition(type, sub, qb, '$and', method));
        }
        if (value instanceof RegExp) {
            value = { $re: value.source };
        }
        // operators
        const op = Object.keys(core_1.QueryOperator).find(op => op in value);
        if (!op) {
            throw new Error(`Invalid query condition: ${util_1.inspect(cond)}`);
        }
        const replacement = this.getOperatorReplacement(op, value);
        const fields = core_1.Utils.splitPrimaryKeys(key);
        if (fields.length > 1 && Array.isArray(value[op]) && !value[op].every((v) => Array.isArray(v))) {
            const values = this.platform.requiresValuesKeyword() ? 'values ' : '';
            value[op] = this.knex.raw(`${values}(${fields.map(() => '?').join(', ')})`, value[op]);
        }
        if (this.subQueries[key]) {
            return void qb[m](this.knex.raw(`(${this.subQueries[key]})`), replacement, value[op]);
        }
        qb[m](this.mapper(key, type, undefined, null), replacement, value[op]);
    }
    getOperatorReplacement(op, value) {
        let replacement = core_1.QueryOperator[op];
        if (value[op] === null && ['$eq', '$ne'].includes(op)) {
            replacement = op === '$eq' ? 'is' : 'is not';
        }
        if (op === '$re') {
            replacement = this.platform.getRegExpOperator();
        }
        return replacement;
    }
    appendJoinClause(clause, cond, operator) {
        Object.keys(cond).forEach(k => {
            if (k === '$and' || k === '$or') {
                const method = operator === '$or' ? 'orOn' : 'andOn';
                const m = k === '$or' ? 'orOn' : 'andOn';
                return clause[method](outer => cond[k].forEach((sub) => {
                    if (core_1.Utils.getObjectKeysSize(sub) === 1) {
                        return this.appendJoinClause(outer, sub, k);
                    }
                    outer[m](inner => this.appendJoinClause(inner, sub, '$and'));
                }));
            }
            this.appendJoinSubClause(clause, cond, k, operator);
        });
    }
    appendJoinSubClause(clause, cond, key, operator) {
        const m = operator === '$or' ? 'orOn' : 'andOn';
        if (cond[key] instanceof RegExp) {
            return void clause[m](this.mapper(key), 'like', this.knex.raw('?', this.getRegExpParam(cond[key])));
        }
        if (core_1.Utils.isPlainObject(cond[key])) {
            return this.processObjectSubClause(cond, key, clause, m);
        }
        if (QueryBuilderHelper.isCustomExpression(key)) {
            return this.processCustomExpression(clause, m, key, cond);
        }
        const op = cond[key] === null ? 'is' : '=';
        clause[m](this.knex.raw(`${this.knex.ref(this.mapper(key, enums_1.QueryType.SELECT, cond[key]))} ${op} ?`, cond[key]));
    }
    processObjectSubClause(cond, key, clause, m) {
        // grouped condition for one field
        if (core_1.Utils.getObjectKeysSize(cond[key]) > 1) {
            const subCondition = Object.entries(cond[key]).map(([subKey, subValue]) => ({ [key]: { [subKey]: subValue } }));
            return void clause[m](inner => subCondition.map(sub => this.appendJoinClause(inner, sub, '$and')));
        }
        // operators
        for (const [op, replacement] of Object.entries(core_1.QueryOperator)) {
            if (!(op in cond[key])) {
                continue;
            }
            clause[m](this.mapper(key), replacement, this.knex.raw('?', cond[key][op]));
            break;
        }
    }
    getQueryOrder(type, orderBy, populate) {
        const ret = [];
        Object.keys(orderBy).forEach(k => {
            const direction = orderBy[k];
            const order = core_1.Utils.isNumber(direction) ? core_1.QueryOrderNumeric[direction] : direction;
            if (QueryBuilderHelper.isCustomExpression(k)) {
                ret.push(`${k} ${order.toLowerCase()}`);
                return;
            }
            // eslint-disable-next-line prefer-const
            let [alias, field] = this.splitField(k);
            alias = populate[alias] || alias;
            core_1.Utils.splitPrimaryKeys(field).forEach(f => {
                const prop = this.getProperty(f, alias);
                const noPrefix = (prop && prop.persist === false) || QueryBuilderHelper.isCustomExpression(f);
                const column = this.mapper(noPrefix ? f : `${alias}.${f}`, type);
                /* istanbul ignore next */
                const rawColumn = core_1.Utils.isString(column) ? column.split('.').map(e => this.knex.ref(e)).join('.') : column;
                ret.push(`${rawColumn} ${order.toLowerCase()}`);
            });
        });
        return ret.join(', ');
    }
    finalize(type, qb, meta) {
        const useReturningStatement = type === enums_1.QueryType.INSERT && this.platform.usesReturningStatement() && meta && !meta.compositePK;
        if (useReturningStatement) {
            const returningProps = meta.props.filter(prop => prop.primary || prop.defaultRaw);
            qb.returning(core_1.Utils.flatten(returningProps.map(prop => prop.fieldNames)));
        }
    }
    splitField(field) {
        const [a, b] = field.split('.');
        const fromAlias = b ? a : this.alias;
        const fromField = b || a;
        return [fromAlias, fromField];
    }
    getLockSQL(qb, lockMode, lockTables = []) {
        const meta = this.metadata.find(this.entityName);
        if (lockMode === core_1.LockMode.OPTIMISTIC && meta && !meta.versionProperty) {
            throw core_1.OptimisticLockError.lockFailed(this.entityName);
        }
        switch (lockMode) {
            case core_1.LockMode.PESSIMISTIC_READ: return void qb.forShare(...lockTables);
            case core_1.LockMode.PESSIMISTIC_WRITE: return void qb.forUpdate(...lockTables);
            case core_1.LockMode.PESSIMISTIC_PARTIAL_WRITE: return void qb.forUpdate(...lockTables).skipLocked();
            case core_1.LockMode.PESSIMISTIC_WRITE_OR_FAIL: return void qb.forUpdate(...lockTables).noWait();
            case core_1.LockMode.PESSIMISTIC_PARTIAL_READ: return void qb.forShare(...lockTables).skipLocked();
            case core_1.LockMode.PESSIMISTIC_READ_OR_FAIL: return void qb.forShare(...lockTables).noWait();
        }
    }
    updateVersionProperty(qb, data) {
        const meta = this.metadata.find(this.entityName);
        if (!meta || !meta.versionProperty || meta.versionProperty in data) {
            return;
        }
        const versionProperty = meta.properties[meta.versionProperty];
        let sql = versionProperty.fieldNames[0] + ' + 1';
        if (versionProperty.type.toLowerCase() === 'date') {
            sql = this.platform.getCurrentTimestampSQL(versionProperty.length);
        }
        qb.update(versionProperty.fieldNames[0], this.knex.raw(sql));
    }
    static isCustomExpression(field, hasAlias = false) {
        const re = hasAlias ? /[ ?<>=()'"`]|^\d/ : /[?<>=()'"`]|^\d/; // if we do not have alias, we don't consider spaces as custom expressions
        return !!field.match(re);
    }
    prefix(field, always = false, quote = false) {
        let ret;
        if (!this.isPrefixed(field)) {
            const alias = always ? (quote ? this.alias : this.platform.quoteIdentifier(this.alias)) + '.' : '';
            const fieldName = this.fieldName(field, this.alias);
            if (fieldName.startsWith('(')) {
                ret = '(' + alias + fieldName.slice(1);
            }
            else {
                ret = alias + fieldName;
            }
        }
        else {
            const [a, f] = field.split('.');
            ret = a + '.' + this.fieldName(f, a);
        }
        if (quote) {
            return this.platform.quoteIdentifier(ret);
        }
        return ret;
    }
    appendGroupCondition(type, qb, operator, method, subCondition) {
        // single sub-condition can be ignored to reduce nesting of parens
        if (subCondition.length === 1 || operator === '$and') {
            return subCondition.forEach(sub => this.appendQueryCondition(type, sub, qb, undefined, method));
        }
        qb[method](outer => subCondition.forEach(sub => {
            // skip nesting parens if the value is simple = scalar or object without operators or with only single key, being the operator
            const keys = Object.keys(sub);
            const val = sub[keys[0]];
            const simple = !core_1.Utils.isPlainObject(val) || core_1.Utils.getObjectKeysSize(val) === 1 || Object.keys(val).every(k => !core_1.Utils.isOperator(k));
            if (keys.length === 1 && simple) {
                return this.appendQueryCondition(type, sub, outer, operator);
            }
            outer.orWhere(inner => this.appendQueryCondition(type, sub, inner));
        }));
    }
    isPrefixed(field) {
        return !!field.match(/[\w`"[\]]+\./);
    }
    fieldName(field, alias) {
        var _a;
        const prop = this.getProperty(field, alias);
        if (!prop) {
            return field;
        }
        if (prop.fieldNameRaw) {
            return prop.fieldNameRaw;
        }
        /* istanbul ignore next */
        return (_a = prop.fieldNames[0]) !== null && _a !== void 0 ? _a : field;
    }
    getProperty(field, alias) {
        const entityName = this.aliasMap[alias] || this.entityName;
        const meta = this.metadata.find(entityName);
        return meta ? meta.properties[field] : undefined;
    }
    isTableNameAliasRequired(type) {
        return [enums_1.QueryType.SELECT, enums_1.QueryType.COUNT].includes(type);
    }
}
exports.QueryBuilderHelper = QueryBuilderHelper;
