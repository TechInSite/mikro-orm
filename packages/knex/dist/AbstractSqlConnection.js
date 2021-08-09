"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSqlConnection = void 0;
const knex_1 = require("knex");
const fs_extra_1 = require("fs-extra");
const core_1 = require("@mikro-orm/core");
const MonkeyPatchable_1 = require("./MonkeyPatchable");
const parentTransactionSymbol = Symbol('parentTransaction');
function isRootTransaction(trx) {
    return !Object.getOwnPropertySymbols(trx).includes(parentTransactionSymbol);
}
class AbstractSqlConnection extends core_1.Connection {
    constructor(config, options, type) {
        super(config, options, type);
        this.patchKnexClient();
    }
    getKnex() {
        return this.client;
    }
    async close(force) {
        await this.client.destroy();
    }
    async isConnected() {
        try {
            await this.client.raw('select 1');
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    async transactional(cb, options = {}) {
        const trx = await this.begin(options);
        try {
            const ret = await cb(trx);
            await this.commit(trx, options.eventBroadcaster);
            return ret;
        }
        catch (error) {
            await this.rollback(trx, options.eventBroadcaster);
            throw error;
        }
    }
    async begin(options = {}) {
        var _a, _b;
        if (!options.ctx) {
            await ((_a = options.eventBroadcaster) === null || _a === void 0 ? void 0 : _a.dispatchEvent(core_1.EventType.beforeTransactionStart));
        }
        const trx = await (options.ctx || this.client).transaction(null, { isolationLevel: options.isolationLevel });
        if (!options.ctx) {
            await ((_b = options.eventBroadcaster) === null || _b === void 0 ? void 0 : _b.dispatchEvent(core_1.EventType.afterTransactionStart, trx));
        }
        else {
            trx[parentTransactionSymbol] = options.ctx;
        }
        return trx;
    }
    async commit(ctx, eventBroadcaster) {
        const runTrxHooks = isRootTransaction(ctx);
        if (runTrxHooks) {
            await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.beforeTransactionCommit, ctx));
        }
        ctx.commit();
        await ctx.executionPromise; // https://github.com/knex/knex/issues/3847#issuecomment-626330453
        if (runTrxHooks) {
            await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.afterTransactionCommit, ctx));
        }
    }
    async rollback(ctx, eventBroadcaster) {
        const runTrxHooks = isRootTransaction(ctx);
        if (runTrxHooks) {
            await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.beforeTransactionRollback, ctx));
        }
        await ctx.rollback();
        if (runTrxHooks) {
            await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.afterTransactionRollback, ctx));
        }
    }
    async execute(queryOrKnex, params = [], method = 'all', ctx) {
        if (core_1.Utils.isObject(queryOrKnex)) {
            ctx = ctx !== null && ctx !== void 0 ? ctx : (queryOrKnex.client.transacting ? queryOrKnex : null);
            const q = queryOrKnex.toSQL();
            queryOrKnex = q.sql;
            params = q.bindings;
        }
        const formatted = this.platform.formatQuery(queryOrKnex, params);
        const sql = this.getSql(queryOrKnex, formatted);
        const res = await this.executeQuery(sql, () => {
            const query = this.client.raw(formatted);
            if (ctx) {
                query.transacting(ctx);
            }
            return query;
        });
        return this.transformRawResult(res, method);
    }
    /**
     * Execute raw SQL queries from file
     */
    async loadFile(path) {
        const buf = await fs_extra_1.readFile(path);
        await this.client.raw(buf.toString());
    }
    logQuery(query, took) {
        super.logQuery(query, took);
    }
    createKnexClient(type) {
        return knex_1.knex(this.getKnexOptions(type))
            .on('query', data => {
            if (!data.__knexQueryUid) {
                this.logQuery(data.sql.toLowerCase().replace(/;$/, ''));
            }
        });
    }
    getKnexOptions(type) {
        const config = core_1.Utils.merge({
            client: type,
            connection: this.getConnectionOptions(),
            pool: this.config.get('pool'),
        }, this.config.get('driverOptions'));
        const options = config.connection;
        const password = options.password;
        if (!(password instanceof Function)) {
            return config;
        }
        config.connection = async () => {
            const pw = await password();
            if (typeof pw === 'string') {
                return Object.assign(Object.assign({}, options), { password: pw });
            }
            return Object.assign(Object.assign({}, options), { password: pw.password, expirationChecker: pw.expirationChecker });
        };
        return config;
    }
    getSql(query, formatted) {
        const logger = this.config.getLogger();
        if (!logger.isEnabled('query')) {
            return query;
        }
        if (logger.isEnabled('query-params')) {
            return formatted;
        }
        return this.client.client.positionBindings(query);
    }
    /**
     * do not call `positionBindings` when there are no bindings - it was messing up with
     * already interpolated strings containing `?`, and escaping that was not enough to
     * support edge cases like `\\?` strings (as `positionBindings` was removing the `\\`)
     */
    patchKnexClient() {
        const query = MonkeyPatchable_1.MonkeyPatchable.Client.prototype.query;
        /* istanbul ignore next */
        MonkeyPatchable_1.MonkeyPatchable.Client.prototype.query = function (connection, obj) {
            var _a;
            if (typeof obj === 'string') {
                obj = { sql: obj };
            }
            if (((_a = obj.bindings) !== null && _a !== void 0 ? _a : []).length > 0) {
                return query.call(this, connection, obj);
            }
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { __knexUid, __knexTxId } = connection;
            this.emit('query', Object.assign({ __knexUid, __knexTxId }, obj));
            return MonkeyPatchable_1.MonkeyPatchable.QueryExecutioner.executeQuery(connection, obj, this);
        };
        MonkeyPatchable_1.MonkeyPatchable.TableCompiler.prototype.raw = function (query) {
            this.pushQuery(query);
        };
    }
}
exports.AbstractSqlConnection = AbstractSqlConnection;
