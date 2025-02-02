"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteConnection = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const knex_1 = require("@mikro-orm/knex");
const core_1 = require("@mikro-orm/core");
class SqliteConnection extends knex_1.AbstractSqlConnection {
    async connect() {
        await fs_extra_1.ensureDir(path_1.dirname(this.config.get('dbName')));
        this.client = this.createKnexClient(this.getPatchedDialect());
        await this.client.raw('pragma foreign_keys = on');
    }
    getDefaultClientUrl() {
        return '';
    }
    getClientUrl() {
        return '';
    }
    async loadFile(path) {
        const conn = await this.client.client.acquireConnection();
        await conn.exec((await fs_extra_1.readFile(path)).toString());
        await this.client.client.releaseConnection(conn);
    }
    getKnexOptions(type) {
        return core_1.Utils.merge({
            client: type,
            connection: {
                filename: this.config.get('dbName'),
            },
            pool: this.config.get('pool'),
            useNullAsDefault: true,
        }, this.config.get('driverOptions'));
    }
    transformRawResult(res, method) {
        if (method === 'get') {
            return res[0];
        }
        if (method === 'all') {
            return res;
        }
        return {
            insertId: res.lastID,
            affectedRows: res.changes,
        };
    }
    /**
     * monkey patch knex' sqlite Dialect so it returns inserted id when doing raw insert query
     */
    getPatchedDialect() {
        const { Sqlite3Dialect, Sqlite3DialectTableCompiler } = knex_1.MonkeyPatchable;
        const processResponse = Sqlite3Dialect.prototype.processResponse;
        Sqlite3Dialect.prototype.processResponse = (obj, runner) => {
            if (obj.method === 'raw' && obj.sql.trim().match(SqliteConnection.RUN_QUERY_RE)) {
                return obj.context;
            }
            return processResponse(obj, runner);
        };
        Sqlite3Dialect.prototype._query = (connection, obj) => {
            const callMethod = this.getCallMethod(obj);
            return new Promise((resolve, reject) => {
                /* istanbul ignore if */
                if (!connection || !connection[callMethod]) {
                    return reject(new Error(`Error calling ${callMethod} on connection.`));
                }
                connection[callMethod](obj.sql, obj.bindings, function (err, response) {
                    if (err) {
                        return reject(err);
                    }
                    obj.response = response;
                    obj.context = this;
                    return resolve(obj);
                });
            });
        };
        /* istanbul ignore next */
        Sqlite3DialectTableCompiler.prototype.foreign = function (foreignInfo) {
            foreignInfo.column = this.formatter.columnize(foreignInfo.column);
            foreignInfo.column = Array.isArray(foreignInfo.column)
                ? foreignInfo.column
                : [foreignInfo.column];
            foreignInfo.inTable = this.formatter.columnize(foreignInfo.inTable);
            foreignInfo.references = this.formatter.columnize(foreignInfo.references);
            const addColumnQuery = this.sequence.find((query) => query.sql.includes(`add column ${foreignInfo.column[0]}`));
            // no need for temp tables if we just add a column
            if (addColumnQuery) {
                const onUpdate = foreignInfo.onUpdate ? ` on update ${foreignInfo.onUpdate}` : '';
                const onDelete = foreignInfo.onDelete ? ` on delete ${foreignInfo.onDelete}` : '';
                addColumnQuery.sql += ` constraint ${foreignInfo.keyName} references ${foreignInfo.inTable} (${foreignInfo.references})${onUpdate}${onDelete}`;
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const compiler = this;
            if (this.method !== 'create' && this.method !== 'createIfNot') {
                this.pushQuery({
                    sql: `PRAGMA table_info(${this.tableName()})`,
                    statementsProducer(pragma, connection) {
                        return compiler.client
                            .ddl(compiler, pragma, connection)
                            .foreign(foreignInfo);
                    },
                });
            }
        };
        return Sqlite3Dialect;
    }
    getCallMethod(obj) {
        if (obj.method === 'raw' && obj.sql.trim().match(SqliteConnection.RUN_QUERY_RE)) {
            return 'run';
        }
        /* istanbul ignore next */
        switch (obj.method) {
            case 'insert':
            case 'update':
            case 'counter':
            case 'del':
                return 'run';
            default:
                return 'all';
        }
    }
}
exports.SqliteConnection = SqliteConnection;
SqliteConnection.RUN_QUERY_RE = /^insert into|^update|^delete|^truncate/;
