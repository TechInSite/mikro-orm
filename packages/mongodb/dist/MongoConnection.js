"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConnection = void 0;
const mongodb_1 = require("mongodb");
const util_1 = require("util");
const core_1 = require("@mikro-orm/core");
class MongoConnection extends core_1.Connection {
    async connect() {
        this.client = await mongodb_1.MongoClient.connect(this.config.getClientUrl(), this.getConnectionOptions());
        this.db = this.client.db(this.config.get('dbName'));
    }
    async close(force) {
        var _a;
        return (_a = this.client) === null || _a === void 0 ? void 0 : _a.close(force);
    }
    async isConnected() {
        var _a;
        const ret = (_a = this.client) === null || _a === void 0 ? void 0 : _a.isConnected();
        return !!ret;
    }
    getCollection(name) {
        return this.db.collection(this.getCollectionName(name));
    }
    async createCollection(name) {
        return this.db.createCollection(this.getCollectionName(name));
    }
    async listCollections() {
        const collections = await this.db.listCollections({}, { nameOnly: true }).toArray();
        return collections.map(c => c.name);
    }
    async dropCollection(name) {
        return this.db.dropCollection(this.getCollectionName(name));
    }
    getDefaultClientUrl() {
        return 'mongodb://127.0.0.1:27017';
    }
    getConnectionOptions() {
        const ret = { useNewUrlParser: true, useUnifiedTopology: true };
        const user = this.config.get('user');
        const password = this.config.get('password');
        if (user && password) {
            ret.auth = { user, password };
        }
        return core_1.Utils.merge(ret, this.config.get('driverOptions'));
    }
    getClientUrl() {
        const options = this.getConnectionOptions();
        const clientUrl = this.config.getClientUrl(true);
        const match = clientUrl.match(/^(\w+):\/\/((.*@.+)|.+)$/);
        return match ? `${match[1]}://${options.auth ? options.auth.user + ':*****@' : ''}${match[2]}` : clientUrl;
    }
    getDb() {
        return this.db;
    }
    async execute(query) {
        throw new Error(`${this.constructor.name} does not support generic execute method`);
    }
    async find(collection, where, orderBy, limit, offset, fields, ctx) {
        collection = this.getCollectionName(collection);
        const options = { session: ctx };
        if (fields) {
            options.projection = fields.reduce((o, k) => (Object.assign(Object.assign({}, o), { [k]: 1 })), {});
        }
        const resultSet = this.getCollection(collection).find(where, options);
        let query = `db.getCollection('${collection}').find(${this.logObject(where)}, ${this.logObject(options)})`;
        if (orderBy && core_1.Utils.hasObjectKeys(orderBy)) {
            orderBy = Object.keys(orderBy).reduce((p, c) => {
                const direction = orderBy[c];
                return Object.assign(Object.assign({}, p), { [c]: core_1.Utils.isString(direction) ? direction.toUpperCase() === core_1.QueryOrder.ASC ? 1 : -1 : direction });
            }, {});
            query += `.sort(${this.logObject(orderBy)})`;
            resultSet.sort(orderBy);
        }
        if (limit !== undefined) {
            query += `.limit(${limit})`;
            resultSet.limit(limit);
        }
        if (offset !== undefined) {
            query += `.skip(${offset})`;
            resultSet.skip(offset);
        }
        const now = Date.now();
        const res = await resultSet.toArray();
        this.logQuery(`${query}.toArray();`, Date.now() - now);
        return res;
    }
    async insertOne(collection, data, ctx) {
        return this.runQuery('insertOne', collection, data, undefined, ctx);
    }
    async insertMany(collection, data, ctx) {
        return this.runQuery('insertMany', collection, data, undefined, ctx);
    }
    async updateMany(collection, where, data, ctx) {
        return this.runQuery('updateMany', collection, data, where, ctx);
    }
    async bulkUpdateMany(collection, where, data, ctx) {
        return this.runQuery('bulkUpdateMany', collection, data, where, ctx);
    }
    async deleteMany(collection, where, ctx) {
        return this.runQuery('deleteMany', collection, undefined, where, ctx);
    }
    async aggregate(collection, pipeline, ctx) {
        collection = this.getCollectionName(collection);
        const options = { session: ctx };
        const query = `db.getCollection('${collection}').aggregate(${this.logObject(pipeline)}, ${this.logObject(options)}).toArray();`;
        const now = Date.now();
        const res = this.getCollection(collection).aggregate(pipeline, options).toArray();
        this.logQuery(query, Date.now() - now);
        return res;
    }
    async countDocuments(collection, where, ctx) {
        return this.runQuery('countDocuments', collection, undefined, where, ctx);
    }
    async transactional(cb, options = {}) {
        const session = await this.begin(options);
        try {
            const ret = await cb(session);
            await this.commit(session, options.eventBroadcaster);
            return ret;
        }
        catch (error) {
            await this.rollback(session, options.eventBroadcaster);
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async begin(options = {}) {
        var _a, _b;
        if (!options.ctx) {
            /* istanbul ignore next */
            await ((_a = options.eventBroadcaster) === null || _a === void 0 ? void 0 : _a.dispatchEvent(core_1.EventType.beforeTransactionStart));
        }
        const session = options.ctx || this.client.startSession();
        session.startTransaction();
        this.logQuery('db.begin();');
        /* istanbul ignore next */
        await ((_b = options.eventBroadcaster) === null || _b === void 0 ? void 0 : _b.dispatchEvent(core_1.EventType.afterTransactionStart, session));
        return session;
    }
    async commit(ctx, eventBroadcaster) {
        /* istanbul ignore next */
        await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.beforeTransactionCommit, ctx));
        await ctx.commitTransaction();
        this.logQuery('db.commit();');
        /* istanbul ignore next */
        await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.afterTransactionCommit, ctx));
    }
    async rollback(ctx, eventBroadcaster) {
        /* istanbul ignore next */
        await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.beforeTransactionRollback, ctx));
        await ctx.abortTransaction();
        this.logQuery('db.rollback();');
        /* istanbul ignore next */
        await (eventBroadcaster === null || eventBroadcaster === void 0 ? void 0 : eventBroadcaster.dispatchEvent(core_1.EventType.afterTransactionRollback, ctx));
    }
    logQuery(query, took) {
        super.logQuery(query, took);
    }
    async runQuery(method, collection, data, where, ctx) {
        collection = this.getCollectionName(collection);
        const logger = this.config.getLogger();
        const options = { session: ctx };
        const now = Date.now();
        let res;
        let query;
        const log = (msg) => logger.isEnabled('query') ? msg() : '';
        switch (method) {
            case 'insertOne':
                query = log(() => `db.getCollection('${collection}').insertOne(${this.logObject(data)}, ${this.logObject(options)});`);
                res = await this.getCollection(collection).insertOne(data, options);
                break;
            case 'insertMany':
                query = log(() => `db.getCollection('${collection}').insertMany(${this.logObject(data)}, ${this.logObject(options)});`);
                res = await this.getCollection(collection).insertMany(data, options);
                break;
            case 'updateMany': {
                const payload = Object.keys(data).some(k => k.startsWith('$')) ? data : { $set: data };
                query = log(() => `db.getCollection('${collection}').updateMany(${this.logObject(where)}, ${this.logObject(payload)}, ${this.logObject(options)});`);
                res = await this.getCollection(collection).updateMany(where, payload, options);
                break;
            }
            case 'bulkUpdateMany': {
                query = log(() => `bulk = db.getCollection('${collection}').initializeUnorderedBulkOp(${this.logObject(options)});\n`);
                const bulk = this.getCollection(collection).initializeUnorderedBulkOp(options);
                data.forEach((row, idx) => {
                    const cond = { _id: where[idx] };
                    const doc = { $set: row };
                    query += log(() => `bulk.find(${this.logObject(cond)}).update(${this.logObject(doc)});\n`);
                    bulk.find(cond).update(doc);
                });
                query += log(() => `bulk.execute()`);
                res = await bulk.execute();
                break;
            }
            case 'deleteMany':
            case 'countDocuments':
                query = log(() => `db.getCollection('${collection}').${method}(${this.logObject(where)}, ${this.logObject(options)});`);
                res = await this.getCollection(collection)[method](where, options); // cast to deleteMany to fix some typing weirdness
                break;
        }
        this.logQuery(query, Date.now() - now);
        if (method === 'countDocuments') {
            return res;
        }
        return this.transformResult(res);
    }
    transformResult(res) {
        var _a, _b, _c;
        return {
            affectedRows: res.modifiedCount || res.deletedCount || res.insertedCount || 0,
            insertId: (_a = res.insertedId) !== null && _a !== void 0 ? _a : (_b = res.insertedIds) === null || _b === void 0 ? void 0 : _b[0],
            row: (_c = res.ops) === null || _c === void 0 ? void 0 : _c[0],
            rows: res.ops,
        };
    }
    getCollectionName(name) {
        name = core_1.Utils.className(name);
        const meta = this.metadata.find(name);
        return meta ? meta.collection : name;
    }
    logObject(o) {
        if (o.session) {
            o = Object.assign(Object.assign({}, o), { session: `[ClientSession]` });
        }
        return util_1.inspect(o, { depth: 5, compact: true, breakLength: 300 });
    }
}
exports.MongoConnection = MongoConnection;
mongodb_1.ObjectId.prototype[util_1.inspect.custom] = function () {
    return `ObjectId('${this.toHexString()}')`;
};
Date.prototype[util_1.inspect.custom] = function () {
    return `ISODate('${this.toISOString()}')`;
};
