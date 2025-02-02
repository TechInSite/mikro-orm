"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSqlConnection = void 0;
const pg_1 = require("pg");
const knex_1 = require("@mikro-orm/knex");
class PostgreSqlConnection extends knex_1.AbstractSqlConnection {
    async connect() {
        this.patchKnex();
        this.client = this.createKnexClient('pg');
    }
    getDefaultClientUrl() {
        return 'postgresql://postgres@127.0.0.1:5432';
    }
    getConnectionOptions() {
        const ret = super.getConnectionOptions();
        [1082].forEach(oid => pg_1.types.setTypeParser(oid, str => str)); // date type
        if (this.config.get('forceUtcTimezone')) {
            [1114].forEach(oid => pg_1.types.setTypeParser(oid, str => new Date(str + 'Z'))); // timestamp w/o TZ type
            pg_1.defaults.parseInputDatesAsUTC = true;
        }
        return ret;
    }
    transformRawResult(res, method) {
        if (method === 'get') {
            return res.rows[0];
        }
        if (method === 'all') {
            return res.rows;
        }
        return {
            affectedRows: res.rowCount,
            insertId: res.rows[0] ? res.rows[0].id : 0,
            row: res.rows[0],
            rows: res.rows,
        };
    }
    /**
     * monkey patch knex' postgres dialect so it correctly handles column updates (especially enums)
     */
    patchKnex() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        const { PostgresDialectTableCompiler, TableCompiler } = knex_1.MonkeyPatchable;
        PostgresDialectTableCompiler.prototype.addColumns = function (columns, prefix, colCompilers) {
            if (prefix !== this.alterColumnsPrefix) {
                // base class implementation for normal add
                return TableCompiler.prototype.addColumns.call(this, columns, prefix);
            }
            // alter columns
            for (const col of colCompilers) {
                that.addColumn.call(this, col, that);
            }
        };
    }
    addColumn(col, that) {
        const quotedTableName = this.tableName();
        const type = col.getColumnType();
        const colName = this.client.wrapIdentifier(col.getColumnName(), col.columnBuilder.queryContext());
        const constraintName = `${this.tableNameRaw}_${col.getColumnName()}_check`;
        this.pushQuery({ sql: `alter table ${quotedTableName} drop constraint if exists "${constraintName}"`, bindings: [] });
        if (col.type === 'enu') {
            this.pushQuery({ sql: `alter table ${quotedTableName} alter column ${colName} type text using (${colName}::text)`, bindings: [] });
            this.pushQuery({ sql: `alter table ${quotedTableName} add constraint "${constraintName}" ${type.replace(/^text /, '')}`, bindings: [] });
        }
        else {
            this.pushQuery({ sql: `alter table ${quotedTableName} alter column ${colName} type ${type} using (${colName}::${type})`, bindings: [] });
        }
        that.alterColumnDefault.call(this, col, colName);
        that.alterColumnNullable.call(this, col, colName);
    }
    alterColumnNullable(col, colName) {
        const quotedTableName = this.tableName();
        const nullable = col.modified.nullable;
        if (!nullable) {
            return;
        }
        if (nullable[0] === false) {
            this.pushQuery({ sql: `alter table ${quotedTableName} alter column ${colName} set not null`, bindings: [] });
        }
        else {
            this.pushQuery({ sql: `alter table ${quotedTableName} alter column ${colName} drop not null`, bindings: [] });
        }
    }
    alterColumnDefault(col, colName) {
        const quotedTableName = this.tableName();
        const defaultTo = col.modified.defaultTo;
        if (!defaultTo) {
            return;
        }
        if (defaultTo[0] === null) {
            this.pushQuery({ sql: `alter table ${quotedTableName} alter column ${colName} drop default`, bindings: [] });
        }
        else {
            const modifier = col.defaultTo(...defaultTo);
            this.pushQuery({ sql: `alter table ${quotedTableName} alter column ${colName} set ${modifier}`, bindings: [] });
        }
    }
}
exports.PostgreSqlConnection = PostgreSqlConnection;
