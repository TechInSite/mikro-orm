"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteSchemaHelper = void 0;
const knex_1 = require("@mikro-orm/knex");
class SqliteSchemaHelper extends knex_1.SchemaHelper {
    getSchemaBeginning(charset) {
        return 'pragma foreign_keys = off;\n\n';
    }
    getSchemaEnd() {
        return 'pragma foreign_keys = on;\n';
    }
    supportsSchemaConstraints() {
        return false;
    }
    getListTablesSQL() {
        return `select name as table_name from sqlite_master where type = 'table' and name != 'sqlite_sequence' and name != 'geometry_columns' and name != 'spatial_ref_sys' `
            + `union all select name as table_name from sqlite_temp_master where type = 'table' order by name`;
    }
    async getColumns(connection, tableName, schemaName) {
        const columns = await connection.execute(`pragma table_info('${tableName}')`);
        return columns.map(col => ({
            name: col.name,
            type: col.type,
            default: col.dflt_value,
            nullable: !col.notnull,
            primary: !!col.pk,
            mappedType: connection.getPlatform().getMappedType(col.type),
            unsigned: false,
            autoincrement: false,
        }));
    }
    async getPrimaryKeys(connection, indexes, tableName, schemaName) {
        const sql = `pragma table_info(\`${tableName}\`)`;
        const cols = await connection.execute(sql);
        return cols.filter(col => !!col.pk).map(col => col.name);
    }
    async getIndexes(connection, tableName, schemaName) {
        const sql = `pragma table_info(\`${tableName}\`)`;
        const cols = await connection.execute(sql);
        const indexes = await connection.execute(`pragma index_list(\`${tableName}\`)`);
        const ret = [];
        for (const col of cols.filter(c => c.pk)) {
            ret.push({
                columnNames: [col.name],
                keyName: 'primary',
                unique: true,
                primary: true,
            });
        }
        for (const index of indexes.filter(index => !this.isImplicitIndex(index.name))) {
            const res = await connection.execute(`pragma index_info(\`${index.name}\`)`);
            ret.push(...res.map(row => ({
                columnNames: [row.name],
                keyName: index.name,
                unique: !!index.unique,
                primary: false,
            })));
        }
        return this.mapIndexes(ret);
    }
    getForeignKeysSQL(tableName) {
        return `pragma foreign_key_list(\`${tableName}\`)`;
    }
    mapForeignKeys(fks, tableName) {
        return fks.reduce((ret, fk) => {
            ret[fk.from] = {
                constraintName: this.platform.getIndexName(tableName, [fk.from], 'foreign'),
                columnName: fk.from,
                columnNames: [fk.from],
                localTableName: tableName,
                referencedTableName: fk.table,
                referencedColumnName: fk.to,
                referencedColumnNames: [fk.to],
                updateRule: fk.on_update.toLowerCase(),
                deleteRule: fk.on_delete.toLowerCase(),
            };
            return ret;
        }, {});
    }
    async databaseExists(connection, name) {
        return true;
    }
    /**
     * Implicit indexes will be ignored when diffing
     */
    isImplicitIndex(name) {
        // Ignore indexes with reserved names, e.g. autoindexes
        return name.startsWith('sqlite_');
    }
}
exports.SqliteSchemaHelper = SqliteSchemaHelper;
