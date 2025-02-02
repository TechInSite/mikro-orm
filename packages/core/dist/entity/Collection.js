"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const ArrayCollection_1 = require("./ArrayCollection");
const Utils_1 = require("../utils/Utils");
const errors_1 = require("../errors");
const enums_1 = require("../enums");
const Reference_1 = require("./Reference");
class Collection extends ArrayCollection_1.ArrayCollection {
    constructor(owner, items, initialized = true) {
        super(owner, items);
        this.snapshot = []; // used to create a diff of the collection at commit time, undefined marks overridden values so we need to wipe when flushing
        this.dirty = false;
        this._populated = false;
        this._lazyInitialized = false;
        this.initialized = !!items || initialized;
        Object.defineProperty(this, 'snapshot', { enumerable: false });
        Object.defineProperty(this, '_populated', { enumerable: false });
        Object.defineProperty(this, '_lazyInitialized', { enumerable: false });
        Object.defineProperty(this, '$', { get: () => super.getItems() });
        Object.defineProperty(this, 'get', { value: () => super.getItems() });
    }
    /**
     * Creates new Collection instance, assigns it to the owning entity and sets the items to it (propagating them to their inverse sides)
     */
    static create(owner, prop, items, initialized) {
        const coll = new Collection(owner, items, initialized);
        owner[prop] = coll;
        if (items) {
            coll.set(items);
        }
        return coll;
    }
    /**
     * Initializes the collection and returns the items
     */
    async loadItems() {
        if (!this.isInitialized(true)) {
            await this.init();
        }
        return super.getItems();
    }
    /**
     * Gets the count of collection items from database instead of counting loaded items.
     * The value is cached, use `refresh = true` to force reload it.
     */
    async loadCount(refresh = false) {
        if (!refresh && Utils_1.Utils.isDefined(this._count)) {
            return this._count;
        }
        const em = this.getEntityManager();
        const pivotMeta = em.getMetadata().find(this.property.pivotTable);
        if (!em.getPlatform().usesPivotTable() && this.property.reference === enums_1.ReferenceType.MANY_TO_MANY) {
            this._count = this.length;
        }
        else if (this.property.pivotTable && !(this.property.inversedBy || this.property.mappedBy)) {
            this._count = await em.count(this.property.type, this.createLoadCountCondition({}, pivotMeta), { populate: [{ field: this.property.pivotTable }] });
        }
        else {
            this._count = await em.count(this.property.type, this.createLoadCountCondition({}, pivotMeta));
        }
        return this._count;
    }
    async matching(options) {
        const em = this.getEntityManager();
        const { where, ctx } = options, opts = __rest(options, ["where", "ctx"]);
        opts.orderBy = this.createOrderBy(opts.orderBy);
        let items;
        if (this.property.reference === enums_1.ReferenceType.MANY_TO_MANY && em.getPlatform().usesPivotTable()) {
            const map = await em.getDriver().loadFromPivotTable(this.property, [this.owner.__helper.__primaryKeys], where, opts.orderBy, ctx, options);
            items = map[this.owner.__helper.getSerializedPrimaryKey()].map((item) => em.merge(this.property.type, item, false, true));
        }
        else {
            items = await em.find(this.property.type, this.createCondition(where), opts);
        }
        if (options.store) {
            this.hydrate(items);
            this.populated();
            this.readonly = true;
        }
        return items;
    }
    /**
     * Returns the items (the collection must be initialized)
     */
    getItems(check = true) {
        if (check) {
            this.checkInitialized();
        }
        return super.getItems();
    }
    toJSON() {
        if (!this.isInitialized()) {
            return [];
        }
        return super.toJSON();
    }
    add(...items) {
        const unwrapped = items.map(i => Reference_1.Reference.unwrapReference(i));
        unwrapped.forEach(item => this.validateItemType(item));
        this.modify('add', unwrapped);
        this.cancelOrphanRemoval(unwrapped);
    }
    set(items) {
        const unwrapped = items.map(i => Reference_1.Reference.unwrapReference(i));
        unwrapped.forEach(item => this.validateItemType(item));
        this.validateModification(unwrapped);
        if (!this.initialized) {
            this.initialized = true;
            this.snapshot = undefined;
        }
        super.set(unwrapped);
        this.setDirty();
        this.cancelOrphanRemoval(unwrapped);
    }
    /**
     * @internal
     */
    hydrate(items) {
        this.initialized = true;
        super.hydrate(items);
        this.takeSnapshot();
    }
    removeAll() {
        const em = this.getEntityManager([], false);
        if (this.property.reference === enums_1.ReferenceType.ONE_TO_MANY && this.property.orphanRemoval && em) {
            em.getUnitOfWork().scheduleCollectionDeletion(this);
            const unwrapped = this.getItems(false).map(i => Reference_1.Reference.unwrapReference(i));
            this.modify('remove', unwrapped);
        }
        else {
            super.removeAll();
        }
    }
    remove(...items) {
        const unwrapped = items.map(i => Reference_1.Reference.unwrapReference(i));
        this.modify('remove', unwrapped);
        const em = this.getEntityManager(unwrapped, false);
        if (this.property.orphanRemoval && em) {
            for (const item of unwrapped) {
                em.getUnitOfWork().scheduleOrphanRemoval(item);
            }
        }
    }
    contains(item, check = true) {
        if (check) {
            this.checkInitialized();
        }
        return super.contains(item);
    }
    count() {
        this.checkInitialized();
        return super.count();
    }
    shouldPopulate() {
        return this._populated && !this._lazyInitialized;
    }
    populated(populated = true) {
        this._populated = populated;
        this._lazyInitialized = false;
    }
    isDirty() {
        return this.dirty;
    }
    setDirty(dirty = true) {
        this.dirty = dirty;
    }
    async init(populate = [], where, orderBy) {
        const options = Utils_1.Utils.isObject(populate) ? populate : { populate, where, orderBy };
        const em = this.getEntityManager();
        if (!this.initialized && this.property.reference === enums_1.ReferenceType.MANY_TO_MANY && em.getPlatform().usesPivotTable()) {
            const map = await em.getDriver().loadFromPivotTable(this.property, [this.owner.__helper.__primaryKeys], options.where, options.orderBy);
            this.hydrate(map[this.owner.__helper.getSerializedPrimaryKey()].map((item) => em.merge(this.property.type, item, false, true)));
            this._lazyInitialized = true;
            return this;
        }
        // do not make db call if we know we will get no results
        if (this.property.reference === enums_1.ReferenceType.MANY_TO_MANY && (this.property.owner || em.getPlatform().usesPivotTable()) && this.length === 0) {
            this.initialized = true;
            this.dirty = false;
            this._lazyInitialized = true;
            return this;
        }
        where = this.createCondition(options.where);
        const order = [...this.items]; // copy order of references
        const customOrder = !!options.orderBy;
        orderBy = this.createOrderBy(options.orderBy);
        const items = await em.find(this.property.type, where, options.populate, orderBy);
        if (!customOrder) {
            this.reorderItems(items, order);
        }
        this.items.clear();
        let i = 0;
        items.forEach(item => {
            this.items.add(item);
            this[i++] = item;
        });
        this.initialized = true;
        this.dirty = false;
        this._lazyInitialized = true;
        return this;
    }
    /**
     * @internal
     */
    takeSnapshot() {
        this.snapshot = [...this.items];
        this.setDirty(false);
    }
    /**
     * @internal
     */
    getSnapshot() {
        return this.snapshot;
    }
    getEntityManager(items = [], required = true) {
        let em = this.owner.__helper.__em;
        if (!em) {
            const item = items.concat(...this.items).find(i => i === null || i === void 0 ? void 0 : i.__helper.__em);
            em = item === null || item === void 0 ? void 0 : item.__helper.__em;
        }
        if (!em && required) {
            throw errors_1.ValidationError.entityNotManaged(this.owner);
        }
        return em;
    }
    createCondition(cond = {}) {
        if (this.property.reference === enums_1.ReferenceType.ONE_TO_MANY) {
            cond[this.property.mappedBy] = this.owner.__helper.getPrimaryKey();
        }
        else { // MANY_TO_MANY
            this.createManyToManyCondition(cond);
        }
        return cond;
    }
    createOrderBy(orderBy = {}) {
        if (Utils_1.Utils.isEmpty(orderBy) && this.property.reference === enums_1.ReferenceType.ONE_TO_MANY) {
            const defaultOrder = this.property.referencedColumnNames.reduce((o, name) => {
                o[name] = enums_1.QueryOrder.ASC;
                return o;
            }, {});
            orderBy = this.property.orderBy || defaultOrder;
        }
        return orderBy;
    }
    createManyToManyCondition(cond) {
        if (this.property.owner || this.property.pivotTable) {
            // we know there is at least one item as it was checked in load method
            const pk = this.property.targetMeta.primaryKeys[0];
            cond[pk] = { $in: [] };
            this.items.forEach((item) => cond[pk].$in.push(item.__helper.getPrimaryKey()));
        }
        else {
            cond[this.property.mappedBy] = this.owner.__helper.getPrimaryKey();
        }
    }
    createLoadCountCondition(cond, pivotMeta) {
        const val = this.owner.__meta.compositePK ? { $in: this.owner.__helper.__primaryKeys } : this.owner.__helper.getPrimaryKey();
        if (this.property.reference === enums_1.ReferenceType.ONE_TO_MANY) {
            cond[this.property.mappedBy] = val;
        }
        else if (pivotMeta && this.property.owner && !this.property.inversedBy) {
            const pivotProp1 = pivotMeta.properties[this.property.type + '_inverse'];
            const inverse = pivotProp1.mappedBy;
            const key = `${this.property.pivotTable}.${pivotMeta.properties[inverse].name}`;
            cond[key] = val;
        }
        else {
            const key = this.property.owner ? this.property.inversedBy : this.property.mappedBy;
            cond[key] = val;
        }
        return cond;
    }
    modify(method, items) {
        if (method === 'remove') {
            this.checkInitialized();
        }
        this.validateModification(items);
        super[method](...items);
        this.setDirty();
    }
    checkInitialized() {
        if (!this.isInitialized()) {
            throw new Error(`Collection<${this.property.type}> of entity ${this.owner.constructor.name}[${this.owner.__helper.getPrimaryKey()}] not initialized`);
        }
    }
    /**
     * re-orders items after searching with `$in` operator
     */
    reorderItems(items, order) {
        if (this.property.reference === enums_1.ReferenceType.MANY_TO_MANY && this.property.owner) {
            items.sort((a, b) => order.indexOf(a) - order.indexOf(b));
        }
    }
    cancelOrphanRemoval(items) {
        const em = this.getEntityManager(items, false);
        if (!em) {
            return;
        }
        for (const item of items) {
            em.getUnitOfWork().cancelOrphanRemoval(item);
        }
    }
    validateItemType(item) {
        if (!Utils_1.Utils.isEntity(item)) {
            throw errors_1.ValidationError.notEntity(this.owner, this.property, item);
        }
    }
    validateModification(items) {
        if (this.readonly) {
            throw errors_1.ValidationError.cannotModifyReadonlyCollection(this.owner, this.property);
        }
        // currently we allow persisting to inverse sides only in SQL drivers
        if (this.property.pivotTable || !this.property.mappedBy) {
            return;
        }
        const check = (item) => {
            if (!item || item.__helper.__initialized) {
                return false;
            }
            return !item[this.property.mappedBy] && this.property.reference === enums_1.ReferenceType.MANY_TO_MANY;
        };
        // throw if we are modifying inverse side of M:N collection when owning side is initialized (would be ignored when persisting)
        if (items.find(item => check(item))) {
            throw errors_1.ValidationError.cannotModifyInverseCollection(this.owner, this.property);
        }
    }
}
exports.Collection = Collection;
