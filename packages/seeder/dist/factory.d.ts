import Faker from 'faker';
import { EntityManager } from '@mikro-orm/core';
export declare abstract class Factory<C> {
    private readonly em;
    abstract readonly model: {
        new (): C;
    };
    private eachFunction?;
    constructor(em: EntityManager);
    protected abstract definition(faker: typeof Faker): Partial<C>;
    /**
     * Make a single entity
     * @param overrideParameters Object specifying what default attributes of the entity factory should be overridden
     */
    makeOne(overrideParameters?: Partial<C>): C;
    /**
     * Make multiple entities
     * @param amount Number of entities that should be generated
     * @param overrideParameters Object specifying what default attributes of the entity factory should be overridden
     */
    make(amount: number, overrideParameters?: Partial<C>): C[];
    /**
     * Create (and persist) a single entity
     * @param overrideParameters Object specifying what default attributes of the entity factory should be overridden
     */
    createOne(overrideParameters?: Partial<C>): Promise<C>;
    /**
     * Create (and persist) multiple entities
     * @param amount Number of entities that should be generated
     * @param overrideParameters Object specifying what default attributes of the entity factory should be overridden
     */
    create(amount: number, overrideParameters?: Partial<C>): Promise<C[]>;
    /**
     * Set a function that is applied to each entity before it is returned
     * In case of `createOne` or `create` it is applied before the entity is persisted
     * @param eachFunction The function that is applied on every entity
     */
    each(eachFunction: (entity: C) => void): this;
}
