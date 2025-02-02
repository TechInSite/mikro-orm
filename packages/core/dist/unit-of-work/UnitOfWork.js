"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitOfWork = void 0;
const entity_1 = require("../entity");
const ChangeSet_1 = require("./ChangeSet");
const ChangeSetComputer_1 = require("./ChangeSetComputer");
const ChangeSetPersister_1 = require("./ChangeSetPersister");
const CommitOrderCalculator_1 = require("./CommitOrderCalculator");
const Utils_1 = require("../utils/Utils");
const enums_1 = require("../enums");
const errors_1 = require("../errors");
const events_1 = require("../events");
const IdentityMap_1 = require("./IdentityMap");
class UnitOfWork {
    constructor(em) {
        this.em = em;
        /** map of references to managed entities */
        this.identityMap = new IdentityMap_1.IdentityMap();
        this.persistStack = new Set();
        this.removeStack = new Set();
        this.orphanRemoveStack = new Set();
        this.changeSets = new Map();
        this.collectionUpdates = new Set();
        this.collectionDeletions = new Set();
        this.extraUpdates = new Set();
        this.metadata = this.em.getMetadata();
        this.platform = this.em.getPlatform();
        this.eventManager = this.em.getEventManager();
        this.comparator = this.em.getComparator();
        this.changeSetComputer = new ChangeSetComputer_1.ChangeSetComputer(this.em.getValidator(), this.collectionUpdates, this.removeStack, this.metadata, this.platform, this.em.config);
        this.changeSetPersister = new ChangeSetPersister_1.ChangeSetPersister(this.em.getDriver(), this.metadata, this.em.config.getHydrator(this.metadata), this.em.getEntityFactory(), this.em.config);
        this.working = false;
    }
    merge(entity, visited) {
        const wrapped = entity.__helper;
        wrapped.__em = this.em;
        wrapped.__populated = true;
        if (!wrapped.hasPrimaryKey()) {
            return;
        }
        // skip new entities that could be linked from already persisted entity
        // that is being re-fetched (but allow calling `merge(e)` explicitly for those)
        if (!wrapped.__managed && visited) {
            return;
        }
        this.identityMap.store(entity);
        wrapped.__populated = true;
        // if visited is available, we are cascading, and need to be careful when resetting the entity data
        // as there can be some entity with already changed state that is not yet flushed
        if (!visited || !wrapped.__originalEntityData) {
            wrapped.__originalEntityData = this.comparator.prepareEntity(entity);
        }
        this.cascade(entity, enums_1.Cascade.MERGE, visited !== null && visited !== void 0 ? visited : new WeakSet());
    }
    /**
     * @internal
     */
    registerManaged(entity, data, refresh, newEntity) {
        this.identityMap.store(entity);
        if (newEntity) {
            return entity;
        }
        const helper = entity.__helper;
        helper.__em = this.em;
        if (data && helper.__initialized && (refresh || !helper.__originalEntityData)) {
            // we can't use the `data` directly here as it can contain fetch joined data, that can't be used for diffing the state
            helper.__originalEntityData = this.comparator.prepareEntity(entity);
        }
        return entity;
    }
    /**
     * Returns entity from the identity map. For composite keys, you need to pass an array of PKs in the same order as they are defined in `meta.primaryKeys`.
     */
    getById(entityName, id) {
        if (!id || (Array.isArray(id) && id.length === 0)) {
            return undefined;
        }
        const root = this.metadata.find(entityName).root;
        const hash = Array.isArray(id) ? Utils_1.Utils.getPrimaryKeyHash(id) : '' + id;
        return this.identityMap.getByHash(root, hash);
    }
    tryGetById(entityName, where, strict = true) {
        const pk = Utils_1.Utils.extractPK(where, this.metadata.find(entityName), strict);
        if (!pk) {
            return null;
        }
        return this.getById(entityName, pk);
    }
    /**
     * Returns map of all managed entities.
     */
    getIdentityMap() {
        return this.identityMap;
    }
    /**
     * Returns stored snapshot of entity state that is used for change set computation.
     */
    getOriginalEntityData(entity) {
        if (!entity) {
            return this.identityMap.values().map(e => {
                return e.__helper.__originalEntityData;
            });
        }
        return entity.__helper.__originalEntityData;
    }
    getPersistStack() {
        return this.persistStack;
    }
    getRemoveStack() {
        return this.removeStack;
    }
    getChangeSets() {
        return [...this.changeSets.values()];
    }
    getCollectionUpdates() {
        return [...this.collectionUpdates];
    }
    getExtraUpdates() {
        return this.extraUpdates;
    }
    computeChangeSet(entity) {
        const cs = this.changeSetComputer.computeChangeSet(entity);
        if (!cs || this.checkUniqueProps(cs)) {
            return;
        }
        this.initIdentifier(entity);
        this.checkOrphanRemoval(cs);
        this.changeSets.set(entity, cs);
        this.persistStack.delete(entity);
        entity.__helper.__originalEntityData = this.comparator.prepareEntity(entity);
    }
    recomputeSingleChangeSet(entity) {
        const changeSet = this.changeSets.get(entity);
        if (!changeSet) {
            return;
        }
        const cs = this.changeSetComputer.computeChangeSet(entity);
        /* istanbul ignore else */
        if (cs && !this.checkUniqueProps(changeSet)) {
            this.checkOrphanRemoval(cs);
            Object.assign(changeSet.payload, cs.payload);
            entity.__helper.__originalEntityData = this.comparator.prepareEntity(entity);
        }
    }
    persist(entity, visited = new WeakSet(), checkRemoveStack = false) {
        if (this.persistStack.has(entity)) {
            return;
        }
        if (checkRemoveStack && this.removeStack.has(entity)) {
            return;
        }
        this.persistStack.add(entity);
        this.removeStack.delete(entity);
        this.cascade(entity, enums_1.Cascade.PERSIST, visited, { checkRemoveStack: true });
    }
    remove(entity, visited = new WeakSet()) {
        if (!entity || this.removeStack.has(entity)) {
            return;
        }
        if (entity.__helper.hasPrimaryKey()) {
            this.removeStack.add(entity);
        }
        this.persistStack.delete(entity);
        this.cascade(entity, enums_1.Cascade.REMOVE, visited);
    }
    async commit() {
        if (this.working) {
            throw errors_1.ValidationError.cannotCommit();
        }
        const oldTx = this.em.getTransactionContext();
        try {
            await this.eventManager.dispatchEvent(enums_1.EventType.beforeFlush, { em: this.em, uow: this });
            this.working = true;
            this.computeChangeSets();
            await this.eventManager.dispatchEvent(enums_1.EventType.onFlush, { em: this.em, uow: this });
            // nothing to do, do not start transaction
            if (this.changeSets.size === 0 && this.collectionUpdates.size === 0 && this.collectionDeletions.size === 0 && this.extraUpdates.size === 0) {
                return void await this.eventManager.dispatchEvent(enums_1.EventType.afterFlush, { em: this.em, uow: this });
            }
            const groups = this.getChangeSetGroups();
            const platform = this.em.getPlatform();
            const runInTransaction = !this.em.isInTransaction() && platform.supportsTransactions() && this.em.config.get('implicitTransactions');
            if (runInTransaction) {
                await this.em.getConnection('write').transactional(trx => this.persistToDatabase(groups, trx), {
                    ctx: oldTx,
                    eventBroadcaster: new events_1.TransactionEventBroadcaster(this.em, this),
                });
            }
            else {
                await this.persistToDatabase(groups, this.em.getTransactionContext());
            }
            this.resetTransaction(oldTx);
            await this.eventManager.dispatchEvent(enums_1.EventType.afterFlush, { em: this.em, uow: this });
        }
        finally {
            this.postCommitCleanup();
            this.resetTransaction(oldTx);
        }
    }
    async lock(entity, mode, version, tables) {
        if (!this.getById(entity.constructor.name, entity.__helper.__primaryKeys)) {
            throw errors_1.ValidationError.entityNotManaged(entity);
        }
        const meta = this.metadata.find(entity.constructor.name);
        if (mode === enums_1.LockMode.OPTIMISTIC) {
            await this.lockOptimistic(entity, meta, version);
        }
        else if (mode != null) {
            await this.lockPessimistic(entity, mode, tables);
        }
    }
    clear() {
        this.identityMap.clear();
        this.postCommitCleanup();
    }
    unsetIdentity(entity) {
        this.identityMap.delete(entity);
        const wrapped = entity.__helper;
        wrapped.__meta.relations
            .filter(prop => prop.mappedBy && entity[prop.name] && entity[prop.name][prop.mappedBy])
            .forEach(prop => delete entity[prop.name][prop.mappedBy]);
        delete wrapped.__identifier;
        delete wrapped.__originalEntityData;
    }
    computeChangeSets() {
        this.changeSets.clear();
        for (const entity of this.identityMap) {
            if (!this.removeStack.has(entity) && !this.orphanRemoveStack.has(entity)) {
                this.persistStack.add(entity);
                this.cascade(entity, enums_1.Cascade.PERSIST, new WeakSet(), { checkRemoveStack: true });
            }
        }
        for (const entity of this.persistStack) {
            this.findNewEntities(entity);
        }
        for (const entity of this.orphanRemoveStack) {
            this.remove(entity);
        }
        for (const entity of this.removeStack) {
            const meta = this.metadata.find(entity.constructor.name);
            this.changeSets.set(entity, new ChangeSet_1.ChangeSet(entity, ChangeSet_1.ChangeSetType.DELETE, {}, meta));
        }
    }
    scheduleExtraUpdate(changeSet, props) {
        if (props.length === 0) {
            return;
        }
        this.extraUpdates.add([changeSet.entity, props.map(p => p.name), props.map(p => changeSet.entity[p.name])]);
        props.forEach(p => delete changeSet.entity[p.name]);
        props.forEach(p => delete changeSet.payload[p.name]);
    }
    scheduleOrphanRemoval(entity) {
        if (entity) {
            this.orphanRemoveStack.add(entity);
        }
    }
    cancelOrphanRemoval(entity) {
        this.orphanRemoveStack.delete(entity);
    }
    /**
     * Schedules a complete collection for removal when this UnitOfWork commits.
     */
    scheduleCollectionDeletion(collection) {
        this.collectionDeletions.add(collection);
    }
    /**
     * Gets the currently scheduled complete collection deletions
     */
    getScheduledCollectionDeletions() {
        return [...this.collectionDeletions];
    }
    findNewEntities(entity, visited = new WeakSet(), idx = 0) {
        if (visited.has(entity)) {
            return;
        }
        visited.add(entity);
        const wrapped = entity.__helper;
        if (!wrapped.__initialized || this.removeStack.has(entity) || this.orphanRemoveStack.has(entity)) {
            return;
        }
        this.initIdentifier(entity);
        for (const prop of entity.__meta.relations) {
            const targets = Utils_1.Utils.unwrapProperty(entity, entity.__meta, prop);
            targets.forEach(([target]) => {
                const reference = entity_1.Reference.unwrapReference(target);
                this.processReference(entity, prop, reference, visited, idx);
            });
        }
        const changeSet = this.changeSetComputer.computeChangeSet(entity);
        if (changeSet && !this.checkUniqueProps(changeSet)) {
            this.checkOrphanRemoval(changeSet);
            this.changeSets.set(entity, changeSet);
            this.persistStack.delete(entity);
        }
    }
    checkUniqueProps(changeSet) {
        if (this.platform.allowsUniqueBatchUpdates() || changeSet.type !== ChangeSet_1.ChangeSetType.UPDATE) {
            return false;
        }
        // when changing a unique nullable property (or a 1:1 relation), we can't do it in a single query as it would cause unique constraint violations
        const uniqueProps = changeSet.entity.__meta.props.filter(prop => prop.unique && prop.nullable && changeSet.payload[prop.name] != null);
        this.scheduleExtraUpdate(changeSet, uniqueProps);
        return changeSet.type === ChangeSet_1.ChangeSetType.UPDATE && !Utils_1.Utils.hasObjectKeys(changeSet.payload);
    }
    checkOrphanRemoval(changeSet) {
        const meta = this.metadata.find(changeSet.name);
        const props = meta.relations.filter(prop => prop.reference === enums_1.ReferenceType.ONE_TO_ONE);
        for (const prop of props) {
            // check diff, if we had a value on 1:1 before and now it changed (nulled or replaced), we need to trigger orphan removal
            const data = changeSet.entity.__helper.__originalEntityData;
            if (prop.orphanRemoval && data && data[prop.name] && prop.name in changeSet.payload) {
                const orphan = this.getById(prop.type, data[prop.name]);
                this.scheduleOrphanRemoval(orphan);
            }
        }
    }
    initIdentifier(entity) {
        const wrapped = entity.__helper;
        if (wrapped.__identifier || wrapped.hasPrimaryKey()) {
            return;
        }
        wrapped.__identifier = new entity_1.EntityIdentifier();
    }
    processReference(parent, prop, reference, visited, idx) {
        const isToOne = prop.reference === enums_1.ReferenceType.MANY_TO_ONE || prop.reference === enums_1.ReferenceType.ONE_TO_ONE;
        if (isToOne && Utils_1.Utils.isEntity(reference)) {
            return this.processToOneReference(reference, visited, idx);
        }
        if (Utils_1.Utils.isCollection(reference, prop, enums_1.ReferenceType.MANY_TO_MANY) && reference.isDirty()) {
            this.processToManyReference(reference, visited, parent, prop);
        }
    }
    processToOneReference(reference, visited, idx) {
        if (!reference.__helper.__managed) {
            this.findNewEntities(reference, visited, idx);
        }
    }
    processToManyReference(reference, visited, parent, prop) {
        if (this.isCollectionSelfReferenced(reference, visited)) {
            this.extraUpdates.add([parent, prop.name, reference]);
            parent[prop.name] = new entity_1.Collection(parent);
            return;
        }
        reference.getItems(false)
            .filter(item => !item.__helper.__originalEntityData)
            .forEach(item => this.findNewEntities(item, visited));
    }
    async runHooks(type, changeSet, sync = false) {
        const hasListeners = this.eventManager.hasListeners(type, changeSet.entity.__meta);
        if (!hasListeners) {
            return;
        }
        if (!sync) {
            return this.eventManager.dispatchEvent(type, { entity: changeSet.entity, em: this.em, changeSet });
        }
        const copy = this.comparator.prepareEntity(changeSet.entity);
        await this.eventManager.dispatchEvent(type, { entity: changeSet.entity, em: this.em, changeSet });
        const current = this.comparator.prepareEntity(changeSet.entity);
        const diff = this.comparator.diffEntities(changeSet.name, copy, current);
        Object.assign(changeSet.payload, diff);
        const wrapped = changeSet.entity.__helper;
        if (wrapped.__identifier && diff[wrapped.__meta.primaryKeys[0]]) {
            wrapped.__identifier.setValue(diff[wrapped.__meta.primaryKeys[0]]);
        }
    }
    postCommitCleanup() {
        this.persistStack.clear();
        this.removeStack.clear();
        this.orphanRemoveStack.clear();
        this.changeSets.clear();
        this.collectionUpdates.clear();
        this.collectionDeletions.clear();
        this.extraUpdates.clear();
        this.working = false;
    }
    cascade(entity, type, visited, options = {}) {
        if (visited.has(entity)) {
            return;
        }
        visited.add(entity);
        switch (type) {
            case enums_1.Cascade.PERSIST:
                this.persist(entity, visited, options.checkRemoveStack);
                break;
            case enums_1.Cascade.MERGE:
                this.merge(entity, visited);
                break;
            case enums_1.Cascade.REMOVE:
                this.remove(entity, visited);
                break;
        }
        for (const prop of entity.__meta.relations) {
            this.cascadeReference(entity, prop, type, visited, options);
        }
    }
    cascadeReference(entity, prop, type, visited, options) {
        this.fixMissingReference(entity, prop);
        if (!this.shouldCascade(prop, type)) {
            return;
        }
        const reference = entity_1.Reference.unwrapReference(entity[prop.name]);
        if ([enums_1.ReferenceType.MANY_TO_ONE, enums_1.ReferenceType.ONE_TO_ONE].includes(prop.reference) && Utils_1.Utils.isEntity(reference)) {
            return this.cascade(reference, type, visited, options);
        }
        const collection = reference;
        const requireFullyInitialized = type === enums_1.Cascade.PERSIST; // only cascade persist needs fully initialized items
        if ([enums_1.ReferenceType.ONE_TO_MANY, enums_1.ReferenceType.MANY_TO_MANY].includes(prop.reference) && collection) {
            if (type === enums_1.Cascade.MERGE && collection.isInitialized()) {
                collection.populated();
            }
            collection
                .getItems(false)
                .filter(item => !requireFullyInitialized || item.__helper.__initialized)
                .forEach(item => this.cascade(item, type, visited, options));
        }
    }
    isCollectionSelfReferenced(collection, visited) {
        const filtered = collection.getItems(false).filter(item => !item.__helper.__originalEntityData);
        return filtered.some(items => visited.has(items));
    }
    shouldCascade(prop, type) {
        if (type === enums_1.Cascade.REMOVE && prop.orphanRemoval) {
            return true;
        }
        // ignore user settings for merge, it is kept only for back compatibility, this should have never been configurable
        if (type === enums_1.Cascade.MERGE) {
            return true;
        }
        return prop.cascade && (prop.cascade.includes(type) || prop.cascade.includes(enums_1.Cascade.ALL));
    }
    async lockPessimistic(entity, mode, tables) {
        if (!this.em.isInTransaction()) {
            throw errors_1.ValidationError.transactionRequired();
        }
        await this.em.getDriver().lockPessimistic(entity, mode, tables, this.em.getTransactionContext());
    }
    async lockOptimistic(entity, meta, version) {
        if (!meta.versionProperty) {
            throw errors_1.OptimisticLockError.notVersioned(meta);
        }
        if (!Utils_1.Utils.isDefined(version)) {
            return;
        }
        const wrapped = entity.__helper;
        if (!wrapped.__initialized) {
            await wrapped.init();
        }
        const previousVersion = entity[meta.versionProperty];
        if (previousVersion !== version) {
            throw errors_1.OptimisticLockError.lockFailedVersionMismatch(entity, version, previousVersion);
        }
    }
    fixMissingReference(entity, prop) {
        const reference = entity_1.Reference.unwrapReference(entity[prop.name]);
        if ([enums_1.ReferenceType.MANY_TO_ONE, enums_1.ReferenceType.ONE_TO_ONE].includes(prop.reference) && reference && !Utils_1.Utils.isEntity(reference) && !prop.mapToPk) {
            entity[prop.name] = this.em.getReference(prop.type, reference, !!prop.wrappedReference);
        }
        const isCollection = [enums_1.ReferenceType.ONE_TO_MANY, enums_1.ReferenceType.MANY_TO_MANY].includes(prop.reference);
        if (isCollection && Array.isArray(reference)) {
            const collection = new entity_1.Collection(entity);
            entity[prop.name] = collection;
            collection.set(reference);
        }
    }
    async persistToDatabase(groups, tx) {
        var _a, _b, _c;
        if (tx) {
            this.em.setTransactionContext(tx);
        }
        const commitOrder = this.getCommitOrder();
        const commitOrderReversed = [...commitOrder].reverse();
        // 1. whole collection deletions
        for (const coll of this.collectionDeletions) {
            await this.em.getDriver().clearCollection(coll, tx);
            coll.takeSnapshot();
        }
        // 2. create
        for (const name of commitOrder) {
            await this.commitCreateChangeSets((_a = groups[ChangeSet_1.ChangeSetType.CREATE].get(name)) !== null && _a !== void 0 ? _a : [], tx);
        }
        // 3. update
        for (const name of commitOrder) {
            await this.commitUpdateChangeSets((_b = groups[ChangeSet_1.ChangeSetType.UPDATE].get(name)) !== null && _b !== void 0 ? _b : [], tx);
        }
        // 4. extra updates
        const extraUpdates = [];
        for (const extraUpdate of this.extraUpdates) {
            if (Array.isArray(extraUpdate[1])) {
                extraUpdate[1].forEach((p, i) => extraUpdate[0][p] = extraUpdate[2][i]);
            }
            else {
                extraUpdate[0][extraUpdate[1]] = extraUpdate[2];
            }
            const changeSet = this.changeSetComputer.computeChangeSet(extraUpdate[0]);
            if (changeSet) {
                extraUpdates.push(changeSet);
            }
        }
        await this.commitUpdateChangeSets(extraUpdates, tx, false);
        // 5. collection updates
        for (const coll of this.collectionUpdates) {
            await this.em.getDriver().syncCollection(coll, tx);
            coll.takeSnapshot();
        }
        // 6. delete - entity deletions need to be in reverse commit order
        for (const name of commitOrderReversed) {
            await this.commitDeleteChangeSets((_c = groups[ChangeSet_1.ChangeSetType.DELETE].get(name)) !== null && _c !== void 0 ? _c : [], tx);
        }
        // 7. take snapshots of all persisted collections
        for (const changeSet of this.changeSets.values()) {
            this.takeCollectionSnapshots(changeSet);
        }
    }
    async commitCreateChangeSets(changeSets, ctx) {
        if (changeSets.length === 0) {
            return;
        }
        const meta = changeSets[0].entity.__meta;
        const props = meta.relations.filter(prop => {
            return (prop.reference === enums_1.ReferenceType.ONE_TO_ONE && prop.owner) || prop.reference === enums_1.ReferenceType.MANY_TO_ONE;
        });
        for (const changeSet of changeSets) {
            this.findExtraUpdates(changeSet, props);
            await this.runHooks(enums_1.EventType.beforeCreate, changeSet, true);
        }
        await this.changeSetPersister.executeInserts(changeSets, ctx);
        for (const changeSet of changeSets) {
            this.registerManaged(changeSet.entity, changeSet.payload, true);
            await this.runHooks(enums_1.EventType.afterCreate, changeSet);
        }
    }
    findExtraUpdates(changeSet, props) {
        for (const prop of props) {
            if (!changeSet.entity[prop.name]) {
                continue;
            }
            const cs = this.changeSets.get(entity_1.Reference.unwrapReference(changeSet.entity[prop.name]));
            const isScheduledForInsert = cs && cs.type === ChangeSet_1.ChangeSetType.CREATE && !cs.persisted;
            if (isScheduledForInsert) {
                this.scheduleExtraUpdate(changeSet, [prop]);
            }
        }
    }
    async commitUpdateChangeSets(changeSets, ctx, batched = true) {
        if (changeSets.length === 0) {
            return;
        }
        for (const changeSet of changeSets) {
            await this.runHooks(enums_1.EventType.beforeUpdate, changeSet, true);
        }
        await this.changeSetPersister.executeUpdates(changeSets, batched, ctx);
        for (const changeSet of changeSets) {
            changeSet.entity.__helper.__originalEntityData = this.comparator.prepareEntity(changeSet.entity);
            await this.runHooks(enums_1.EventType.afterUpdate, changeSet);
        }
    }
    async commitDeleteChangeSets(changeSets, ctx) {
        if (changeSets.length === 0) {
            return;
        }
        for (const changeSet of changeSets) {
            await this.runHooks(enums_1.EventType.beforeDelete, changeSet, true);
        }
        await this.changeSetPersister.executeDeletes(changeSets, ctx);
        for (const changeSet of changeSets) {
            this.unsetIdentity(changeSet.entity);
            await this.runHooks(enums_1.EventType.afterDelete, changeSet);
        }
    }
    /**
     * Orders change sets so FK constrains are maintained, ensures stable order (needed for node < 11)
     */
    getChangeSetGroups() {
        const groups = {
            [ChangeSet_1.ChangeSetType.CREATE]: new Map(),
            [ChangeSet_1.ChangeSetType.UPDATE]: new Map(),
            [ChangeSet_1.ChangeSetType.DELETE]: new Map(),
        };
        this.changeSets.forEach(cs => {
            var _a;
            const group = groups[cs.type];
            const classGroup = (_a = group.get(cs.rootName)) !== null && _a !== void 0 ? _a : [];
            classGroup.push(cs);
            if (!group.has(cs.rootName)) {
                group.set(cs.rootName, classGroup);
            }
        });
        return groups;
    }
    getCommitOrder() {
        const calc = new CommitOrderCalculator_1.CommitOrderCalculator();
        const set = new Set();
        this.changeSets.forEach(cs => set.add(cs.rootName));
        set.forEach(entityName => calc.addNode(entityName));
        for (const entityName of set) {
            for (const prop of this.metadata.find(entityName).props) {
                calc.discoverProperty(prop, entityName);
            }
        }
        return calc.sort();
    }
    resetTransaction(oldTx) {
        if (oldTx) {
            this.em.setTransactionContext(oldTx);
        }
        else {
            this.em.resetTransactionContext();
        }
    }
    /**
     * Takes snapshots of all processed collections
     */
    takeCollectionSnapshots(changeSet) {
        changeSet.entity.__meta.relations.forEach(prop => {
            const value = changeSet.entity[prop.name];
            if (Utils_1.Utils.isCollection(value)) {
                value.takeSnapshot();
            }
        });
    }
}
exports.UnitOfWork = UnitOfWork;
