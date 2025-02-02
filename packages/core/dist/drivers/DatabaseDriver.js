"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseDriver = void 0;
const IDatabaseDriver_1 = require("./IDatabaseDriver");
const utils_1 = require("../utils");
const enums_1 = require("../enums");
const EntityManager_1 = require("../EntityManager");
const errors_1 = require("../errors");
const exceptions_1 = require("../exceptions");
class DatabaseDriver {
    constructor(config, dependencies) {
        this.config = config;
        this.dependencies = dependencies;
        this.replicas = [];
        this.logger = this.config.getLogger();
    }
    async nativeUpdateMany(entityName, where, data, ctx, processCollections, convertCustomTypes) {
        throw new Error(`Batch updates are not supported by ${this.constructor.name} driver`);
    }
    createEntityManager(useContext) {
        return new EntityManager_1.EntityManager(this.config, this, this.metadata, useContext);
    }
    async aggregate(entityName, pipeline) {
        throw new Error(`Aggregations are not supported by ${this.constructor.name} driver`);
    }
    async loadFromPivotTable(prop, owners, where, orderBy, ctx, options) {
        throw new Error(`${this.constructor.name} does not use pivot tables`);
    }
    async syncCollection(coll, ctx) {
        const pk = this.metadata.find(coll.property.type).primaryKeys[0];
        const data = { [coll.property.name]: coll.getIdentifiers(pk) };
        await this.nativeUpdate(coll.owner.constructor.name, coll.owner.__helper.getPrimaryKey(), data, ctx);
    }
    async clearCollection(coll, ctx) {
        // this currently serves only for 1:m collections with orphan removal, m:n ones are handled via `syncCollection` method
        const snapshot = coll.getSnapshot();
        /* istanbul ignore next */
        const deleteDiff = snapshot ? snapshot.map(item => item.__helper.__primaryKeyCond) : [];
        const cond = { [utils_1.Utils.getPrimaryKeyHash(coll.property.targetMeta.primaryKeys)]: deleteDiff };
        await this.nativeDelete(coll.property.type, cond, ctx);
    }
    mapResult(result, meta, populate = []) {
        if (!result || !meta) {
            return null;
        }
        return this.comparator.mapResult(meta.className, result);
    }
    async connect() {
        await this.connection.connect();
        await Promise.all(this.replicas.map(replica => replica.connect()));
        return this.connection;
    }
    async reconnect() {
        await this.close(true);
        return this.connect();
    }
    getConnection(type = 'write') {
        if (type === 'write' || this.replicas.length === 0) {
            return this.connection;
        }
        const rand = utils_1.Utils.randomInt(0, this.replicas.length - 1);
        return this.replicas[rand];
    }
    async close(force) {
        var _a, _b;
        await Promise.all(this.replicas.map(replica => replica.close(force)));
        await this.connection.close(force);
        /* istanbul ignore next */
        if ((_a = this.config.getCacheAdapter()) === null || _a === void 0 ? void 0 : _a.close) {
            await this.config.getCacheAdapter().close();
        }
        /* istanbul ignore next */
        if ((_b = this.config.getResultCacheAdapter()) === null || _b === void 0 ? void 0 : _b.close) {
            await this.config.getResultCacheAdapter().close();
        }
    }
    getPlatform() {
        return this.platform;
    }
    setMetadata(metadata) {
        this.metadata = metadata;
        this.comparator = new utils_1.EntityComparator(this.metadata, this.platform);
        this.connection.setMetadata(metadata);
        this.connection.setPlatform(this.platform);
        this.replicas.forEach(replica => {
            replica.setMetadata(metadata);
            replica.setPlatform(this.platform);
        });
    }
    getDependencies() {
        return this.dependencies;
    }
    async ensureIndexes() {
        throw new Error(`${this.constructor.name} does not use ensureIndexes`);
    }
    inlineEmbeddables(meta, data, where) {
        Object.keys(data).forEach(k => {
            if (utils_1.Utils.isOperator(k)) {
                utils_1.Utils.asArray(data[k]).forEach(payload => this.inlineEmbeddables(meta, payload, where));
            }
        });
        meta.props.forEach(prop => {
            if (prop.reference === enums_1.ReferenceType.EMBEDDED && prop.object && !where && utils_1.Utils.isObject(data[prop.name])) {
                return;
            }
            if (prop.reference === enums_1.ReferenceType.EMBEDDED && utils_1.Utils.isObject(data[prop.name])) {
                const props = prop.embeddedProps;
                Object.keys(data[prop.name]).forEach(kk => {
                    const operator = Object.keys(data[prop.name]).some(f => utils_1.Utils.isOperator(f));
                    if (operator) {
                        throw errors_1.ValidationError.cannotUseOperatorsInsideEmbeddables(meta.name, prop.name, data);
                    }
                    if (prop.object && where) {
                        const inline = (payload, sub, path) => {
                            if (sub.reference === enums_1.ReferenceType.EMBEDDED && utils_1.Utils.isObject(payload[sub.embedded[1]])) {
                                return Object.keys(payload[sub.embedded[1]]).forEach(kkk => {
                                    if (!sub.embeddedProps[kkk]) {
                                        throw errors_1.ValidationError.invalidEmbeddableQuery(meta.className, kkk, sub.type);
                                    }
                                    inline(payload[sub.embedded[1]], sub.embeddedProps[kkk], [...path, sub.embedded[1]]);
                                });
                            }
                            data[`${path.join('.')}.${sub.embedded[1]}`] = payload[sub.embedded[1]];
                        };
                        inline(data[prop.name], props[kk], [prop.name]);
                    }
                    else if (props[kk]) {
                        data[props[kk].name] = data[prop.name][props[kk].embedded[1]];
                    }
                    else {
                        throw errors_1.ValidationError.invalidEmbeddableQuery(meta.className, kk, prop.type);
                    }
                });
                delete data[prop.name];
            }
        });
    }
    getPivotOrderBy(prop, orderBy) {
        if (orderBy) {
            return orderBy;
        }
        if (prop.orderBy) {
            return prop.orderBy;
        }
        if (prop.fixedOrder) {
            return { [`${prop.pivotTable}.${prop.fixedOrderColumn}`]: enums_1.QueryOrder.ASC };
        }
        return {};
    }
    getPrimaryKeyFields(entityName) {
        const meta = this.metadata.find(entityName);
        return meta ? meta.primaryKeys : [this.config.getNamingStrategy().referenceColumnName()];
    }
    getPivotInverseProperty(prop) {
        const pivotMeta = this.metadata.find(prop.pivotTable);
        let inverse;
        if (prop.owner) {
            const pivotProp1 = pivotMeta.properties[prop.type + '_inverse'];
            inverse = pivotProp1.mappedBy;
        }
        else {
            const pivotProp1 = pivotMeta.properties[prop.type + '_owner'];
            inverse = pivotProp1.inversedBy;
        }
        return pivotMeta.properties[inverse];
    }
    createReplicas(cb) {
        const replicas = this.config.get('replicas', []);
        const ret = [];
        const props = ['dbName', 'clientUrl', 'host', 'port', 'user', 'password', 'multipleStatements', 'pool', 'name'];
        replicas.forEach((conf) => {
            props.forEach(prop => conf[prop] = prop in conf ? conf[prop] : this.config.get(prop));
            ret.push(cb(conf));
        });
        return ret;
    }
    async lockPessimistic(entity, mode, tables, ctx) {
        throw new Error(`Pessimistic locks are not supported by ${this.constructor.name} driver`);
    }
    /**
     * @internal
     */
    shouldHaveColumn(prop, populate, includeFormulas = true) {
        if (prop.formula) {
            return includeFormulas && (!prop.lazy || populate.some(p => p.field === prop.name));
        }
        if (prop.persist === false) {
            return false;
        }
        if (prop.lazy && !populate.some(p => p.field === prop.name)) {
            return false;
        }
        return [enums_1.ReferenceType.SCALAR, enums_1.ReferenceType.MANY_TO_ONE].includes(prop.reference) || (prop.reference === enums_1.ReferenceType.ONE_TO_ONE && prop.owner);
    }
    /**
     * @inheritDoc
     */
    convertException(exception) {
        if (exception instanceof exceptions_1.DriverException) {
            return exception;
        }
        return this.platform.getExceptionConverter().convertException(exception);
    }
    rethrow(promise) {
        return promise.catch(e => {
            throw this.convertException(e);
        });
    }
}
exports.DatabaseDriver = DatabaseDriver;
