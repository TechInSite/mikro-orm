"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSqlSchemaHelper = void 0;
const core_1 = require("@mikro-orm/core");
const knex_1 = require("@mikro-orm/knex");
class PostgreSqlSchemaHelper extends knex_1.SchemaHelper {
    getSchemaBeginning(charset) {
        return `set names '${charset}';\n${this.disableForeignKeysSQL()}\n\n`;
    }
    getSchemaEnd() {
        return `${this.enableForeignKeysSQL()}\n`;
    }
    getListTablesSQL() {
        return `select table_name, nullif(table_schema, 'public') as schema_name, `
            + `(select pg_catalog.obj_description(c.oid) from pg_catalog.pg_class c
          where c.oid = (select ('"' || table_schema || '"."' || table_name || '"')::regclass::oid) and c.relname = table_name) as table_comment `
            + `from information_schema.tables `
            + `where table_schema not like 'pg_%' and table_schema != 'information_schema' `
            + `and table_name != 'geometry_columns' and table_name != 'spatial_ref_sys' and table_type != 'VIEW' order by table_name`;
    }
    async getColumns(connection, tableName, schemaName = 'public') {
        const sql = `select column_name,
      column_default,
      is_nullable,
      udt_name,
      coalesce(datetime_precision,
      character_maximum_length) length,
      numeric_precision,
      numeric_scale,
      data_type,
      (select pg_catalog.col_description(c.oid, cols.ordinal_position::int)
        from pg_catalog.pg_class c
        where c.oid = (select ('"' || cols.table_schema || '"."' || cols.table_name || '"')::regclass::oid) and c.relname = cols.table_name) as column_comment
      from information_schema.columns cols where table_schema = '${schemaName}' and table_name = '${tableName}'`;
        const columns = await connection.execute(sql);
        const str = (val) => val != null ? '' + val : val;
        return columns.map(col => {
            var _a;
            const mappedType = connection.getPlatform().getMappedType(col.data_type);
            const increments = ((_a = col.column_default) === null || _a === void 0 ? void 0 : _a.includes('nextval')) && connection.getPlatform().isNumericColumn(mappedType);
            return ({
                name: col.column_name,
                type: col.data_type.toLowerCase() === 'array' ? col.udt_name.replace(/^_(.*)$/, '$1[]') : col.udt_name,
                mappedType,
                length: col.length,
                precision: col.numeric_precision,
                scale: col.numeric_scale,
                nullable: col.is_nullable === 'YES',
                default: str(this.normalizeDefaultValue(col.column_default, col.length)),
                unsigned: increments,
                autoincrement: increments,
                comment: col.column_comment,
            });
        });
    }
    async getIndexes(connection, tableName, schemaName) {
        const sql = this.getIndexesSQL(tableName, schemaName);
        const indexes = await connection.execute(sql);
        return this.mapIndexes(indexes.map(index => ({
            columnNames: [index.column_name],
            keyName: index.constraint_name,
            unique: index.unique,
            primary: index.primary,
        })));
    }
    getForeignKeysSQL(tableName, schemaName = 'public') {
        return `select kcu.table_name as table_name, rel_kcu.table_name as referenced_table_name,
      case when rel_kcu.constraint_schema = 'public' then null else rel_kcu.constraint_schema end as referenced_schema_name,
      kcu.column_name as column_name,
      rel_kcu.column_name as referenced_column_name, kcu.constraint_name, rco.update_rule, rco.delete_rule
      from information_schema.table_constraints tco
      join information_schema.key_column_usage kcu
        on tco.constraint_schema = kcu.constraint_schema
        and tco.constraint_name = kcu.constraint_name
      join information_schema.referential_constraints rco
        on tco.constraint_schema = rco.constraint_schema
        and tco.constraint_name = rco.constraint_name
      join information_schema.key_column_usage rel_kcu
        on rco.unique_constraint_schema = rel_kcu.constraint_schema
        and rco.unique_constraint_name = rel_kcu.constraint_name
        and kcu.ordinal_position = rel_kcu.ordinal_position
      where tco.table_name = '${tableName}' and tco.table_schema = '${schemaName}' and tco.constraint_schema = '${schemaName}' and tco.constraint_type = 'FOREIGN KEY'
      order by kcu.table_schema, kcu.table_name, kcu.ordinal_position, kcu.constraint_name`;
    }
    async getEnumDefinitions(connection, tableName, schemaName = 'public') {
        const sql = `select conrelid::regclass as table_from, conname, pg_get_constraintdef(c.oid) as enum_def
      from pg_constraint c join pg_namespace n on n.oid = c.connamespace
      where contype = 'c' and conrelid = '"${schemaName}"."${tableName}"'::regclass order by contype`;
        const enums = await connection.execute(sql);
        return enums.reduce((o, item) => {
            // check constraints are defined as one of:
            // `CHECK ((type = ANY (ARRAY['local'::text, 'global'::text])))`
            // `CHECK (((enum_test)::text = ANY ((ARRAY['a'::character varying, 'b'::character varying, 'c'::character varying])::text[])))`
            // `CHECK ((type = 'a'::text))`
            const m1 = item.enum_def.match(/check \(\(\((\w+)\)::/i) || item.enum_def.match(/check \(\((\w+) = /i);
            const m2 = item.enum_def.match(/\(array\[(.*)]\)/i) || item.enum_def.match(/ = (.*)\)/i);
            /* istanbul ignore else  */
            if (m1 && m2) {
                o[m1[1]] = m2[1].split(',').map((item) => item.trim().match(/^\(?'(.*)'/)[1]);
            }
            return o;
        }, {});
    }
    createTableColumn(table, column, fromTable, changedProperties) {
        var _a, _b;
        const compositePK = (_a = fromTable.getPrimaryKey()) === null || _a === void 0 ? void 0 : _a.composite;
        if (column.autoincrement && !compositePK && !changedProperties) {
            if (column.mappedType instanceof core_1.BigIntType) {
                return table.bigIncrements(column.name);
            }
            return table.increments(column.name);
        }
        if (column.mappedType instanceof core_1.EnumType && ((_b = column.enumItems) === null || _b === void 0 ? void 0 : _b.every(item => core_1.Utils.isString(item)))) {
            return table.enum(column.name, column.enumItems);
        }
        // serial is just a pseudo type, it cannot be used for altering
        /* istanbul ignore next */
        if (changedProperties && column.type.includes('serial')) {
            column.type = column.type.replace('serial', 'int');
        }
        return table.specificType(column.name, column.type);
    }
    configureColumn(column, col, knex, changedProperties) {
        const guard = (key) => !changedProperties || changedProperties.has(key);
        core_1.Utils.runIfNotEmpty(() => col.nullable(), column.nullable && guard('nullable'));
        core_1.Utils.runIfNotEmpty(() => col.notNullable(), !column.nullable && guard('nullable'));
        core_1.Utils.runIfNotEmpty(() => col.unsigned(), column.unsigned && guard('unsigned'));
        core_1.Utils.runIfNotEmpty(() => col.comment(column.comment), column.comment && !changedProperties);
        this.configureColumnDefault(column, col, knex, changedProperties);
        return col;
    }
    getAlterColumnAutoincrement(tableName, column) {
        const ret = [];
        const quoted = (val) => this.platform.quoteIdentifier(val);
        /* istanbul ignore else */
        if (column.autoincrement) {
            const seqName = this.platform.getIndexName(tableName, [column.name], 'sequence');
            ret.push(`create sequence if not exists ${quoted(seqName)}`);
            ret.push(`select setval('${seqName}', (select max(${quoted(column.name)}) from ${quoted(tableName)}))`);
            ret.push(`alter table ${quoted(tableName)} alter column ${quoted(column.name)} set default nextval('${seqName}')`);
        }
        else if (column.default == null) {
            ret.push(`alter table ${quoted(tableName)} alter column ${quoted(column.name)} drop default`);
        }
        return ret.join(';\n');
    }
    getChangeColumnCommentSQL(tableName, to) {
        const value = to.comment ? `'${to.comment}'` : 'null';
        return `comment on column "${tableName}"."${to.name}" is ${value}`;
    }
    normalizeDefaultValue(defaultValue, length) {
        if (!defaultValue) {
            return defaultValue;
        }
        const match = defaultValue.match(/^'(.*)'::(.*)$/);
        if (match) {
            if (match[2] === 'integer') {
                return +match[1];
            }
            return `'${match[1]}'`;
        }
        return super.normalizeDefaultValue(defaultValue, length, PostgreSqlSchemaHelper.DEFAULT_VALUES);
    }
    getDatabaseExistsSQL(name) {
        return `select 1 from pg_database where datname = '${name}'`;
    }
    getDatabaseNotExistsError(dbName) {
        return `database "${dbName}" does not exist`;
    }
    getManagementDbName() {
        return 'postgres';
    }
    disableForeignKeysSQL() {
        return `set session_replication_role = 'replica';`;
    }
    enableForeignKeysSQL() {
        return `set session_replication_role = 'origin';`;
    }
    getRenameIndexSQL(tableName, index, oldIndexName) {
        oldIndexName = this.platform.quoteIdentifier(oldIndexName);
        const keyName = this.platform.quoteIdentifier(index.keyName);
        return `alter index ${oldIndexName} rename to ${keyName}`;
    }
    getIndexesSQL(tableName, schemaName = 'public') {
        return `select relname as constraint_name, attname as column_name, idx.indisunique as unique, idx.indisprimary as primary
      from pg_index idx
      left join pg_class AS i on i.oid = idx.indexrelid
      left join pg_attribute a on a.attrelid = idx.indrelid and a.attnum = ANY(idx.indkey) and a.attnum > 0
      where indrelid = '"${schemaName}"."${tableName}"'::regclass`;
    }
}
exports.PostgreSqlSchemaHelper = PostgreSqlSchemaHelper;
PostgreSqlSchemaHelper.DEFAULT_VALUES = {
    'now()': ['now()', 'current_timestamp'],
    'current_timestamp(?)': ['current_timestamp(?)'],
    "('now'::text)::timestamp(?) with time zone": ['current_timestamp(?)'],
    "('now'::text)::timestamp(?) without time zone": ['current_timestamp(?)'],
    'null::character varying': ['null'],
    'null::timestamp with time zone': ['null'],
    'null::timestamp without time zone': ['null'],
};
