"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityMap = void 0;
class IdentityMap {
    constructor() {
        this.registry = new Map();
    }
    store(item) {
        this.getStore(item.__meta.root).set(item.__helper.getSerializedPrimaryKey(), item);
    }
    delete(item) {
        this.getStore(item.__meta.root).delete(item.__helper.getSerializedPrimaryKey());
    }
    getByHash(meta, hash) {
        const store = this.getStore(meta);
        return store.has(hash) ? store.get(hash) : undefined;
    }
    getStore(meta) {
        const store = this.registry.get(meta.class);
        if (store) {
            return store;
        }
        const newStore = new Map();
        this.registry.set(meta.class, newStore);
        return newStore;
    }
    clear() {
        this.registry.clear();
    }
    values() {
        const ret = [];
        for (const store of this.registry.values()) {
            ret.push(...store.values());
        }
        return ret;
    }
    *[Symbol.iterator]() {
        for (const store of this.registry.values()) {
            for (const item of store.values()) {
                yield item;
            }
        }
    }
    keys() {
        const ret = [];
        for (const [cls, store] of this.registry) {
            ret.push(...[...store.keys()].map(hash => `${cls.name}-${hash}`));
        }
        return ret;
    }
    /**
     * For back compatibility only.
     */
    get(hash) {
        const [name, id] = hash.split('-', 2);
        const cls = [...this.registry.keys()].find(k => k.name === name);
        if (!cls) {
            return undefined;
        }
        const store = this.registry.get(cls);
        return store.has(id) ? store.get(id) : undefined;
    }
}
exports.IdentityMap = IdentityMap;
