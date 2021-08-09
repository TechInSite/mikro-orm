"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaHelper = void 0;
const core_1 = require("@mikro-orm/core");
class SchemaHelper {
    constructor(platform) {
        this.platform = platform;
    }
    getSchemaBeginning(charset) {
        return `${this.disableForeignKeysSQL()}`;
    }
    disableForeignKeysSQL() {
        return '';
    }
    enableForeignKeysSQL() {
        return '';
    }
    getSchemaEnd() {
        return `${this.enableForeignKeysSQL()}`;
    }
    finalizeTable(table, charset, collate) {
        //
    }
    supportsSchemaConstraints() {
        return true;
    }
    async getPrimaryKeys(connection, indexes, tableName, schemaName) {
        const pk = indexes.find(i => i.primary);
        return pk ? pk.columnNames : [];
    }
    async getForeignKeys(connection, tableName, schemaName) {
        const fks = await connection.execute(this.getForeignKeysSQL(tableName, schemaName));
        return this.mapForeignKeys(fks, tableName, schemaName);
    }
    async getEnumDefinitions(connection, tableName, schemaName) {
        return {};
    }
    getListTablesSQL() {
        throw new Error('Not supported by given driver');
    }
    getRenameColumnSQL(tableName, oldColumnName, to) {
        return `alter table ${this.platform.quoteIdentifier(tableName)} rename column ${this.platform.quoteIdentifier(oldColumnName)} to ${this.platform.quoteIdentifier(to.name)}`;
    }
    getCreateIndexSQL(tableName, index) {
        /* istanbul ignore if */
        if (index.expression) {
            return index.expression;
        }
        tableName = this.platform.quoteIdentifier(tableName);
        const keyName = this.platform.quoteIdentifier(index.keyName);
        return `create index ${keyName} on ${tableName} (${index.columnNames.map(c => this.platform.quoteIdentifier(c)).join(', ')})`;
    }
    getDropIndexSQL(tableName, index) {
        return `drop index ${this.platform.quoteIdentifier(index.keyName)}`;
    }
    getRenameIndexSQL(tableName, index, oldIndexName) {
        return [this.getDropIndexSQL(tableName, Object.assign(Object.assign({}, index), { keyName: oldIndexName })), this.getCreateIndexSQL(tableName, index)].join(';\n');
    }
    createTableColumn(table, column, fromTable, changedProperties) {
        var _a, _b;
        const compositePK = (_a = fromTable.getPrimaryKey()) === null || _a === void 0 ? void 0 : _a.composite;
        if (column.autoincrement && !compositePK && (!changedProperties || changedProperties.has('autoincrement') || changedProperties.has('type'))) {
            if (column.mappedType instanceof core_1.BigIntType) {
                return table.bigIncrements(column.name, { primaryKey: !changedProperties });
            }
            return table.increments(column.name, { primaryKey: !changedProperties });
        }
        if (column.mappedType instanceof core_1.EnumType && ((_b = column.enumItems) === null || _b === void 0 ? void 0 : _b.every(item => core_1.Utils.isString(item)))) {
            return table.enum(column.name, column.enumItems);
        }
        return table.specificType(column.name, column.type);
    }
    configureColumn(column, col, knex, changedProperties) {
        const guard = (key) => !changedProperties || changedProperties.has(key);
        core_1.Utils.runIfNotEmpty(() => col.nullable(), column.nullable && guard('nullable'));
        core_1.Utils.runIfNotEmpty(() => col.notNullable(), !column.nullable);
        core_1.Utils.runIfNotEmpty(() => col.unsigned(), column.unsigned);
        core_1.Utils.runIfNotEmpty(() => col.comment(column.comment), column.comment && !changedProperties);
        this.configureColumnDefault(column, col, knex, changedProperties);
        return col;
    }
    configureColumnDefault(column, col, knex, changedProperties) {
        const guard = (key) => !changedProperties || changedProperties.has(key);
        if (changedProperties) {
            core_1.Utils.runIfNotEmpty(() => col.defaultTo(column.default === undefined ? null : knex.raw(column.default)), guard('default'));
        }
        else {
            core_1.Utils.runIfNotEmpty(() => col.defaultTo(knex.raw(column.default)), column.default !== undefined);
        }
        return col;
    }
    getPreAlterTable(tableDiff, safe) {
        return '';
    }
    getAlterColumnAutoincrement(tableName, column) {
        return '';
    }
    getChangeColumnCommentSQL(tableName, to) {
        return '';
    }
    async getColumns(connection, tableName, schemaName) {
        throw new Error('Not supported by given driver');
    }
    async getIndexes(connection, tableName, schemaName) {
        throw new Error('Not supported by given driver');
    }
    async mapIndexes(indexes) {
        const map = {};
        indexes.forEach(index => {
            if (map[index.keyName]) {
                map[index.keyName].composite = true;
                map[index.keyName].columnNames.push(index.columnNames[0]);
            }
            else {
                map[index.keyName] = index;
            }
        });
        return Object.values(map);
    }
    getForeignKeysSQL(tableName, schemaName) {
        throw new Error('Not supported by given driver');
    }
    mapForeignKeys(fks, tableName, schemaName) {
        return fks.reduce((ret, fk) => {
            if (ret[fk.constraint_name]) {
                ret[fk.constraint_name].columnNames.push(fk.column_name);
                ret[fk.constraint_name].referencedColumnNames.push(fk.referenced_column_name);
            }
            else {
                ret[fk.constraint_name] = {
                    columnNames: [fk.column_name],
                    constraintName: fk.constraint_name,
                    localTableName: schemaName ? `${schemaName}.${tableName}` : tableName,
                    referencedTableName: fk.referenced_schema_name ? `${fk.referenced_schema_name}.${fk.referenced_table_name}` : fk.referenced_table_name,
                    referencedColumnNames: [fk.referenced_column_name],
                    updateRule: fk.update_rule.toLowerCase(),
                    deleteRule: fk.delete_rule.toLowerCase(),
                };
            }
            return ret;
        }, {});
    }
    normalizeDefaultValue(defaultValue, length, defaultValues = {}) {
        if (defaultValue == null) {
            return defaultValue;
        }
        const genericValue = defaultValue.replace(/\(\d+\)/, '(?)').toLowerCase();
        const norm = defaultValues[genericValue];
        if (!norm) {
            return defaultValue;
        }
        return norm[0].replace('(?)', length != null ? `(${length})` : '');
    }
    getCreateDatabaseSQL(name) {
        return `create database ${name}`;
    }
    getDropDatabaseSQL(name) {
        return `drop database if exists ${name}`;
    }
    getDatabaseExistsSQL(name) {
        return `select 1 from information_schema.schemata where schema_name = '${name}'`;
    }
    getDatabaseNotExistsError(dbName) {
        return `Unknown database '${dbName}'`;
    }
    getManagementDbName() {
        return 'information_schema';
    }
    getDefaultEmptyString() {
        return "''";
    }
    async databaseExists(connection, name) {
        try {
            const res = await connection.execute(this.getDatabaseExistsSQL(name));
            return res.length > 0;
        }
        catch (e) {
            if (e.message.includes(this.getDatabaseNotExistsError(name))) {
                return false;
            }
            throw e;
        }
    }
    /**
     * Uses `raw` method injected in `AbstractSqlConnection` to allow adding custom queries inside alter statements.
     */
    pushTableQuery(table, expression, grouping = 'alterTable') {
        table._statements.push({ grouping, method: 'raw', args: [expression] });
    }
}
exports.SchemaHelper = SchemaHelper;
