"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseTable = void 0;
const core_1 = require("@mikro-orm/core");
/**
 * @internal
 */
class DatabaseTable {
    constructor(platform, name, schema) {
        this.platform = platform;
        this.name = name;
        this.schema = schema;
        this.columns = {};
        this.indexes = [];
        this.foreignKeys = {};
    }
    getColumns() {
        return Object.values(this.columns);
    }
    getColumn(name) {
        return this.columns[name];
    }
    getIndexes() {
        return this.indexes;
    }
    init(cols, indexes, pks, fks, enums) {
        this.indexes = indexes;
        this.foreignKeys = fks;
        this.columns = cols.reduce((o, v) => {
            var _a;
            const index = indexes.filter(i => i.columnNames[0] === v.name);
            v.primary = v.primary || pks.includes(v.name);
            v.unique = index.some(i => i.unique && !i.primary);
            const type = v.name in enums ? 'enum' : v.type;
            v.mappedType = this.platform.getMappedType(type);
            v.default = ((_a = v.default) === null || _a === void 0 ? void 0 : _a.toString().startsWith('nextval(')) ? null : v.default;
            v.enumItems = enums[v.name] || [];
            o[v.name] = v;
            return o;
        }, {});
    }
    addColumn(column) {
        this.columns[column.name] = column;
    }
    addColumnFromProperty(prop, meta) {
        prop.fieldNames.forEach((field, idx) => {
            var _a;
            var _b;
            const type = prop.enum ? 'enum' : prop.columnTypes[idx];
            const mappedType = this.platform.getMappedType(type);
            if (mappedType instanceof core_1.DecimalType) {
                const match = prop.columnTypes[idx].match(/\w+\((\d+), ?(\d+)\)/);
                /* istanbul ignore else */
                if (match) {
                    prop.precision = +match[1];
                    prop.scale = +match[2];
                    prop.length = undefined;
                }
            }
            const primary = !meta.compositePK && !!prop.primary && prop.reference === core_1.ReferenceType.SCALAR && this.platform.isNumericColumn(mappedType);
            this.columns[field] = {
                name: prop.fieldNames[idx],
                type: prop.columnTypes[idx],
                mappedType,
                unsigned: prop.unsigned && this.platform.isNumericColumn(mappedType),
                autoincrement: (_a = prop.autoincrement) !== null && _a !== void 0 ? _a : primary,
                primary,
                nullable: !!prop.nullable,
                length: prop.length,
                precision: prop.precision,
                scale: prop.scale,
                default: prop.defaultRaw,
                enumItems: prop.items,
                comment: prop.comment,
            };
            (_b = this.columns[field]).unsigned || (_b.unsigned = this.columns[field].autoincrement);
            const defaultValue = this.platform.getSchemaHelper().normalizeDefaultValue(prop.defaultRaw, prop.length);
            this.columns[field].default = defaultValue;
        });
        if ([core_1.ReferenceType.MANY_TO_ONE, core_1.ReferenceType.ONE_TO_ONE].includes(prop.reference)) {
            const constraintName = this.getIndexName(true, prop.fieldNames, 'foreign');
            this.foreignKeys[constraintName] = {
                constraintName,
                columnNames: prop.fieldNames,
                localTableName: this.getShortestName(),
                referencedColumnNames: prop.referencedColumnNames,
                referencedTableName: prop.targetMeta.schema ? `${prop.targetMeta.schema}.${prop.referencedTableName}` : prop.referencedTableName,
            };
            const cascade = prop.cascade.includes(core_1.Cascade.REMOVE) || prop.cascade.includes(core_1.Cascade.ALL);
            if (prop.onDelete || cascade || prop.nullable) {
                this.foreignKeys[constraintName].deleteRule = prop.onDelete || (cascade ? 'cascade' : 'set null');
            }
            if (prop.onUpdateIntegrity || prop.cascade.includes(core_1.Cascade.PERSIST) || prop.cascade.includes(core_1.Cascade.ALL)) {
                this.foreignKeys[constraintName].updateRule = prop.onUpdateIntegrity || 'cascade';
            }
        }
        if (prop.index) {
            this.indexes.push({
                columnNames: prop.fieldNames,
                composite: prop.fieldNames.length > 1,
                keyName: this.getIndexName(prop.index, prop.fieldNames, 'index'),
                primary: false,
                unique: false,
            });
        }
        if (prop.unique && !(prop.primary && !meta.compositePK)) {
            this.indexes.push({
                columnNames: prop.fieldNames,
                composite: prop.fieldNames.length > 1,
                keyName: this.getIndexName(prop.unique, prop.fieldNames, 'unique'),
                primary: false,
                unique: true,
            });
        }
    }
    getIndexName(value, columnNames, type) {
        if (core_1.Utils.isString(value)) {
            return value;
        }
        return this.platform.getIndexName(this.name, columnNames, type);
    }
    getEntityDeclaration(namingStrategy, schemaHelper) {
        const name = namingStrategy.getClassName(this.name, '_');
        const schema = new core_1.EntitySchema({ name, collection: this.name });
        const compositeFkIndexes = {};
        const compositeFkUniques = {};
        for (const index of this.indexes.filter(index => index.columnNames.length > 1)) {
            const properties = index.columnNames.map(col => this.getPropertyName(namingStrategy, this.getColumn(col)));
            const ret = { name: index.keyName, properties: core_1.Utils.unique(properties) };
            if (ret.properties.length === 1) {
                const map = index.unique ? compositeFkUniques : compositeFkIndexes;
                map[ret.properties[0]] = { keyName: index.keyName };
                continue;
            }
            if (index.primary) {
                //
            }
            else if (index.unique) {
                schema.addUnique(ret);
            }
            else {
                schema.addIndex(ret);
            }
        }
        for (const column of this.getColumns()) {
            const prop = this.getPropertyDeclaration(column, namingStrategy, schemaHelper, compositeFkIndexes, compositeFkUniques);
            schema.addProperty(prop.name, prop.type, prop);
        }
        const meta = schema.init().meta;
        meta.relations
            .filter(prop => prop.primary && prop.reference === core_1.ReferenceType.MANY_TO_ONE && !meta.compositePK)
            .forEach(prop => prop.reference = core_1.ReferenceType.ONE_TO_ONE);
        return meta;
    }
    /**
     * The shortest name is stripped of the default namespace. All other namespaced elements are returned as full-qualified names.
     */
    getShortestName(defaultNamespaceName) {
        if (!this.schema || this.schema === defaultNamespaceName || this.name.startsWith(this.schema + '.')) {
            return this.name;
        }
        return `${this.schema}.${this.name}`;
    }
    getForeignKeys() {
        return this.foreignKeys;
    }
    hasColumn(columnName) {
        return columnName in this.columns;
    }
    getIndex(indexName) {
        return this.indexes.find(i => i.keyName === indexName);
    }
    hasIndex(indexName) {
        return !!this.getIndex(indexName);
    }
    getPrimaryKey() {
        return this.indexes.find(i => i.primary);
    }
    hasPrimaryKey() {
        return !!this.getPrimaryKey();
    }
    getPropertyDeclaration(column, namingStrategy, schemaHelper, compositeFkIndexes, compositeFkUniques) {
        var _a, _b;
        const fk = Object.values(this.foreignKeys).find(fk => fk.columnNames.includes(column.name));
        const prop = this.getPropertyName(namingStrategy, column);
        const index = compositeFkIndexes[prop] || this.indexes.find(idx => idx.columnNames[0] === column.name && !idx.composite && !idx.unique && !idx.primary);
        const unique = compositeFkUniques[prop] || this.indexes.find(idx => idx.columnNames[0] === column.name && !idx.composite && idx.unique && !idx.primary);
        const reference = this.getReferenceType(fk, unique);
        const type = this.getPropertyType(namingStrategy, column, fk);
        const fkOptions = {};
        if (fk) {
            fkOptions.fieldNames = fk.columnNames;
            fkOptions.referencedTableName = fk.referencedTableName;
            fkOptions.referencedColumnNames = fk.referencedColumnNames;
            /* istanbul ignore next */
            fkOptions.onUpdateIntegrity = (_a = fk.updateRule) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            /* istanbul ignore next */
            fkOptions.onDelete = (_b = fk.deleteRule) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        }
        return Object.assign({ name: prop, type,
            reference, columnType: column.type, default: this.getPropertyDefaultValue(schemaHelper, column, type), defaultRaw: this.getPropertyDefaultValue(schemaHelper, column, type, true), nullable: column.nullable, primary: column.primary, fieldName: column.name, length: column.length, index: index ? index.keyName : undefined, unique: unique ? unique.keyName : undefined }, fkOptions);
    }
    getReferenceType(fk, unique) {
        if (fk && unique) {
            return core_1.ReferenceType.ONE_TO_ONE;
        }
        if (fk) {
            return core_1.ReferenceType.MANY_TO_ONE;
        }
        return core_1.ReferenceType.SCALAR;
    }
    getPropertyName(namingStrategy, column) {
        const fk = Object.values(this.foreignKeys).find(fk => fk.columnNames.includes(column.name));
        let field = column.name;
        if (fk) {
            const idx = fk.columnNames.indexOf(column.name);
            field = field.replace(new RegExp(`_${fk.referencedColumnNames[idx]}$`), '');
        }
        return namingStrategy.columnNameToProperty(field);
    }
    getPropertyType(namingStrategy, column, fk) {
        var _a, _b;
        if (fk) {
            return namingStrategy.getClassName(fk.referencedTableName, '_');
        }
        return (_b = (_a = column.mappedType) === null || _a === void 0 ? void 0 : _a.compareAsType()) !== null && _b !== void 0 ? _b : 'unknown';
    }
    getPropertyDefaultValue(schemaHelper, column, propType, raw = false) {
        const empty = raw ? 'null' : undefined;
        if (!column.default) {
            return empty;
        }
        const val = schemaHelper.normalizeDefaultValue(column.default, column.length);
        if (column.nullable && val === 'null') {
            return empty;
        }
        if (propType === 'boolean' && !raw) {
            return !['0', 'false', 'f', 'n', 'no', 'off'].includes('' + column.default);
        }
        if (propType === 'number') {
            return +column.default;
        }
        return '' + val;
    }
    addIndex(meta, index, type) {
        const properties = core_1.Utils.flatten(core_1.Utils.asArray(index.properties).map(prop => meta.properties[prop].fieldNames));
        if (properties.length === 0) {
            return;
        }
        const name = this.getIndexName(index.name, properties, type);
        this.indexes.push({
            keyName: name,
            columnNames: properties,
            composite: properties.length > 1,
            primary: type === 'primary',
            unique: type !== 'index',
            type: index.type,
            expression: index.expression,
        });
    }
    isInDefaultNamespace(defaultNamespaceName) {
        return this.schema === defaultNamespaceName || this.schema == null;
    }
    toJSON() {
        const _a = this, { platform, columns } = _a, rest = __rest(_a, ["platform", "columns"]);
        const columnsMapped = Object.keys(columns).reduce((o, col) => {
            const _a = columns[col], { mappedType } = _a, restCol = __rest(_a, ["mappedType"]);
            o[col] = restCol;
            o[col].mappedType = Object.keys(core_1.t).find(k => core_1.t[k] === mappedType.constructor);
            return o;
        }, {});
        return Object.assign({ columns: columnsMapped }, rest);
    }
}
exports.DatabaseTable = DatabaseTable;
