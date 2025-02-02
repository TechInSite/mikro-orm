"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const async_hooks_1 = require("async_hooks");
/**
 * Uses `AsyncLocalStorage` to create async context that holds current EM fork.
 */
class RequestContext {
    constructor(map) {
        this.map = map;
        this.id = RequestContext.counter++;
    }
    /**
     * Returns default EntityManager.
     */
    get em() {
        return this.map.get('default');
    }
    /**
     * Creates new RequestContext instance and runs the code inside its domain.
     */
    static create(em, next) {
        const ctx = this.createContext(em);
        this.storage.run(ctx, next);
    }
    /**
     * Creates new RequestContext instance and runs the code inside its domain.
     * Async variant, when the `next` handler needs to be awaited (like in Koa).
     */
    static async createAsync(em, next) {
        const ctx = this.createContext(em);
        await new Promise((resolve, reject) => {
            this.storage.run(ctx, () => next().then(resolve).catch(reject));
        });
    }
    /**
     * Returns current RequestContext (if available).
     */
    static currentRequestContext() {
        return this.storage.getStore();
    }
    /**
     * Returns current EntityManager (if available).
     */
    static getEntityManager(name = 'default') {
        const context = RequestContext.currentRequestContext();
        return context ? context.map.get(name) : undefined;
    }
    static createContext(em) {
        const forks = new Map();
        if (Array.isArray(em)) {
            em.forEach(em => forks.set(em.name, em.fork(true, true)));
        }
        else {
            forks.set(em.name, em.fork(true, true));
        }
        return new RequestContext(forks);
    }
}
exports.RequestContext = RequestContext;
RequestContext.storage = new async_hooks_1.AsyncLocalStorage();
RequestContext.counter = 1;
