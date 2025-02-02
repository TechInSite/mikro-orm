"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSqlDriver = void 0;
const core_1 = require("@mikro-orm/core");
const QueryBuilder_1 = require("./query/QueryBuilder");
const SqlEntityManager_1 = require("./SqlEntityManager");
class AbstractSqlDriver extends core_1.DatabaseDriver {
    constructor(config, platform, connection, connector) {
        super(config, connector);
        this.replicas = [];
        this.connection = new connection(this.config);
        this.replicas = this.createReplicas(conf => new connection(this.config, conf, 'read'));
        this.platform = platform;
    }
    getPlatform() {
        return this.platform;
    }
    createEntityManager(useContext) {
        return new SqlEntityManager_1.SqlEntityManager(this.config, this, this.metadata, useContext);
    }
    async find(entityName, where, options = {}, ctx) {
        options = Object.assign({ populate: [], orderBy: {} }, options);
        const meta = this.metadata.find(entityName);
        const populate = this.autoJoinOneToOneOwner(meta, options.populate, options.fields);
        const joinedProps = this.joinedProps(meta, populate);
        const qb = this.createQueryBuilder(entityName, ctx, !!ctx, false);
        const fields = this.buildFields(meta, populate, joinedProps, qb, options.fields);
        const joinedPropsOrderBy = this.buildJoinedPropsOrderBy(entityName, qb, meta, joinedProps);
        if (core_1.Utils.isPrimaryKey(where, meta.compositePK)) {
            where = { [core_1.Utils.getPrimaryKeyHash(meta.primaryKeys)]: where };
        }
        qb.select(fields)
            .populate(populate)
            .where(where)
            .orderBy(Object.assign(Object.assign({}, options.orderBy), joinedPropsOrderBy))
            .groupBy(options.groupBy)
            .having(options.having)
            .withSchema(options.schema);
        if (options.limit !== undefined) {
            qb.limit(options.limit, options.offset);
        }
        if (options.lockMode) {
            qb.setLockMode(options.lockMode, options.lockTableAliases);
        }
        core_1.Utils.asArray(options.flags).forEach(flag => qb.setFlag(flag));
        const result = await this.rethrow(qb.execute('all'));
        if (joinedProps.length > 0) {
            return this.mergeJoinedResult(result, meta);
        }
        return result;
    }
    async findOne(entityName, where, options, ctx) {
        const opts = Object.assign({ populate: [] }, (options || {}));
        const meta = this.metadata.find(entityName);
        const populate = this.autoJoinOneToOneOwner(meta, opts.populate, opts.fields);
        const joinedProps = this.joinedProps(meta, populate);
        if (joinedProps.length === 0) {
            opts.limit = 1;
        }
        const res = await this.find(entityName, where, opts, ctx);
        return res[0] || null;
    }
    mapResult(result, meta, populate = [], qb, map = {}) {
        const ret = super.mapResult(result, meta);
        /* istanbul ignore if */
        if (!ret) {
            return null;
        }
        if (qb) {
            this.mapJoinedProps(ret, meta, populate, qb, ret, map);
        }
        return ret;
    }
    mapJoinedProps(result, meta, populate, qb, root, map, parentJoinPath) {
        const joinedProps = this.joinedProps(meta, populate);
        joinedProps.forEach(p => {
            const relation = meta.properties[p.field];
            const meta2 = this.metadata.find(relation.type);
            const path = parentJoinPath ? `${parentJoinPath}.${relation.name}` : `${meta.name}.${relation.name}`;
            const relationAlias = qb.getAliasForJoinPath(path);
            const relationPojo = {};
            // If the primary key value for the relation is null, we know we haven't joined to anything
            // and therefore we don't return any record (since all values would be null)
            const hasPK = meta2.primaryKeys.every(pk => meta2.properties[pk].fieldNames.every(name => {
                return root[`${relationAlias}__${name}`] != null;
            }));
            if (!hasPK) {
                // initialize empty collections
                if ([core_1.ReferenceType.MANY_TO_MANY, core_1.ReferenceType.ONE_TO_MANY].includes(relation.reference)) {
                    result[relation.name] = result[relation.name] || [];
                }
                return;
            }
            meta2.props
                .filter(prop => this.shouldHaveColumn(prop, p.children || []))
                .forEach(prop => {
                if (prop.fieldNames.length > 1) { // composite keys
                    relationPojo[prop.name] = prop.fieldNames.map(name => root[`${relationAlias}__${name}`]);
                    prop.fieldNames.map(name => delete root[`${relationAlias}__${name}`]);
                }
                else {
                    const alias = `${relationAlias}__${prop.fieldNames[0]}`;
                    relationPojo[prop.name] = root[alias];
                    delete root[alias];
                }
            });
            const key = `${meta.name}-${(core_1.Utils.getCompositeKeyHash(result, meta))}`;
            if (map[key]) {
                result[relation.name] = map[key][relation.name];
            }
            else {
                map[key] = result;
            }
            if ([core_1.ReferenceType.MANY_TO_MANY, core_1.ReferenceType.ONE_TO_MANY].includes(relation.reference)) {
                result[relation.name] = result[relation.name] || [];
                this.appendToCollection(meta2, result[relation.name], relationPojo);
            }
            else {
                result[relation.name] = relationPojo;
            }
            const populateChildren = p.children || [];
            this.mapJoinedProps(relationPojo, meta2, populateChildren, qb, root, map, path);
        });
    }
    appendToCollection(meta, collection, relationPojo) {
        if (collection.length === 0) {
            return void collection.push(relationPojo);
        }
        const last = collection[collection.length - 1];
        const pk1 = core_1.Utils.getCompositeKeyHash(last, meta);
        const pk2 = core_1.Utils.getCompositeKeyHash(relationPojo, meta);
        if (pk1 !== pk2) {
            collection.push(relationPojo);
        }
    }
    async count(entityName, where, options = {}, ctx) {
        var _a;
        const pks = this.metadata.find(entityName).primaryKeys;
        const qb = this.createQueryBuilder(entityName, ctx, !!ctx, false)
            .count(pks, true)
            .groupBy(options.groupBy)
            .having(options.having)
            .populate((_a = options.populate) !== null && _a !== void 0 ? _a : [])
            .withSchema(options.schema)
            .where(where);
        const res = await this.rethrow(qb.execute('get', false));
        return res ? +res.count : 0;
    }
    async nativeInsert(entityName, data, ctx, convertCustomTypes = true) {
        const meta = this.metadata.find(entityName);
        const collections = this.extractManyToMany(entityName, data);
        const pks = this.getPrimaryKeyFields(entityName);
        const qb = this.createQueryBuilder(entityName, ctx, true, convertCustomTypes);
        const res = await this.rethrow(qb.insert(data).execute('run', false));
        res.row = res.row || {};
        let pk;
        if (pks.length > 1) { // owner has composite pk
            pk = core_1.Utils.getPrimaryKeyCond(data, pks);
        }
        else {
            /* istanbul ignore next */
            res.insertId = data[pks[0]] || res.insertId || res.row[pks[0]];
            pk = [res.insertId];
        }
        await this.processManyToMany(meta, pk, collections, false, ctx);
        return res;
    }
    async nativeInsertMany(entityName, data, ctx, processCollections = true, convertCustomTypes = true) {
        var _a, _b;
        const meta = this.metadata.get(entityName);
        const collections = processCollections ? data.map(d => this.extractManyToMany(entityName, d)) : [];
        const pks = this.getPrimaryKeyFields(entityName);
        const set = new Set();
        data.forEach(row => Object.keys(row).forEach(k => set.add(k)));
        const props = [...set].map(name => { var _a; return (_a = meta.properties[name]) !== null && _a !== void 0 ? _a : { name, fieldNames: [name] }; });
        const fields = core_1.Utils.flatten(props.map(prop => prop.fieldNames));
        let res;
        if (fields.length === 0) {
            const qb = this.createQueryBuilder(entityName, ctx, true, convertCustomTypes);
            res = await this.rethrow(qb.insert(data).execute('run', false));
        }
        else {
            let sql = `insert into ${this.platform.quoteIdentifier(meta.collection)} `;
            /* istanbul ignore next */
            sql += fields.length > 0 ? '(' + fields.map(k => this.platform.quoteIdentifier(k)).join(', ') + ')' : 'default';
            sql += ` values `;
            const params = [];
            sql += data.map(row => {
                const keys = [];
                props.forEach(prop => {
                    if (prop.fieldNames.length > 1) {
                        params.push(...row[prop.name]);
                        keys.push(...prop.fieldNames.map(_ => '?'));
                    }
                    else if (prop.customType && 'convertToDatabaseValueSQL' in prop.customType && !this.platform.isRaw(row[prop.name])) {
                        keys.push(prop.customType.convertToDatabaseValueSQL('?', this.platform));
                        params.push(row[prop.name]);
                    }
                    else {
                        params.push(row[prop.name]);
                        keys.push('?');
                    }
                });
                return '(' + keys.join(', ') + ')';
            }).join(', ');
            if (this.platform.usesReturningStatement()) {
                const returningProps = meta.props.filter(prop => prop.primary || prop.defaultRaw);
                const returningFields = core_1.Utils.flatten(returningProps.map(prop => prop.fieldNames));
                /* istanbul ignore next */
                sql += returningFields.length > 0 ? ` returning ${returningFields.map(field => this.platform.quoteIdentifier(field)).join(', ')}` : '';
            }
            res = await this.execute(sql, params, 'run', ctx);
        }
        let pk;
        /* istanbul ignore next  */
        if (pks.length > 1) { // owner has composite pk
            pk = data.map(d => core_1.Utils.getPrimaryKeyCond(d, pks));
        }
        else {
            res.row = (_a = res.row) !== null && _a !== void 0 ? _a : {};
            res.rows = (_b = res.rows) !== null && _b !== void 0 ? _b : [];
            pk = data.map((d, i) => { var _a, _b; return (_a = d[pks[0]]) !== null && _a !== void 0 ? _a : (_b = res.rows[i]) === null || _b === void 0 ? void 0 : _b[pks[0]]; }).map(d => [d]);
            res.insertId = res.insertId || res.row[pks[0]];
        }
        for (let i = 0; i < collections.length; i++) {
            await this.processManyToMany(meta, pk[i], collections[i], false, ctx);
        }
        return res;
    }
    async nativeUpdate(entityName, where, data, ctx, convertCustomTypes = true) {
        const meta = this.metadata.find(entityName);
        const pks = this.getPrimaryKeyFields(entityName);
        const collections = this.extractManyToMany(entityName, data);
        let res = { affectedRows: 0, insertId: 0, row: {} };
        if (core_1.Utils.isPrimaryKey(where) && pks.length === 1) {
            where = { [pks[0]]: where };
        }
        if (core_1.Utils.hasObjectKeys(data)) {
            const qb = this.createQueryBuilder(entityName, ctx, true, convertCustomTypes)
                .update(data)
                .where(where);
            res = await this.rethrow(qb.execute('run', false));
        }
        const pk = pks.map(pk => core_1.Utils.extractPK(data[pk] || where, meta));
        await this.processManyToMany(meta, pk, collections, true, ctx);
        return res;
    }
    async nativeUpdateMany(entityName, where, data, ctx, processCollections = true, convertCustomTypes = true) {
        const meta = this.metadata.get(entityName);
        const collections = processCollections ? data.map(d => this.extractManyToMany(entityName, d)) : [];
        const keys = new Set();
        data.forEach(row => Object.keys(row).forEach(k => keys.add(k)));
        const pkCond = core_1.Utils.flatten(meta.primaryKeys.map(pk => meta.properties[pk].fieldNames)).map(pk => `${this.platform.quoteIdentifier(pk)} = ?`).join(' and ');
        const params = [];
        let sql = `update ${this.platform.quoteIdentifier(meta.collection)} set `;
        keys.forEach(key => {
            const prop = meta.properties[key];
            prop.fieldNames.forEach((fieldName, fieldNameIdx) => {
                sql += `${this.platform.quoteIdentifier(fieldName)} = case`;
                where.forEach((cond, idx) => {
                    if (key in data[idx]) {
                        const pks = core_1.Utils.getOrderedPrimaryKeys(cond, meta);
                        sql += ` when (${pkCond}) then `;
                        if (prop.customType && 'convertToDatabaseValueSQL' in prop.customType && !this.platform.isRaw(data[idx][key])) {
                            sql += prop.customType.convertToDatabaseValueSQL('?', this.platform);
                        }
                        else {
                            sql += '?';
                        }
                        params.push(...pks, prop.fieldNames.length > 1 ? data[idx][key][fieldNameIdx] : data[idx][key]);
                    }
                });
                sql += ` else ${this.platform.quoteIdentifier(fieldName)} end, `;
                return sql;
            });
        });
        if (meta.versionProperty) {
            const versionProperty = meta.properties[meta.versionProperty];
            const quotedFieldName = this.platform.quoteIdentifier(versionProperty.fieldNames[0]);
            sql += `${quotedFieldName} = `;
            if (versionProperty.type.toLowerCase() === 'date') {
                sql += this.platform.getCurrentTimestampSQL(versionProperty.length);
            }
            else {
                sql += `${quotedFieldName} + 1`;
            }
            sql += `, `;
        }
        sql = sql.substr(0, sql.length - 2) + ' where ';
        const pks = core_1.Utils.flatten(meta.primaryKeys.map(pk => meta.properties[pk].fieldNames));
        sql += pks.length > 1 ? `(${pks.map(pk => `${this.platform.quoteIdentifier(pk)}`).join(', ')})` : this.platform.quoteIdentifier(pks[0]);
        const conds = where.map(cond => {
            if (pks.length > 1) {
                meta.primaryKeys.forEach(pk => params.push(cond[pk]));
                return `(${new Array(pks.length).fill('?').join(', ')})`;
            }
            params.push(cond);
            return '?';
        });
        const values = pks.length > 1 && this.platform.requiresValuesKeyword() ? 'values ' : '';
        sql += ` in (${values}${conds.join(', ')})`;
        const res = await this.rethrow(this.execute(sql, params, 'run', ctx));
        for (let i = 0; i < collections.length; i++) {
            await this.processManyToMany(meta, where[i], collections[i], false, ctx);
        }
        return res;
    }
    async nativeDelete(entityName, where, ctx) {
        const pks = this.getPrimaryKeyFields(entityName);
        if (core_1.Utils.isPrimaryKey(where) && pks.length === 1) {
            where = { [pks[0]]: where };
        }
        const qb = this.createQueryBuilder(entityName, ctx, true, false).delete(where);
        return this.rethrow(qb.execute('run', false));
    }
    async syncCollection(coll, ctx) {
        const wrapped = coll.owner.__helper;
        const meta = wrapped.__meta;
        const pks = wrapped.getPrimaryKeys(true);
        const snap = coll.getSnapshot();
        const includes = (arr, item) => !!arr.find(i => core_1.Utils.equals(i, item));
        const snapshot = snap ? snap.map(item => item.__helper.getPrimaryKeys(true)) : [];
        const current = coll.getItems(false).map(item => item.__helper.getPrimaryKeys(true));
        const deleteDiff = snap ? snapshot.filter(item => !includes(current, item)) : true;
        const insertDiff = current.filter(item => !includes(snapshot, item));
        const target = snapshot.filter(item => includes(current, item)).concat(...insertDiff);
        const equals = core_1.Utils.equals(current, target);
        // wrong order if we just delete and insert to the end (only owning sides can have fixed order)
        if (coll.property.owner && coll.property.fixedOrder && !equals && Array.isArray(deleteDiff)) {
            deleteDiff.length = insertDiff.length = 0;
            deleteDiff.push(...snapshot);
            insertDiff.push(...current);
        }
        if (coll.property.reference === core_1.ReferenceType.ONE_TO_MANY) {
            const cols = coll.property.referencedColumnNames;
            const qb = this.createQueryBuilder(coll.property.type, ctx, true)
                .update({ [coll.property.mappedBy]: pks })
                .getKnexQuery()
                .whereIn(cols, insertDiff);
            return this.rethrow(this.execute(qb));
        }
        return this.rethrow(this.updateCollectionDiff(meta, coll.property, pks, deleteDiff, insertDiff, ctx));
    }
    async loadFromPivotTable(prop, owners, where = {}, orderBy, ctx, options) {
        var _a;
        const pivotProp2 = this.getPivotInverseProperty(prop);
        const ownerMeta = this.metadata.find(pivotProp2.type);
        const targetMeta = this.metadata.find(prop.type);
        const cond = { [`${prop.pivotTable}.${pivotProp2.name}`]: { $in: ownerMeta.compositePK ? owners : owners.map(o => o[0]) } };
        /* istanbul ignore next */
        if (!core_1.Utils.isEmpty(where) && Object.keys(where).every(k => core_1.Utils.isOperator(k, false))) {
            where = cond;
        }
        else {
            where = Object.assign(Object.assign({}, where), cond);
        }
        orderBy = this.getPivotOrderBy(prop, orderBy);
        const qb = this.createQueryBuilder(prop.type, ctx, !!ctx).unsetFlag(core_1.QueryFlag.CONVERT_CUSTOM_TYPES);
        const populate = this.autoJoinOneToOneOwner(targetMeta, [{ field: prop.pivotTable }]);
        const fields = this.buildFields(targetMeta, ((_a = options === null || options === void 0 ? void 0 : options.populate) !== null && _a !== void 0 ? _a : []), [], qb, options === null || options === void 0 ? void 0 : options.fields);
        qb.select(fields).populate(populate).where(where).orderBy(orderBy);
        if (owners.length === 1 && ((options === null || options === void 0 ? void 0 : options.offset) != null || (options === null || options === void 0 ? void 0 : options.limit) != null)) {
            qb.limit(options.limit, options.offset);
        }
        const items = owners.length ? await this.rethrow(qb.execute('all')) : [];
        const map = {};
        const pkProps = ownerMeta.getPrimaryProps();
        owners.forEach(owner => {
            const key = core_1.Utils.getPrimaryKeyHash(prop.joinColumns.map((col, idx) => {
                const pkProp = pkProps[idx];
                return pkProp.customType ? pkProp.customType.convertToJSValue(owner[idx], this.platform) : owner[idx];
            }));
            return map[key] = [];
        });
        items.forEach((item) => {
            const key = core_1.Utils.getPrimaryKeyHash(prop.joinColumns.map((col, idx) => {
                const pkProp = pkProps[idx];
                return pkProp.customType ? pkProp.customType.convertToJSValue(item[`fk__${col}`], this.platform) : item[`fk__${col}`];
            }));
            map[key].push(item);
            prop.joinColumns.forEach(col => delete item[`fk__${col}`]);
            prop.inverseJoinColumns.forEach(col => delete item[`fk__${col}`]);
        });
        return map;
    }
    async execute(queryOrKnex, params = [], method = 'all', ctx) {
        return this.rethrow(this.connection.execute(queryOrKnex, params, method, ctx));
    }
    /**
     * 1:1 owner side needs to be marked for population so QB auto-joins the owner id
     */
    autoJoinOneToOneOwner(meta, populate, fields = []) {
        if (!this.config.get('autoJoinOneToOneOwner') || fields.length > 0) {
            return populate;
        }
        const relationsToPopulate = populate.map(({ field }) => field);
        const toPopulate = meta.relations
            .filter(prop => prop.reference === core_1.ReferenceType.ONE_TO_ONE && !prop.owner && !relationsToPopulate.includes(prop.name))
            .map(prop => ({ field: prop.name, strategy: prop.strategy }));
        return [...populate, ...toPopulate];
    }
    joinedProps(meta, populate) {
        return populate.filter(p => {
            const prop = meta.properties[p.field] || {};
            return (p.strategy || prop.strategy) === core_1.LoadStrategy.JOINED && prop.reference !== core_1.ReferenceType.SCALAR;
        });
    }
    /**
     * @internal
     */
    mergeJoinedResult(rawResults, meta) {
        // group by the root entity primary key first
        const map = {};
        const res = [];
        rawResults.forEach(item => {
            const pk = core_1.Utils.getCompositeKeyHash(item, meta);
            if (map[pk]) {
                map[pk].push(item);
            }
            else {
                map[pk] = [item];
                res.push(item);
            }
        });
        return res;
    }
    getFieldsForJoinedLoad(qb, meta, explicitFields, populate = [], parentTableAlias, parentJoinPath) {
        const fields = [];
        const joinedProps = this.joinedProps(meta, populate);
        const shouldHaveColumn = (prop, populate, fields) => {
            if (!this.shouldHaveColumn(prop, populate)) {
                return false;
            }
            if (!fields || prop.primary) {
                return true;
            }
            return fields.includes(prop.name);
        };
        // alias all fields in the primary table
        meta.props
            .filter(prop => shouldHaveColumn(prop, populate, explicitFields))
            .forEach(prop => fields.push(...this.mapPropToFieldNames(qb, prop, parentTableAlias)));
        joinedProps.forEach(relation => {
            const prop = meta.properties[relation.field];
            const meta2 = this.metadata.find(prop.type);
            const tableAlias = qb.getNextAlias(prop.name);
            const field = parentTableAlias ? `${parentTableAlias}.${prop.name}` : prop.name;
            const path = parentJoinPath ? `${parentJoinPath}.${prop.name}` : `${meta.name}.${prop.name}`;
            qb.join(field, tableAlias, {}, 'leftJoin', path);
            const childExplicitFields = explicitFields === null || explicitFields === void 0 ? void 0 : explicitFields.filter(f => core_1.Utils.isPlainObject(f)).map(o => o[prop.name])[0];
            fields.push(...this.getFieldsForJoinedLoad(qb, meta2, childExplicitFields, relation.children, tableAlias, path));
        });
        return fields;
    }
    /**
     * @internal
     */
    mapPropToFieldNames(qb, prop, tableAlias) {
        var _a;
        const aliased = qb.ref(tableAlias ? `${tableAlias}__${prop.fieldNames[0]}` : prop.fieldNames[0]).toString();
        if (((_a = prop.customType) === null || _a === void 0 ? void 0 : _a.convertToJSValueSQL) && tableAlias) {
            const prefixed = qb.ref(prop.fieldNames[0]).withSchema(tableAlias).toString();
            return [qb.raw(prop.customType.convertToJSValueSQL(prefixed, this.platform) + ' as ' + aliased).toString()];
        }
        if (prop.formula) {
            const alias = qb.ref(tableAlias !== null && tableAlias !== void 0 ? tableAlias : qb.alias).toString();
            return [`${prop.formula(alias)} as ${aliased}`];
        }
        if (tableAlias) {
            return prop.fieldNames.map(fieldName => qb.ref(fieldName).withSchema(tableAlias).as(`${tableAlias}__${fieldName}`));
        }
        return prop.fieldNames;
    }
    createQueryBuilder(entityName, ctx, write, convertCustomTypes) {
        const qb = new QueryBuilder_1.QueryBuilder(entityName, this.metadata, this, ctx, undefined, write ? 'write' : 'read');
        if (!convertCustomTypes) {
            qb.unsetFlag(core_1.QueryFlag.CONVERT_CUSTOM_TYPES);
        }
        return qb;
    }
    extractManyToMany(entityName, data) {
        if (!this.metadata.has(entityName)) {
            return {};
        }
        const ret = {};
        this.metadata.find(entityName).relations.forEach(prop => {
            if (prop.reference === core_1.ReferenceType.MANY_TO_MANY && data[prop.name]) {
                ret[prop.name] = data[prop.name].map((item) => core_1.Utils.asArray(item));
                delete data[prop.name];
            }
        });
        return ret;
    }
    async processManyToMany(meta, pks, collections, clear, ctx) {
        if (!meta) {
            return;
        }
        for (const prop of meta.relations) {
            if (collections[prop.name]) {
                await this.rethrow(this.updateCollectionDiff(meta, prop, pks, clear, collections[prop.name], ctx));
            }
        }
    }
    async updateCollectionDiff(meta, prop, pks, deleteDiff, insertDiff, ctx) {
        if (!deleteDiff) {
            deleteDiff = [];
        }
        if (deleteDiff === true || deleteDiff.length > 0) {
            const qb1 = this.createQueryBuilder(prop.pivotTable, ctx, true).unsetFlag(core_1.QueryFlag.CONVERT_CUSTOM_TYPES);
            const knex = qb1.getKnex();
            if (Array.isArray(deleteDiff)) {
                knex.whereIn(prop.inverseJoinColumns, deleteDiff);
            }
            prop.joinColumns.forEach((joinColumn, idx) => knex.andWhere(joinColumn, pks[idx]));
            await this.execute(knex.delete());
        }
        if (insertDiff.length === 0) {
            return;
        }
        const items = insertDiff.map(item => {
            const cond = {};
            prop.joinColumns.forEach((joinColumn, idx) => cond[joinColumn] = pks[idx]);
            prop.inverseJoinColumns.forEach((inverseJoinColumn, idx) => cond[inverseJoinColumn] = item[idx]);
            return cond;
        });
        /* istanbul ignore else */
        if (this.platform.allowsMultiInsert()) {
            await this.nativeInsertMany(prop.pivotTable, items, ctx, false, false);
        }
        else {
            await core_1.Utils.runSerial(items, item => this.createQueryBuilder(prop.pivotTable, ctx, true).unsetFlag(core_1.QueryFlag.CONVERT_CUSTOM_TYPES).insert(item).execute('run', false));
        }
    }
    async lockPessimistic(entity, mode, tables, ctx) {
        const qb = this.createQueryBuilder(entity.constructor.name, ctx).unsetFlag(core_1.QueryFlag.CONVERT_CUSTOM_TYPES);
        const meta = entity.__helper.__meta;
        const cond = core_1.Utils.getPrimaryKeyCond(entity, meta.primaryKeys);
        qb.select('1').where(cond).setLockMode(mode, tables);
        await this.rethrow(qb.execute());
    }
    buildJoinedPropsOrderBy(entityName, qb, meta, populate, parentPath) {
        const orderBy = {};
        const joinedProps = this.joinedProps(meta, populate);
        joinedProps.forEach(relation => {
            const prop = meta.properties[relation.field];
            const propOrderBy = prop.orderBy;
            const path = `${parentPath ? parentPath : entityName}.${relation.field}`;
            const propAlias = qb.getAliasForJoinPath(path);
            if (propOrderBy) {
                Object.keys(propOrderBy).forEach(field => {
                    Object.assign(orderBy, { [`${propAlias}.${field}`]: propOrderBy[field] });
                });
            }
            if (relation.children) {
                const meta2 = this.metadata.find(prop.type);
                Object.assign(orderBy, Object.assign({}, this.buildJoinedPropsOrderBy(prop.name, qb, meta2, relation.children, path)));
            }
        });
        return orderBy;
    }
    buildFields(meta, populate, joinedProps, qb, fields) {
        const lazyProps = meta.props.filter(prop => prop.lazy && !populate.some(p => p.field === prop.name || p.all));
        const hasLazyFormulas = meta.props.some(p => p.lazy && p.formula);
        const requiresSQLConversion = meta.props.some(p => { var _a; return (_a = p.customType) === null || _a === void 0 ? void 0 : _a.convertToJSValueSQL; });
        const hasExplicitFields = !!fields;
        const ret = [];
        if (joinedProps.length > 0) {
            ret.push(...this.getFieldsForJoinedLoad(qb, meta, fields, populate));
        }
        else if (fields) {
            for (const field of [...fields]) {
                if (core_1.Utils.isPlainObject(field) || field.toString().includes('.')) {
                    continue;
                }
                ret.push(field);
            }
            ret.unshift(...meta.primaryKeys.filter(pk => !fields.includes(pk)));
        }
        else if (lazyProps.filter(p => !p.formula).length > 0) {
            const props = meta.props.filter(prop => this.shouldHaveColumn(prop, populate, false));
            ret.push(...core_1.Utils.flatten(props.filter(p => !lazyProps.includes(p)).map(p => p.fieldNames)));
        }
        else if (hasLazyFormulas || requiresSQLConversion) {
            ret.push('*');
        }
        if (ret.length > 0 && !hasExplicitFields) {
            meta.props
                .filter(prop => prop.formula && !lazyProps.includes(prop))
                .forEach(prop => {
                const alias = qb.ref(qb.alias).toString();
                const aliased = qb.ref(prop.fieldNames[0]).toString();
                ret.push(`${prop.formula(alias)} as ${aliased}`);
            });
            meta.props
                .filter(prop => { var _a, _b; return ((_a = prop.customType) === null || _a === void 0 ? void 0 : _a.convertToDatabaseValueSQL) || ((_b = prop.customType) === null || _b === void 0 ? void 0 : _b.convertToJSValueSQL); })
                .forEach(prop => ret.push(prop.name));
        }
        return ret.length > 0 ? ret : ['*'];
    }
}
exports.AbstractSqlDriver = AbstractSqlDriver;
