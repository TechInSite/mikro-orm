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
exports.DatabaseSchema = void 0;
const core_1 = require("@mikro-orm/core");
const DatabaseTable_1 = require("./DatabaseTable");
/**
 * @internal
 */
class DatabaseSchema {
    constructor(platform, name) {
        this.platform = platform;
        this.name = name;
        this.tables = [];
        this.namespaces = [];
    }
    addTable(name, schema) {
        const namespaceName = schema !== null && schema !== void 0 ? schema : undefined;
        const table = new DatabaseTable_1.DatabaseTable(this.platform, name, namespaceName);
        this.tables.push(table);
        if (namespaceName != null && !table.isInDefaultNamespace(this.name) && !this.hasNamespace(namespaceName)) {
            this.namespaces.push(namespaceName);
        }
        return table;
    }
    getTables() {
        return this.tables;
    }
    getTable(name) {
        // console.log(name, this.tables.map(t => [t.schema, t.name]), !!this.tables.find(t => t.name === name || `${t.schema}.${t.name}` === name));
        return this.tables.find(t => t.name === name || `${t.schema}.${t.name}` === name);
    }
    hasTable(name) {
        return !!this.getTable(name);
    }
    hasNamespace(namespace) {
        return this.namespaces.includes(namespace);
    }
    getNamespaces() {
        return this.namespaces;
    }
    static async create(connection, platform, config) {
        const schema = new DatabaseSchema(platform, config.get('schema'));
        const tables = await connection.execute(platform.getSchemaHelper().getListTablesSQL());
        for (const t of tables) {
            if (t.table_name === config.get('migrations').tableName) {
                continue;
            }
            const table = schema.addTable(t.table_name, t.schema_name);
            table.comment = t.table_comment;
            const cols = await platform.getSchemaHelper().getColumns(connection, table.name, table.schema);
            const indexes = await platform.getSchemaHelper().getIndexes(connection, table.name, table.schema);
            const pks = await platform.getSchemaHelper().getPrimaryKeys(connection, indexes, table.name, table.schema);
            const fks = await platform.getSchemaHelper().getForeignKeys(connection, table.name, table.schema);
            const enums = await platform.getSchemaHelper().getEnumDefinitions(connection, table.name, table.schema);
            table.init(cols, indexes, pks, fks, enums);
        }
        return schema;
    }
    static fromMetadata(metadata, platform, config) {
        var _a;
        const schema = new DatabaseSchema(platform, config.get('schema'));
        for (const meta of metadata) {
            const table = schema.addTable(meta.collection, (_a = meta.schema) !== null && _a !== void 0 ? _a : config.get('schema'));
            table.comment = meta.comment;
            meta.props
                .filter(prop => this.shouldHaveColumn(meta, prop))
                .forEach(prop => table.addColumnFromProperty(prop, meta));
            meta.indexes.forEach(index => table.addIndex(meta, index, 'index'));
            meta.uniques.forEach(index => table.addIndex(meta, index, 'unique'));
            table.addIndex(meta, { properties: meta.props.filter(prop => prop.primary).map(prop => prop.name) }, 'primary');
        }
        return schema;
    }
    static shouldHaveColumn(meta, prop) {
        if (prop.persist === false || !prop.fieldNames) {
            return false;
        }
        if (meta.pivotTable || (core_1.ReferenceType.EMBEDDED && prop.object)) {
            return true;
        }
        const getRootProperty = (prop) => prop.embedded ? getRootProperty(meta.properties[prop.embedded[0]]) : prop;
        const rootProp = getRootProperty(prop);
        if (rootProp.reference === core_1.ReferenceType.EMBEDDED) {
            return prop === rootProp || !rootProp.object;
        }
        return [core_1.ReferenceType.SCALAR, core_1.ReferenceType.MANY_TO_ONE].includes(prop.reference) || (prop.reference === core_1.ReferenceType.ONE_TO_ONE && prop.owner);
    }
    toJSON() {
        const _a = this, { platform } = _a, rest = __rest(_a, ["platform"]);
        return rest;
    }
}
exports.DatabaseSchema = DatabaseSchema;
