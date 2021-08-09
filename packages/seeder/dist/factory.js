"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
const faker_1 = __importDefault(require("faker"));
class Factory {
    constructor(em) {
        this.em = em;
    }
    /**
     * Make a single entity
     * @param overrideParameters Object specifying what default attributes of the entity factory should be overridden
     */
    makeOne(overrideParameters) {
        const entity = this.em.create(this.model, Object.assign({}, this.definition(faker_1.default), overrideParameters));
        if (this.eachFunction) {
            this.eachFunction(entity);
        }
        return entity;
    }
    /**
     * Make multiple entities
     * @param amount Number of entities that should be generated
     * @param overrideParameters Object specifying what default attributes of the entity factory should be overridden
     */
    make(amount, overrideParameters) {
        return [...Array(amount)].map(() => {
            return this.makeOne(overrideParameters);
        });
    }
    /**
     * Create (and persist) a single entity
     * @param overrideParameters Object specifying what default attributes of the entity factory should be overridden
     */
    async createOne(overrideParameters) {
        const entity = this.makeOne(overrideParameters);
        await this.em.persistAndFlush(entity);
        return entity;
    }
    /**
     * Create (and persist) multiple entities
     * @param amount Number of entities that should be generated
     * @param overrideParameters Object specifying what default attributes of the entity factory should be overridden
     */
    async create(amount, overrideParameters) {
        const entities = this.make(amount, overrideParameters);
        await this.em.persistAndFlush(entities);
        return entities;
    }
    /**
     * Set a function that is applied to each entity before it is returned
     * In case of `createOne` or `create` it is applied before the entity is persisted
     * @param eachFunction The function that is applied on every entity
     */
    each(eachFunction) {
        this.eachFunction = eachFunction;
        return this;
    }
}
exports.Factory = Factory;
