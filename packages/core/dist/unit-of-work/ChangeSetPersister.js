"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeSetPersister = void 0;
const entity_1 = require("../entity");
const ChangeSet_1 = require("./ChangeSet");
const utils_1 = require("../utils");
const errors_1 = require("../errors");
class ChangeSetPersister {
    constructor(driver, metadata, hydrator, factory, config) {
        this.driver = driver;
        this.metadata = metadata;
        this.hydrator = hydrator;
        this.factory = factory;
        this.config = config;
        this.platform = this.driver.getPlatform();
    }
    async executeInserts(changeSets, ctx) {
        const meta = this.metadata.find(changeSets[0].name);
        changeSets.forEach(changeSet => this.processProperties(changeSet));
        if (changeSets.length > 1 && this.config.get('useBatchInserts', this.platform.usesBatchInserts())) {
            return this.persistNewEntities(meta, changeSets, ctx);
        }
        for (const changeSet of changeSets) {
            await this.persistNewEntity(meta, changeSet, ctx);
        }
    }
    async executeUpdates(changeSets, batched, ctx) {
        const meta = this.metadata.find(changeSets[0].name);
        changeSets.forEach(changeSet => this.processProperties(changeSet));
        if (batched && changeSets.length > 1 && this.config.get('useBatchUpdates', this.platform.usesBatchUpdates())) {
            return this.persistManagedEntities(meta, changeSets, ctx);
        }
        for (const changeSet of changeSets) {
            await this.persistManagedEntity(changeSet, ctx);
        }
    }
    async executeDeletes(changeSets, ctx) {
        const size = this.config.get('batchSize');
        const meta = changeSets[0].entity.__meta;
        const pk = utils_1.Utils.getPrimaryKeyHash(meta.primaryKeys);
        for (let i = 0; i < changeSets.length; i += size) {
            const chunk = changeSets.slice(i, i + size);
            const pks = chunk.map(cs => cs.getPrimaryKey());
            await this.driver.nativeDelete(meta.className, { [pk]: { $in: pks } }, ctx);
        }
    }
    processProperties(changeSet) {
        const meta = this.metadata.find(changeSet.name);
        for (const prop of meta.props) {
            this.processProperty(changeSet, prop);
        }
    }
    async persistNewEntity(meta, changeSet, ctx) {
        const wrapped = changeSet.entity.__helper;
        const res = await this.driver.nativeInsert(changeSet.name, changeSet.payload, ctx, false);
        if (!wrapped.hasPrimaryKey()) {
            this.mapPrimaryKey(meta, res.insertId, changeSet);
        }
        this.mapReturnedValues(changeSet, res, meta);
        this.markAsPopulated(changeSet, meta);
        wrapped.__initialized = true;
        wrapped.__managed = true;
        if (!this.platform.usesReturningStatement()) {
            await this.reloadVersionValues(meta, [changeSet], ctx);
        }
        changeSet.persisted = true;
    }
    async persistNewEntities(meta, changeSets, ctx) {
        const size = this.config.get('batchSize');
        for (let i = 0; i < changeSets.length; i += size) {
            const chunk = changeSets.slice(i, i + size);
            await this.persistNewEntitiesBatch(meta, chunk, ctx);
            if (!this.platform.usesReturningStatement()) {
                await this.reloadVersionValues(meta, chunk, ctx);
            }
        }
    }
    async persistNewEntitiesBatch(meta, changeSets, ctx) {
        const res = await this.driver.nativeInsertMany(meta.className, changeSets.map(cs => cs.payload), ctx, false, false);
        for (let i = 0; i < changeSets.length; i++) {
            const changeSet = changeSets[i];
            const wrapped = changeSet.entity.__helper;
            if (!wrapped.hasPrimaryKey()) {
                const field = meta.getPrimaryProps()[0].fieldNames[0];
                this.mapPrimaryKey(meta, res.rows[i][field], changeSet);
            }
            this.mapReturnedValues(changeSet, res, meta);
            this.markAsPopulated(changeSet, meta);
            wrapped.__initialized = true;
            wrapped.__managed = true;
            changeSet.persisted = true;
        }
    }
    async persistManagedEntity(changeSet, ctx) {
        const meta = this.metadata.find(changeSet.name);
        const res = await this.updateEntity(meta, changeSet, ctx);
        this.checkOptimisticLock(meta, changeSet, res);
        await this.reloadVersionValues(meta, [changeSet], ctx);
        changeSet.persisted = true;
    }
    async persistManagedEntities(meta, changeSets, ctx) {
        const size = this.config.get('batchSize');
        for (let i = 0; i < changeSets.length; i += size) {
            const chunk = changeSets.slice(i, i + size);
            await this.persistManagedEntitiesBatch(meta, chunk, ctx);
            await this.reloadVersionValues(meta, chunk, ctx);
        }
    }
    async persistManagedEntitiesBatch(meta, changeSets, ctx) {
        await this.checkOptimisticLocks(meta, changeSets, ctx);
        await this.driver.nativeUpdateMany(meta.className, changeSets.map(cs => cs.getPrimaryKey()), changeSets.map(cs => cs.payload), ctx, false, false);
        changeSets.forEach(cs => cs.persisted = true);
    }
    mapPrimaryKey(meta, value, changeSet) {
        const prop = meta.properties[meta.primaryKeys[0]];
        const insertId = prop.customType ? prop.customType.convertToJSValue(value, this.platform) : value;
        const wrapped = changeSet.entity.__helper;
        if (!wrapped.hasPrimaryKey()) {
            wrapped.setPrimaryKey(insertId);
        }
        // some drivers might be returning bigint PKs as numbers when the number is small enough,
        // but we need to have it as string so comparison works in change set tracking, so instead
        // of using the raw value from db, we convert it back to the db value explicitly
        value = prop.customType ? prop.customType.convertToDatabaseValue(insertId, this.platform) : value;
        changeSet.payload[wrapped.__meta.primaryKeys[0]] = value;
        wrapped.__identifier.setValue(value);
    }
    /**
     * Sets populate flag to new entities so they are serialized like if they were loaded from the db
     */
    markAsPopulated(changeSet, meta) {
        if (!this.config.get('populateAfterFlush')) {
            return;
        }
        changeSet.entity.__helper.populated();
        meta.relations.forEach(prop => {
            const value = changeSet.entity[prop.name];
            if (utils_1.Utils.isEntity(value, true)) {
                value.__helper.populated();
            }
            else if (utils_1.Utils.isCollection(value)) {
                value.populated();
            }
        });
    }
    async updateEntity(meta, changeSet, ctx) {
        if (!meta.versionProperty || !changeSet.entity[meta.versionProperty]) {
            return this.driver.nativeUpdate(changeSet.name, changeSet.getPrimaryKey(), changeSet.payload, ctx, false);
        }
        const cond = Object.assign(Object.assign({}, utils_1.Utils.getPrimaryKeyCond(changeSet.entity, meta.primaryKeys)), { [meta.versionProperty]: this.platform.quoteVersionValue(changeSet.entity[meta.versionProperty], meta.properties[meta.versionProperty]) });
        return this.driver.nativeUpdate(changeSet.name, cond, changeSet.payload, ctx, false);
    }
    async checkOptimisticLocks(meta, changeSets, ctx) {
        if (!meta.versionProperty || changeSets.every(cs => !cs.entity[meta.versionProperty])) {
            return;
        }
        const $or = changeSets.map(cs => (Object.assign(Object.assign({}, utils_1.Utils.getPrimaryKeyCond(cs.entity, meta.primaryKeys)), { [meta.versionProperty]: this.platform.quoteVersionValue(cs.entity[meta.versionProperty], meta.properties[meta.versionProperty]) })));
        const res = await this.driver.find(meta.className, { $or }, { fields: meta.primaryKeys }, ctx);
        if (res.length !== changeSets.length) {
            const compare = (a, b, keys) => keys.every(k => a[k] === b[k]);
            const entity = changeSets.find(cs => !res.some(row => compare(utils_1.Utils.getPrimaryKeyCond(cs.entity, meta.primaryKeys), row, meta.primaryKeys))).entity;
            throw errors_1.OptimisticLockError.lockFailed(entity);
        }
    }
    checkOptimisticLock(meta, changeSet, res) {
        if (meta.versionProperty && res && !res.affectedRows) {
            throw errors_1.OptimisticLockError.lockFailed(changeSet.entity);
        }
    }
    async reloadVersionValues(meta, changeSets, ctx) {
        if (!meta.versionProperty) {
            return;
        }
        const pk = utils_1.Utils.getPrimaryKeyHash(meta.primaryKeys);
        const pks = changeSets.map(cs => cs.getPrimaryKey());
        const data = await this.driver.find(meta.name, { [pk]: { $in: pks } }, {
            fields: [meta.versionProperty],
        }, ctx);
        const map = new Map();
        data.forEach(e => map.set(utils_1.Utils.getCompositeKeyHash(e, meta), e[meta.versionProperty]));
        for (const changeSet of changeSets) {
            const version = map.get(changeSet.entity.__helper.getSerializedPrimaryKey());
            // needed for sqlite
            if (meta.properties[meta.versionProperty].type.toLowerCase() === 'date') {
                changeSet.entity[meta.versionProperty] = new Date(version);
            }
            else {
                changeSet.entity[meta.versionProperty] = version;
            }
            changeSet.payload[meta.versionProperty] = version;
        }
    }
    processProperty(changeSet, prop) {
        const meta = this.metadata.find(changeSet.name);
        const values = utils_1.Utils.unwrapProperty(changeSet.payload, meta, prop, true); // for object embeddables
        const value = changeSet.payload[prop.name]; // for inline embeddables
        if (value instanceof entity_1.EntityIdentifier) {
            utils_1.Utils.setPayloadProperty(changeSet.payload, meta, prop, value.getValue());
        }
        values.forEach(([value, indexes]) => {
            if (value instanceof entity_1.EntityIdentifier) {
                utils_1.Utils.setPayloadProperty(changeSet.payload, meta, prop, value.getValue(), indexes);
            }
        });
        if (prop.onCreate && changeSet.type === ChangeSet_1.ChangeSetType.CREATE) {
            changeSet.entity[prop.name] = prop.onCreate(changeSet.entity);
            changeSet.payload[prop.name] = prop.customType ? prop.customType.convertToDatabaseValue(changeSet.entity[prop.name], this.platform) : changeSet.entity[prop.name];
            if (prop.primary) {
                this.mapPrimaryKey(changeSet.entity.__meta, changeSet.entity[prop.name], changeSet);
            }
        }
        if (prop.onUpdate && changeSet.type === ChangeSet_1.ChangeSetType.UPDATE) {
            changeSet.entity[prop.name] = prop.onUpdate(changeSet.entity);
            changeSet.payload[prop.name] = prop.customType ? prop.customType.convertToDatabaseValue(changeSet.entity[prop.name], this.platform) : changeSet.entity[prop.name];
        }
        if (changeSet.payload[prop.name] instanceof Date) {
            changeSet.payload[prop.name] = this.platform.processDateProperty(changeSet.payload[prop.name]);
        }
    }
    /**
     * Maps values returned via `returning` statement (postgres) or the inserted id (other sql drivers).
     * No need to handle composite keys here as they need to be set upfront.
     * We do need to map to the change set payload too, as it will be used in the originalEntityData for new entities.
     */
    mapReturnedValues(changeSet, res, meta) {
        if (this.platform.usesReturningStatement() && res.row && utils_1.Utils.hasObjectKeys(res.row)) {
            const data = meta.props.reduce((ret, prop) => {
                if (prop.primary && !changeSet.entity.__helper.hasPrimaryKey()) {
                    this.mapPrimaryKey(meta, res.row[prop.fieldNames[0]], changeSet);
                    return ret;
                }
                if (prop.fieldNames && utils_1.Utils.isDefined(res.row[prop.fieldNames[0]], true) && !utils_1.Utils.isDefined(changeSet.entity[prop.name], true)) {
                    ret[prop.name] = changeSet.payload[prop.name] = res.row[prop.fieldNames[0]];
                }
                return ret;
            }, {});
            if (utils_1.Utils.hasObjectKeys(data)) {
                this.hydrator.hydrate(changeSet.entity, meta, data, this.factory, 'returning', false, true);
            }
        }
    }
}
exports.ChangeSetPersister = ChangeSetPersister;
