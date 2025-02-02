"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
const util_1 = require("util");
const utils_1 = require("./utils");
const entity_1 = require("./entity");
const unit_of_work_1 = require("./unit-of-work");
const enums_1 = require("./enums");
const events_1 = require("./events");
const EntityComparator_1 = require("./utils/EntityComparator");
const errors_1 = require("./errors");
/**
 * The EntityManager is the central access point to ORM functionality. It is a facade to all different ORM subsystems
 * such as UnitOfWork, Query Language and Repository API.
 * @template {D} current driver type
 */
class EntityManager {
    /**
     * @internal
     */
    constructor(config, driver, metadata, useContext = true, eventManager = new events_1.EventManager(config.get('subscribers'))) {
        this.config = config;
        this.driver = driver;
        this.metadata = metadata;
        this.useContext = useContext;
        this.eventManager = eventManager;
        this.id = EntityManager.counter++;
        this.name = this.config.get('contextName');
        this.validator = new entity_1.EntityValidator(this.config.get('strict'));
        this.repositoryMap = {};
        this.entityLoader = new entity_1.EntityLoader(this);
        this.comparator = new EntityComparator_1.EntityComparator(this.metadata, this.driver.getPlatform());
        this.unitOfWork = new unit_of_work_1.UnitOfWork(this);
        this.entityFactory = new entity_1.EntityFactory(this.unitOfWork, this);
        this.resultCache = this.config.getResultCacheAdapter();
        this.filters = {};
        this.filterParams = {};
    }
    /**
     * Gets the Driver instance used by this EntityManager.
     * Driver is singleton, for one MikroORM instance, only one driver is created.
     */
    getDriver() {
        return this.driver;
    }
    /**
     * Gets the Connection instance, by default returns write connection
     */
    getConnection(type) {
        return this.driver.getConnection(type);
    }
    /**
     * Gets the platform instance. Just like the driver, platform is singleton, one for a MikroORM instance.
     */
    getPlatform() {
        return this.driver.getPlatform();
    }
    /**
     * Gets repository for given entity. You can pass either string name or entity class reference.
     */
    getRepository(entityName) {
        entityName = utils_1.Utils.className(entityName);
        if (!this.repositoryMap[entityName]) {
            const meta = this.metadata.get(entityName);
            const RepositoryClass = this.config.getRepositoryClass(meta.customRepository);
            this.repositoryMap[entityName] = new RepositoryClass(this, entityName);
        }
        return this.repositoryMap[entityName];
    }
    /**
     * Gets EntityValidator instance
     */
    getValidator() {
        return this.validator;
    }
    /**
     * Finds all entities matching your `where` query.
     */
    async find(entityName, where, populate, orderBy, limit, offset) {
        const options = utils_1.Utils.isObject(populate) ? populate : { populate, orderBy, limit, offset };
        if (options.disableIdentityMap) {
            const fork = this.fork(false);
            const ret = await fork.find(entityName, where, Object.assign(Object.assign({}, options), { disableIdentityMap: false }));
            fork.clear();
            return ret;
        }
        entityName = utils_1.Utils.className(entityName);
        where = await this.processWhere(entityName, where, options, 'read');
        this.validator.validateParams(where);
        options.orderBy = options.orderBy || {};
        options.populate = this.preparePopulate(entityName, options.populate, options.strategy);
        const cached = await this.tryCache(entityName, options.cache, [entityName, 'em.find', options, where], options.refresh, true);
        if (cached === null || cached === void 0 ? void 0 : cached.data) {
            await this.entityLoader.populate(entityName, cached.data, options.populate, Object.assign(Object.assign({}, options), { where, convertCustomTypes: false, lookup: false }));
            return cached.data;
        }
        const results = await this.driver.find(entityName, where, options, this.transactionContext);
        if (results.length === 0) {
            await this.storeCache(options.cache, cached, []);
            return [];
        }
        const ret = [];
        for (const data of results) {
            const entity = this.getEntityFactory().create(entityName, data, { merge: true, refresh: options.refresh, convertCustomTypes: true });
            this.getUnitOfWork().registerManaged(entity, data, options.refresh);
            ret.push(entity);
        }
        const unique = utils_1.Utils.unique(ret);
        await this.entityLoader.populate(entityName, unique, options.populate, Object.assign(Object.assign({}, options), { where, convertCustomTypes: false, lookup: false }));
        await this.storeCache(options.cache, cached, () => unique.map(e => e.__helper.toPOJO()));
        return unique;
    }
    /**
     * Registers global filter to this entity manager. Global filters are enabled by default (unless disabled via last parameter).
     */
    addFilter(name, cond, entityName, enabled = true) {
        const options = { name, cond, default: enabled };
        if (entityName) {
            options.entity = utils_1.Utils.asArray(entityName).map(n => utils_1.Utils.className(n));
        }
        this.filters[name] = options;
    }
    /**
     * Sets filter parameter values globally inside context defined by this entity manager.
     * If you want to set shared value for all contexts, be sure to use the root entity manager.
     */
    setFilterParams(name, args) {
        this.getContext().filterParams[name] = args;
    }
    /**
     * Returns filter parameters for given filter set in this context.
     */
    getFilterParams(name) {
        return this.getContext().filterParams[name];
    }
    async processWhere(entityName, where, options, type) {
        var _a;
        where = utils_1.QueryHelper.processWhere(where, entityName, this.metadata, this.driver.getPlatform(), options.convertCustomTypes);
        where = await this.applyFilters(entityName, where, (_a = options.filters) !== null && _a !== void 0 ? _a : {}, type);
        where = await this.applyDiscriminatorCondition(entityName, where);
        return where;
    }
    applyDiscriminatorCondition(entityName, where) {
        const meta = this.metadata.find(entityName);
        if (!meta || !meta.discriminatorValue) {
            return where;
        }
        const types = Object.values(meta.root.discriminatorMap).map(cls => this.metadata.find(cls));
        const children = [];
        const lookUpChildren = (ret, type) => {
            const children = types.filter(meta2 => meta2.extends === type);
            children.forEach(m => lookUpChildren(ret, m.className));
            ret.push(...children.filter(c => c.discriminatorValue));
            return children;
        };
        lookUpChildren(children, meta.className);
        where[meta.root.discriminatorColumn] = children.length > 0 ? { $in: [meta.discriminatorValue, ...children.map(c => c.discriminatorValue)] } : meta.discriminatorValue;
        return where;
    }
    /**
     * @internal
     */
    async applyFilters(entityName, where, options, type) {
        const meta = this.metadata.find(entityName);
        const filters = [];
        const ret = [];
        if (!meta) {
            return where;
        }
        const active = new Set();
        const push = (source) => {
            const activeFilters = utils_1.QueryHelper
                .getActiveFilters(entityName, options, source)
                .filter(f => !active.has(f.name));
            filters.push(...activeFilters);
            activeFilters.forEach(f => active.add(f.name));
        };
        push(this.config.get('filters'));
        push(this.filters);
        push(meta.filters);
        if (filters.length === 0) {
            return where;
        }
        for (const filter of filters) {
            let cond;
            if (filter.cond instanceof Function) {
                const args = utils_1.Utils.isPlainObject(options[filter.name]) ? options[filter.name] : this.getContext().filterParams[filter.name];
                if (!args && filter.cond.length > 0 && filter.args !== false) {
                    throw new Error(`No arguments provided for filter '${filter.name}'`);
                }
                cond = await filter.cond(args, type);
            }
            else {
                cond = filter.cond;
            }
            ret.push(utils_1.QueryHelper.processWhere(cond, entityName, this.metadata, this.driver.getPlatform()));
        }
        const conds = [...ret, where].filter(c => utils_1.Utils.hasObjectKeys(c));
        return conds.length > 1 ? { $and: conds } : conds[0];
    }
    /**
     * Calls `em.find()` and `em.count()` with the same arguments (where applicable) and returns the results as tuple
     * where first element is the array of entities and the second is the count.
     */
    async findAndCount(entityName, where, populate, orderBy, limit, offset) {
        const options = utils_1.Utils.isObject(populate) ? populate : { populate, orderBy, limit, offset };
        const [entities, count] = await Promise.all([
            this.find(entityName, where, populate, orderBy, limit, offset),
            this.count(entityName, where, options),
        ]);
        return [entities, count];
    }
    /**
     * Finds first entity matching your `where` query.
     */
    async findOne(entityName, where, populate, orderBy) {
        const options = utils_1.Utils.isObject(populate) ? populate : { populate, orderBy };
        if (options.disableIdentityMap) {
            const fork = this.fork(false);
            const ret = await fork.findOne(entityName, where, Object.assign(Object.assign({}, options), { disableIdentityMap: false }));
            fork.clear();
            return ret;
        }
        entityName = utils_1.Utils.className(entityName);
        const meta = this.metadata.get(entityName);
        where = await this.processWhere(entityName, where, options, 'read');
        this.validator.validateEmptyWhere(where);
        this.checkLockRequirements(options.lockMode, meta);
        let entity = this.getUnitOfWork().tryGetById(entityName, where);
        const isOptimisticLocking = !utils_1.Utils.isDefined(options.lockMode) || options.lockMode === enums_1.LockMode.OPTIMISTIC;
        if (entity && entity.__helper.__initialized && !options.refresh && isOptimisticLocking) {
            return this.lockAndPopulate(entityName, entity, where, options);
        }
        this.validator.validateParams(where);
        options.populate = this.preparePopulate(entityName, options.populate, options.strategy);
        const cached = await this.tryCache(entityName, options.cache, [entityName, 'em.findOne', options, where], options.refresh, true);
        if (cached === null || cached === void 0 ? void 0 : cached.data) {
            await this.entityLoader.populate(entityName, [cached.data], options.populate, Object.assign(Object.assign({}, options), { where, convertCustomTypes: false, lookup: false }));
            return cached.data;
        }
        const data = await this.driver.findOne(entityName, where, options, this.transactionContext);
        if (!data) {
            await this.storeCache(options.cache, cached, null);
            return null;
        }
        entity = this.getEntityFactory().create(entityName, data, { refresh: options.refresh, merge: true, convertCustomTypes: true });
        this.getUnitOfWork().registerManaged(entity, data, options.refresh);
        await this.lockAndPopulate(entityName, entity, where, options);
        await this.storeCache(options.cache, cached, () => entity.__helper.toPOJO());
        return entity;
    }
    /**
     * Finds first entity matching your `where` query. If nothing found, it will throw an error.
     * You can override the factory for creating this method via `options.failHandler` locally
     * or via `Configuration.findOneOrFailHandler` globally.
     */
    async findOneOrFail(entityName, where, populate, orderBy) {
        const entity = await this.findOne(entityName, where, populate, orderBy);
        if (!entity) {
            const options = utils_1.Utils.isObject(populate) ? populate : {};
            options.failHandler = options.failHandler || this.config.get('findOneOrFailHandler');
            entityName = utils_1.Utils.className(entityName);
            throw options.failHandler(entityName, where);
        }
        return entity;
    }
    /**
     * Runs your callback wrapped inside a database transaction.
     */
    async transactional(cb, options = {}) {
        var _a;
        const em = this.fork(false);
        /* istanbul ignore next */
        options.ctx = (_a = options.ctx) !== null && _a !== void 0 ? _a : this.transactionContext;
        return utils_1.TransactionContext.createAsync(em, async () => {
            return em.getConnection().transactional(async (trx) => {
                em.transactionContext = trx;
                const ret = await cb(em);
                await em.flush();
                return ret;
            }, Object.assign(Object.assign({}, options), { eventBroadcaster: new events_1.TransactionEventBroadcaster(em) }));
        });
    }
    /**
     * Starts new transaction bound to this EntityManager. Use `ctx` parameter to provide the parent when nesting transactions.
     */
    async begin(options = {}) {
        this.transactionContext = await this.getConnection('write').begin(Object.assign(Object.assign({}, options), { eventBroadcaster: new events_1.TransactionEventBroadcaster(this) }));
    }
    /**
     * Commits the transaction bound to this EntityManager. Flushes before doing the actual commit query.
     */
    async commit() {
        await this.flush();
        await this.getConnection('write').commit(this.transactionContext, new events_1.TransactionEventBroadcaster(this));
        delete this.transactionContext;
    }
    /**
     * Rollbacks the transaction bound to this EntityManager.
     */
    async rollback() {
        await this.getConnection('write').rollback(this.transactionContext, new events_1.TransactionEventBroadcaster(this));
        delete this.transactionContext;
    }
    /**
     * Runs your callback wrapped inside a database transaction.
     */
    async lock(entity, lockMode, options = {}) {
        options = utils_1.Utils.isPlainObject(options) ? options : { lockVersion: options };
        await this.getUnitOfWork().lock(entity, lockMode, options.lockVersion, options.lockTableAliases);
    }
    /**
     * Fires native insert query. Calling this has no side effects on the context (identity map).
     */
    async nativeInsert(entityNameOrEntity, data) {
        let entityName;
        if (data === undefined) {
            entityName = entityNameOrEntity.constructor.name;
            data = this.comparator.prepareEntity(entityNameOrEntity);
        }
        else {
            entityName = utils_1.Utils.className(entityNameOrEntity);
        }
        data = utils_1.QueryHelper.processObjectParams(data);
        this.validator.validateParams(data, 'insert data');
        const res = await this.driver.nativeInsert(entityName, data, this.transactionContext);
        return res.insertId;
    }
    /**
     * Fires native update query. Calling this has no side effects on the context (identity map).
     */
    async nativeUpdate(entityName, where, data, options = {}) {
        entityName = utils_1.Utils.className(entityName);
        data = utils_1.QueryHelper.processObjectParams(data);
        where = await this.processWhere(entityName, where, options, 'update');
        this.validator.validateParams(data, 'update data');
        this.validator.validateParams(where, 'update condition');
        const res = await this.driver.nativeUpdate(entityName, where, data, this.transactionContext);
        return res.affectedRows;
    }
    /**
     * Fires native delete query. Calling this has no side effects on the context (identity map).
     */
    async nativeDelete(entityName, where, options = {}) {
        entityName = utils_1.Utils.className(entityName);
        where = await this.processWhere(entityName, where, options, 'delete');
        this.validator.validateParams(where, 'delete condition');
        const res = await this.driver.nativeDelete(entityName, where, this.transactionContext);
        return res.affectedRows;
    }
    /**
     * Maps raw database result to an entity and merges it to this EntityManager.
     */
    map(entityName, result) {
        entityName = utils_1.Utils.className(entityName);
        const meta = this.metadata.get(entityName);
        const data = this.driver.mapResult(result, meta);
        Object.keys(data).forEach(k => {
            const prop = meta.properties[k];
            if (prop && prop.reference === enums_1.ReferenceType.SCALAR && enums_1.SCALAR_TYPES.includes(prop.type) && (prop.setter || !prop.getter)) {
                data[k] = this.validator.validateProperty(prop, data[k], data);
            }
        });
        return this.merge(entityName, data, true, true);
    }
    /**
     * Merges given entity to this EntityManager so it becomes managed. You can force refreshing of existing entities
     * via second parameter. By default it will return already loaded entities without modifying them.
     */
    merge(entityName, data, refresh, convertCustomTypes) {
        if (utils_1.Utils.isEntity(entityName)) {
            return this.merge(entityName.constructor.name, entityName, data);
        }
        entityName = utils_1.Utils.className(entityName);
        this.validator.validatePrimaryKey(data, this.metadata.get(entityName));
        let entity = this.getUnitOfWork().tryGetById(entityName, data, false);
        if (entity && entity.__helper.__initialized && !refresh) {
            return entity;
        }
        const meta = this.metadata.find(entityName);
        const childMeta = this.metadata.getByDiscriminatorColumn(meta, data);
        entity = utils_1.Utils.isEntity(data) ? data : this.getEntityFactory().create(entityName, data, { merge: true, refresh, convertCustomTypes });
        this.validator.validate(entity, data, childMeta !== null && childMeta !== void 0 ? childMeta : meta);
        this.getUnitOfWork().merge(entity);
        return entity;
    }
    /**
     * Creates new instance of given entity and populates it with given data
     */
    create(entityName, data, options = {}) {
        return this.getEntityFactory().create(entityName, data, Object.assign(Object.assign({}, options), { newEntity: !options.managed }));
    }
    /**
     * Shortcut for `wrap(entity).assign(data, { em })`
     */
    assign(entity, data, options = {}) {
        return entity_1.EntityAssigner.assign(entity, data, Object.assign({ em: this }, options));
    }
    /**
     * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
     */
    getReference(entityName, id, wrapped = false, convertCustomTypes = false) {
        const meta = this.metadata.get(utils_1.Utils.className(entityName));
        if (utils_1.Utils.isPrimaryKey(id)) {
            if (meta.compositePK) {
                throw errors_1.ValidationError.invalidCompositeIdentifier(meta);
            }
            id = [id];
        }
        const entity = this.getEntityFactory().createReference(entityName, id, { merge: true, convertCustomTypes });
        if (wrapped) {
            return entity_1.Reference.create(entity);
        }
        return entity;
    }
    /**
     * Returns total number of entities matching your `where` query.
     */
    async count(entityName, where = {}, options = {}) {
        entityName = utils_1.Utils.className(entityName);
        where = await this.processWhere(entityName, where, options, 'read');
        options.populate = this.preparePopulate(entityName, options.populate);
        this.validator.validateParams(where);
        const cached = await this.tryCache(entityName, options.cache, [entityName, 'em.count', options, where]);
        if (cached === null || cached === void 0 ? void 0 : cached.data) {
            return cached.data;
        }
        const count = await this.driver.count(entityName, where, options, this.transactionContext);
        await this.storeCache(options.cache, cached, () => count);
        return count;
    }
    /**
     * Tells the EntityManager to make an instance managed and persistent.
     * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
     */
    persist(entity) {
        if (utils_1.Utils.isEntity(entity)) {
            this.getUnitOfWork().persist(entity);
            return this;
        }
        const entities = utils_1.Utils.asArray(entity);
        for (const ent of entities) {
            if (!utils_1.Utils.isEntity(ent, true)) {
                /* istanbul ignore next */
                const meta = typeof ent === 'object' ? this.metadata.find(ent.constructor.name) : undefined;
                throw errors_1.ValidationError.notDiscoveredEntity(ent, meta);
            }
            this.getUnitOfWork().persist(entity_1.Reference.unwrapReference(ent));
        }
        return this;
    }
    /**
     * Persists your entity immediately, flushing all not yet persisted changes to the database too.
     * Equivalent to `em.persist(e).flush()`.
     */
    async persistAndFlush(entity) {
        await this.persist(entity).flush();
    }
    /**
     * Tells the EntityManager to make an instance managed and persistent.
     * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
     *
     * @deprecated use `persist()`
     */
    persistLater(entity) {
        this.persist(entity);
    }
    /**
     * Marks entity for removal.
     * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
     *
     * To remove entities by condition, use `em.nativeDelete()`.
     */
    remove(entity) {
        const entities = utils_1.Utils.asArray(entity, true);
        for (const ent of entities) {
            if (!utils_1.Utils.isEntity(ent, true)) {
                throw new Error(`You need to pass entity instance or reference to 'em.remove()'. To remove entities by condition, use 'em.nativeDelete()'.`);
            }
            this.getUnitOfWork().remove(entity_1.Reference.unwrapReference(ent));
        }
        return this;
    }
    /**
     * Removes an entity instance immediately, flushing all not yet persisted changes to the database too.
     * Equivalent to `em.remove(e).flush()`
     */
    async removeAndFlush(entity) {
        await this.remove(entity).flush();
    }
    /**
     * Marks entity for removal.
     * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
     *
     * @deprecated use `remove()`
     */
    removeLater(entity) {
        this.remove(entity);
    }
    /**
     * Flushes all changes to objects that have been queued up to now to the database.
     * This effectively synchronizes the in-memory state of managed objects with the database.
     */
    async flush() {
        await this.getUnitOfWork().commit();
    }
    /**
     * Clears the EntityManager. All entities that are currently managed by this EntityManager become detached.
     */
    clear() {
        this.getUnitOfWork().clear();
    }
    /**
     * Checks whether given property can be populated on the entity.
     */
    canPopulate(entityName, property) {
        entityName = utils_1.Utils.className(entityName);
        const [p, ...parts] = property.split('.');
        const props = this.metadata.get(entityName).properties;
        const ret = p in props && (props[p].reference !== enums_1.ReferenceType.SCALAR || props[p].lazy);
        if (!ret) {
            return false;
        }
        if (parts.length > 0) {
            return this.canPopulate(props[p].type, parts.join('.'));
        }
        return ret;
    }
    /**
     * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
     */
    async populate(entities, populate, options = {}) {
        const entitiesArray = utils_1.Utils.asArray(entities);
        if (entitiesArray.length === 0) {
            return entities;
        }
        populate = utils_1.Utils.isString(populate) ? utils_1.Utils.asArray(populate) : populate;
        const entityName = entitiesArray[0].constructor.name;
        const preparedPopulate = this.preparePopulate(entityName, populate);
        await this.entityLoader.populate(entityName, entitiesArray, preparedPopulate, options);
        return entities;
    }
    /**
     * Returns new EntityManager instance with its own identity map
     *
     * @param clear do we want clear identity map? defaults to true
     * @param useContext use request context? should be used only for top level request scope EM, defaults to false
     */
    fork(clear = true, useContext = false) {
        const em = new this.constructor(this.config, this.driver, this.metadata, useContext, this.eventManager);
        em.filters = Object.assign({}, this.filters);
        em.filterParams = utils_1.Utils.copy(this.filterParams);
        if (!clear) {
            for (const entity of this.getUnitOfWork().getIdentityMap()) {
                em.getUnitOfWork().registerManaged(entity);
            }
        }
        return em;
    }
    /**
     * Gets the UnitOfWork used by the EntityManager to coordinate operations.
     */
    getUnitOfWork() {
        return this.getContext().unitOfWork;
    }
    /**
     * Gets the EntityFactory used by the EntityManager.
     */
    getEntityFactory() {
        return this.getContext().entityFactory;
    }
    /**
     * Gets the EntityManager based on current transaction/request context.
     */
    getContext() {
        let em = utils_1.TransactionContext.getEntityManager(); // prefer the tx context
        if (!em) {
            // no explicit tx started
            em = this.useContext ? (this.config.get('context')(this.name) || this) : this;
        }
        return em;
    }
    getEventManager() {
        return this.eventManager;
    }
    /**
     * Checks whether this EntityManager is currently operating inside a database transaction.
     */
    isInTransaction() {
        return !!this.transactionContext;
    }
    /**
     * Gets the transaction context (driver dependent object used to make sure queries are executed on same connection).
     */
    getTransactionContext() {
        return this.transactionContext;
    }
    /**
     * Sets the transaction context.
     */
    setTransactionContext(ctx) {
        this.transactionContext = ctx;
    }
    /**
     * Resets the transaction context.
     */
    resetTransactionContext() {
        delete this.transactionContext;
    }
    /**
     * Gets the MetadataStorage.
     */
    getMetadata() {
        return this.metadata;
    }
    /**
     * Gets the EntityComparator.
     */
    getComparator() {
        return this.comparator;
    }
    checkLockRequirements(mode, meta) {
        if (!mode) {
            return;
        }
        if (mode === enums_1.LockMode.OPTIMISTIC && !meta.versionProperty) {
            throw errors_1.OptimisticLockError.notVersioned(meta);
        }
        if ([enums_1.LockMode.PESSIMISTIC_READ, enums_1.LockMode.PESSIMISTIC_WRITE].includes(mode) && !this.isInTransaction()) {
            throw errors_1.ValidationError.transactionRequired();
        }
    }
    async lockAndPopulate(entityName, entity, where, options) {
        if (options.lockMode === enums_1.LockMode.OPTIMISTIC) {
            await this.lock(entity, options.lockMode, {
                lockVersion: options.lockVersion,
                lockTableAliases: options.lockTableAliases,
            });
        }
        const preparedPopulate = this.preparePopulate(entityName, options.populate, options.strategy);
        await this.entityLoader.populate(entityName, [entity], preparedPopulate, Object.assign(Object.assign({}, options), { where, convertCustomTypes: false, lookup: false }));
        return entity;
    }
    preparePopulate(entityName, populate, strategy) {
        const meta = this.metadata.get(entityName);
        if (!populate) {
            return this.entityLoader.normalizePopulate(entityName, [], strategy);
        }
        if (utils_1.Utils.isPlainObject(populate)) {
            return this.preparePopulateObject(meta, populate, strategy);
        }
        if (Array.isArray(populate)) {
            populate = populate.map(field => {
                if (utils_1.Utils.isString(field)) {
                    return { field, strategy };
                }
                return field;
            });
        }
        const ret = this.entityLoader.normalizePopulate(entityName, populate, strategy);
        return ret.map(field => {
            var _a;
            field.strategy = (_a = strategy !== null && strategy !== void 0 ? strategy : field.strategy) !== null && _a !== void 0 ? _a : this.config.get('loadStrategy');
            return field;
        });
    }
    preparePopulateObject(meta, populate, strategy) {
        return Object.keys(populate).map(field => {
            var _a;
            const prop = meta.properties[field];
            const fieldStrategy = (_a = strategy !== null && strategy !== void 0 ? strategy : (utils_1.Utils.isString(populate[field]) ? populate[field] : prop.strategy)) !== null && _a !== void 0 ? _a : this.config.get('loadStrategy');
            if (populate[field] === true) {
                return { field, strategy: fieldStrategy };
            }
            if (utils_1.Utils.isPlainObject(populate[field])) {
                const meta2 = this.metadata.get(prop.type);
                return { field, strategy: fieldStrategy, children: this.preparePopulateObject(meta2, populate[field], strategy) };
            }
            return { field, strategy: fieldStrategy };
        });
    }
    /**
     * @internal
     */
    async tryCache(entityName, config, key, refresh, merge) {
        if (!config) {
            return undefined;
        }
        const cacheKey = Array.isArray(config) ? config[0] : JSON.stringify(key);
        const cached = await this.resultCache.get(cacheKey);
        if (cached) {
            let data;
            if (Array.isArray(cached) && merge) {
                data = cached.map(item => this.getEntityFactory().create(entityName, item, { merge: true, convertCustomTypes: true, refresh }));
            }
            else if (utils_1.Utils.isObject(cached) && merge) {
                data = this.getEntityFactory().create(entityName, cached, { merge: true, convertCustomTypes: true, refresh });
            }
            else {
                data = cached;
            }
            return { key: cacheKey, data };
        }
        return { key: cacheKey };
    }
    /**
     * @internal
     */
    async storeCache(config, key, data) {
        if (config) {
            /* istanbul ignore next */
            const expiration = Array.isArray(config) ? config[1] : (utils_1.Utils.isNumber(config) ? config : undefined);
            await this.resultCache.set(key.key, data instanceof Function ? data() : data, '', expiration);
        }
    }
    /**
     * @internal
     */
    [util_1.inspect.custom]() {
        return `[EntityManager<${this.id}>]`;
    }
}
exports.EntityManager = EntityManager;
EntityManager.counter = 1;
