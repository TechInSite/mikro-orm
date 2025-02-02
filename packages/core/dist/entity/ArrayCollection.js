"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayCollection = void 0;
const Reference_1 = require("./Reference");
const wrap_1 = require("./wrap");
const enums_1 = require("../enums");
const Utils_1 = require("../utils/Utils");
class ArrayCollection {
    constructor(owner, items) {
        this.owner = owner;
        this.items = new Set();
        this.initialized = true;
        if (items) {
            let i = 0;
            this.items = new Set(items);
            this.items.forEach(item => this[i++] = item);
        }
        Object.defineProperty(this, 'items', { enumerable: false });
        Object.defineProperty(this, 'owner', { enumerable: false, writable: true });
        Object.defineProperty(this, '_property', { enumerable: false, writable: true });
        Object.defineProperty(this, '_count', { enumerable: false, writable: true });
        Object.defineProperty(this, '__collection', { value: true });
    }
    async loadCount() {
        return this.items.size;
    }
    getItems() {
        return [...this.items];
    }
    toArray() {
        if (this.items.size === 0) {
            return [];
        }
        const meta = this.property.targetMeta;
        const args = [...meta.toJsonParams.map(() => undefined), [this.property.name]];
        return this.getItems().map(item => wrap_1.wrap(item).toJSON(...args));
    }
    toJSON() {
        return this.toArray();
    }
    getIdentifiers(field) {
        const items = this.getItems();
        if (items.length === 0) {
            return [];
        }
        field = field !== null && field !== void 0 ? field : this.property.targetMeta.serializedPrimaryKey;
        return items.map(i => {
            if (Utils_1.Utils.isEntity(i[field], true)) {
                return wrap_1.wrap(i[field], true).getPrimaryKey();
            }
            return i[field];
        });
    }
    add(...items) {
        for (const item of items) {
            const entity = Reference_1.Reference.unwrapReference(item);
            if (!this.contains(entity, false)) {
                this.incrementCount(1);
                this[this.items.size] = entity;
                this.items.add(entity);
                this.propagate(entity, 'add');
            }
        }
    }
    set(items) {
        this.remove(...this.items);
        this.add(...items);
    }
    /**
     * @internal
     */
    hydrate(items) {
        for (let i = 0; i < this.items.size; i++) {
            delete this[i];
        }
        this.items.clear();
        this._count = 0;
        this.add(...items);
    }
    remove(...items) {
        this.incrementCount(-items.length);
        for (const item of items) {
            if (!item) {
                continue;
            }
            const entity = Reference_1.Reference.unwrapReference(item);
            delete this[this.items.size - 1]; // remove last item
            this.items.delete(entity);
            Object.assign(this, [...this.items]); // reassign array access
            this.propagate(entity, 'remove');
        }
    }
    removeAll() {
        this.remove(...this.items);
    }
    contains(item, check) {
        const entity = Reference_1.Reference.unwrapReference(item);
        return this.items.has(entity);
    }
    count() {
        return this.items.size;
    }
    isInitialized(fully = false) {
        if (fully) {
            return this.initialized && [...this.items].every((item) => item.__helper.__initialized);
        }
        return this.initialized;
    }
    get length() {
        return this.count();
    }
    *[Symbol.iterator]() {
        for (const item of this.items) {
            yield item;
        }
    }
    /**
     * @internal
     */
    get property() {
        if (!this._property) {
            const meta = this.owner.__meta;
            const field = Object.keys(meta.properties).find(k => this.owner[k] === this);
            this._property = meta.properties[field];
        }
        return this._property;
    }
    propagate(item, method) {
        if (this.property.owner && this.property.inversedBy) {
            this.propagateToInverseSide(item, method);
        }
        else if (!this.property.owner && this.property.mappedBy) {
            this.propagateToOwningSide(item, method);
        }
    }
    propagateToInverseSide(item, method) {
        const collection = item[this.property.inversedBy];
        if (this.shouldPropagateToCollection(collection, method)) {
            collection[method](this.owner);
        }
    }
    propagateToOwningSide(item, method) {
        const collection = item[this.property.mappedBy];
        if (this.property.reference === enums_1.ReferenceType.MANY_TO_MANY && this.shouldPropagateToCollection(collection, method)) {
            collection[method](this.owner);
        }
        else if (this.property.reference === enums_1.ReferenceType.ONE_TO_MANY && !(this.property.orphanRemoval && method === 'remove')) {
            const owner = this.property.targetMeta.properties[this.property.mappedBy].mapToPk ? this.owner.__helper.getPrimaryKey() : this.owner;
            item[this.property.mappedBy] = method === 'add' ? owner : null;
        }
    }
    shouldPropagateToCollection(collection, method) {
        if (!collection || !collection.isInitialized()) {
            return false;
        }
        if (method === 'add') {
            return !collection.contains(this.owner, false);
        }
        // remove
        return collection.contains(this.owner, false);
    }
    incrementCount(value) {
        if (typeof this._count === 'number') {
            this._count += value;
        }
    }
}
exports.ArrayCollection = ArrayCollection;
