/// <reference types="node" />
import { inspect } from 'util';
import { Configuration } from './utils';
import { AssignOptions, EntityFactory, EntityLoaderOptions, EntityRepository, EntityValidator, IdentifiedReference, Reference } from './entity';
import { UnitOfWork } from './unit-of-work';
import { CountOptions, DeleteOptions, EntityManagerType, FindOneOptions, FindOneOrFailOptions, FindOptions, IDatabaseDriver, UpdateOptions } from './drivers';
import { AnyEntity, Dictionary, EntityData, EntityDictionary, EntityDTO, EntityName, FilterQuery, GetRepository, Loaded, New, Populate, Primary } from './typings';
import { IsolationLevel, LockMode, QueryOrderMap } from './enums';
import { MetadataStorage } from './metadata';
import { Transaction } from './connections';
import { EventManager } from './events';
import { EntityComparator } from './utils/EntityComparator';
/**
 * The EntityManager is the central access point to ORM functionality. It is a facade to all different ORM subsystems
 * such as UnitOfWork, Query Language and Repository API.
 * @template {D} current driver type
 */
export declare class EntityManager<D extends IDatabaseDriver = IDatabaseDriver> {
    readonly config: Configuration;
    private readonly driver;
    private readonly metadata;
    private readonly useContext;
    private readonly eventManager;
    private static counter;
    readonly id: number;
    readonly name: string;
    private readonly validator;
    private readonly repositoryMap;
    private readonly entityLoader;
    private readonly comparator;
    private readonly unitOfWork;
    private readonly entityFactory;
    private readonly resultCache;
    private filters;
    private filterParams;
    private transactionContext?;
    /**
     * @internal
     */
    constructor(config: Configuration, driver: D, metadata: MetadataStorage, useContext?: boolean, eventManager?: EventManager);
    /**
     * Gets the Driver instance used by this EntityManager.
     * Driver is singleton, for one MikroORM instance, only one driver is created.
     */
    getDriver(): D;
    /**
     * Gets the Connection instance, by default returns write connection
     */
    getConnection(type?: 'read' | 'write'): ReturnType<D['getConnection']>;
    /**
     * Gets the platform instance. Just like the driver, platform is singleton, one for a MikroORM instance.
     */
    getPlatform(): ReturnType<D['getPlatform']>;
    /**
     * Gets repository for given entity. You can pass either string name or entity class reference.
     */
    getRepository<T extends AnyEntity<T>, U extends EntityRepository<T> = EntityRepository<T>>(entityName: EntityName<T>): GetRepository<T, U>;
    /**
     * Gets EntityValidator instance
     */
    getValidator(): EntityValidator;
    /**
     * Finds all entities matching your `where` query. You can pass additional options via the `options` parameter.
     */
    find<T extends AnyEntity<T>, P extends Populate<T> = any>(entityName: EntityName<T>, where: FilterQuery<T>, options?: FindOptions<T, P>): Promise<Loaded<T, P>[]>;
    /**
     * Finds all entities matching your `where` query.
     */
    find<T extends AnyEntity<T>, P extends Populate<T> = any>(entityName: EntityName<T>, where: FilterQuery<T>, populate?: P, orderBy?: QueryOrderMap, limit?: number, offset?: number): Promise<Loaded<T, P>[]>;
    /**
     * Registers global filter to this entity manager. Global filters are enabled by default (unless disabled via last parameter).
     */
    addFilter<T1 extends AnyEntity<T1>>(name: string, cond: FilterQuery<T1> | ((args: Dictionary) => FilterQuery<T1>), entityName?: EntityName<T1> | [EntityName<T1>], enabled?: boolean): void;
    /**
     * Registers global filter to this entity manager. Global filters are enabled by default (unless disabled via last parameter).
     */
    addFilter<T1 extends AnyEntity<T1>, T2 extends AnyEntity<T2>>(name: string, cond: FilterQuery<T1 | T2> | ((args: Dictionary) => FilterQuery<T1 | T2>), entityName?: [EntityName<T1>, EntityName<T2>], enabled?: boolean): void;
    /**
     * Registers global filter to this entity manager. Global filters are enabled by default (unless disabled via last parameter).
     */
    addFilter<T1 extends AnyEntity<T1>, T2 extends AnyEntity<T2>, T3 extends AnyEntity<T3>>(name: string, cond: FilterQuery<T1 | T2 | T3> | ((args: Dictionary) => FilterQuery<T1 | T2 | T3>), entityName?: [EntityName<T1>, EntityName<T2>, EntityName<T3>], enabled?: boolean): void;
    /**
     * Sets filter parameter values globally inside context defined by this entity manager.
     * If you want to set shared value for all contexts, be sure to use the root entity manager.
     */
    setFilterParams(name: string, args: Dictionary): void;
    /**
     * Returns filter parameters for given filter set in this context.
     */
    getFilterParams<T extends Dictionary = Dictionary>(name: string): T;
    protected processWhere<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options: FindOptions<T> | FindOneOptions<T>, type: 'read' | 'update' | 'delete'): Promise<FilterQuery<T>>;
    protected applyDiscriminatorCondition<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>): FilterQuery<T>;
    /**
     * @internal
     */
    applyFilters<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options: Dictionary<boolean | Dictionary> | string[] | boolean, type: 'read' | 'update' | 'delete'): Promise<FilterQuery<T>>;
    /**
     * Calls `em.find()` and `em.count()` with the same arguments (where applicable) and returns the results as tuple
     * where first element is the array of entities and the second is the count.
     */
    findAndCount<T extends AnyEntity<T>, P extends Populate<T> = any>(entityName: EntityName<T>, where: FilterQuery<T>, options?: FindOptions<T, P>): Promise<[Loaded<T, P>[], number]>;
    /**
     * Calls `em.find()` and `em.count()` with the same arguments (where applicable) and returns the results as tuple
     * where first element is the array of entities and the second is the count.
     */
    findAndCount<T extends AnyEntity<T>, P extends Populate<T> = any>(entityName: EntityName<T>, where: FilterQuery<T>, populate?: P, orderBy?: QueryOrderMap, limit?: number, offset?: number): Promise<[Loaded<T, P>[], number]>;
    /**
     * Finds first entity matching your `where` query.
     */
    findOne<T extends AnyEntity<T>, P extends Populate<T> = any>(entityName: EntityName<T>, where: FilterQuery<T>, options?: FindOneOptions<T, P>): Promise<Loaded<T, P> | null>;
    /**
     * Finds first entity matching your `where` query.
     */
    findOne<T extends AnyEntity<T>, P extends Populate<T> = any>(entityName: EntityName<T>, where: FilterQuery<T>, populate?: P, orderBy?: QueryOrderMap): Promise<Loaded<T, P> | null>;
    /**
     * Finds first entity matching your `where` query. If nothing found, it will throw an error.
     * You can override the factory for creating this method via `options.failHandler` locally
     * or via `Configuration.findOneOrFailHandler` globally.
     */
    findOneOrFail<T extends AnyEntity<T>, P extends Populate<T> = any>(entityName: EntityName<T>, where: FilterQuery<T>, options?: FindOneOrFailOptions<T, P>): Promise<Loaded<T, P>>;
    /**
     * Finds first entity matching your `where` query. If nothing found, it will throw an error.
     * You can override the factory for creating this method via `options.failHandler` locally
     * or via `Configuration.findOneOrFailHandler` globally.
     */
    findOneOrFail<T extends AnyEntity<T>, P extends Populate<T> = any>(entityName: EntityName<T>, where: FilterQuery<T>, populate?: P, orderBy?: QueryOrderMap): Promise<Loaded<T, P>>;
    /**
     * Runs your callback wrapped inside a database transaction.
     */
    transactional<T>(cb: (em: D[typeof EntityManagerType]) => Promise<T>, options?: {
        ctx?: Transaction;
        isolationLevel?: IsolationLevel;
    }): Promise<T>;
    /**
     * Starts new transaction bound to this EntityManager. Use `ctx` parameter to provide the parent when nesting transactions.
     */
    begin(options?: {
        ctx?: Transaction;
        isolationLevel?: IsolationLevel;
    }): Promise<void>;
    /**
     * Commits the transaction bound to this EntityManager. Flushes before doing the actual commit query.
     */
    commit(): Promise<void>;
    /**
     * Rollbacks the transaction bound to this EntityManager.
     */
    rollback(): Promise<void>;
    /**
     * Runs your callback wrapped inside a database transaction.
     */
    lock(entity: AnyEntity, lockMode: LockMode, options?: {
        lockVersion?: number | Date;
        lockTableAliases?: string[];
    } | number | Date): Promise<void>;
    /**
     * Fires native insert query. Calling this has no side effects on the context (identity map).
     */
    nativeInsert<T extends AnyEntity<T>>(entity: T): Promise<Primary<T>>;
    /**
     * Fires native insert query. Calling this has no side effects on the context (identity map).
     */
    nativeInsert<T extends AnyEntity<T>>(entityName: EntityName<T>, data: EntityData<T>): Promise<Primary<T>>;
    /**
     * Fires native update query. Calling this has no side effects on the context (identity map).
     */
    nativeUpdate<T extends AnyEntity<T>>(entityName: EntityName<T>, where: FilterQuery<T>, data: EntityData<T>, options?: UpdateOptions<T>): Promise<number>;
    /**
     * Fires native delete query. Calling this has no side effects on the context (identity map).
     */
    nativeDelete<T extends AnyEntity<T>>(entityName: EntityName<T>, where: FilterQuery<T>, options?: DeleteOptions<T>): Promise<number>;
    /**
     * Maps raw database result to an entity and merges it to this EntityManager.
     */
    map<T extends AnyEntity<T>>(entityName: EntityName<T>, result: EntityDictionary<T>): T;
    /**
     * Merges given entity to this EntityManager so it becomes managed. You can force refreshing of existing entities
     * via second parameter. By default it will return already loaded entities without modifying them.
     */
    merge<T extends AnyEntity<T>>(entity: T, refresh?: boolean): T;
    /**
     * Merges given entity to this EntityManager so it becomes managed. You can force refreshing of existing entities
     * via second parameter. By default it will return already loaded entities without modifying them.
     */
    merge<T extends AnyEntity<T>>(entityName: EntityName<T>, data: EntityData<T> | EntityDTO<T>, refresh?: boolean, convertCustomTypes?: boolean): T;
    /**
     * Creates new instance of given entity and populates it with given data
     */
    create<T extends AnyEntity<T>, P extends Populate<T> = any>(entityName: EntityName<T>, data: EntityData<T>, options?: {
        managed?: boolean;
    }): New<T, P>;
    /**
     * Shortcut for `wrap(entity).assign(data, { em })`
     */
    assign<T extends AnyEntity<T>>(entity: T, data: EntityData<T> | Partial<EntityDTO<T>>, options?: AssignOptions): T;
    /**
     * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
     */
    getReference<T extends AnyEntity<T>, PK extends keyof T>(entityName: EntityName<T>, id: Primary<T>, wrapped: true, convertCustomTypes?: boolean): IdentifiedReference<T, PK>;
    /**
     * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
     */
    getReference<T extends AnyEntity<T>>(entityName: EntityName<T>, id: Primary<T> | Primary<T>[]): T;
    /**
     * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
     */
    getReference<T extends AnyEntity<T>>(entityName: EntityName<T>, id: Primary<T>, wrapped: false, convertCustomTypes?: boolean): T;
    /**
     * Gets a reference to the entity identified by the given type and identifier without actually loading it, if the entity is not yet loaded
     */
    getReference<T extends AnyEntity<T>>(entityName: EntityName<T>, id: Primary<T>, wrapped?: boolean, convertCustomTypes?: boolean): T | Reference<T>;
    /**
     * Returns total number of entities matching your `where` query.
     */
    count<T extends AnyEntity<T>>(entityName: EntityName<T>, where?: FilterQuery<T>, options?: CountOptions<T>): Promise<number>;
    /**
     * Tells the EntityManager to make an instance managed and persistent.
     * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
     */
    persist(entity: AnyEntity | Reference<AnyEntity> | (AnyEntity | Reference<AnyEntity>)[]): this;
    /**
     * Persists your entity immediately, flushing all not yet persisted changes to the database too.
     * Equivalent to `em.persist(e).flush()`.
     */
    persistAndFlush(entity: AnyEntity | Reference<AnyEntity> | (AnyEntity | Reference<AnyEntity>)[]): Promise<void>;
    /**
     * Tells the EntityManager to make an instance managed and persistent.
     * The entity will be entered into the database at or before transaction commit or as a result of the flush operation.
     *
     * @deprecated use `persist()`
     */
    persistLater(entity: AnyEntity | AnyEntity[]): void;
    /**
     * Marks entity for removal.
     * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
     *
     * To remove entities by condition, use `em.nativeDelete()`.
     */
    remove<T extends AnyEntity<T>>(entity: T | Reference<T> | (T | Reference<T>)[]): this;
    /**
     * Removes an entity instance immediately, flushing all not yet persisted changes to the database too.
     * Equivalent to `em.remove(e).flush()`
     */
    removeAndFlush(entity: AnyEntity | Reference<AnyEntity>): Promise<void>;
    /**
     * Marks entity for removal.
     * A removed entity will be removed from the database at or before transaction commit or as a result of the flush operation.
     *
     * @deprecated use `remove()`
     */
    removeLater(entity: AnyEntity): void;
    /**
     * Flushes all changes to objects that have been queued up to now to the database.
     * This effectively synchronizes the in-memory state of managed objects with the database.
     */
    flush(): Promise<void>;
    /**
     * Clears the EntityManager. All entities that are currently managed by this EntityManager become detached.
     */
    clear(): void;
    /**
     * Checks whether given property can be populated on the entity.
     */
    canPopulate<T extends AnyEntity<T>>(entityName: EntityName<T>, property: string): boolean;
    /**
     * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
     */
    populate<T extends AnyEntity<T>, P extends string | keyof T | Populate<T>>(entities: T, populate: P, options?: EntityLoaderOptions<T>): Promise<Loaded<T, P>>;
    /**
     * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
     */
    populate<T extends AnyEntity<T>, P extends string | keyof T | Populate<T>>(entities: T[], populate: P, options?: EntityLoaderOptions<T>): Promise<Loaded<T, P>[]>;
    /**
     * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
     */
    populate<T extends AnyEntity<T>, P extends string | keyof T | Populate<T>>(entities: T | T[], populate: P, options?: EntityLoaderOptions<T>): Promise<Loaded<T, P> | Loaded<T, P>[]>;
    /**
     * Returns new EntityManager instance with its own identity map
     *
     * @param clear do we want clear identity map? defaults to true
     * @param useContext use request context? should be used only for top level request scope EM, defaults to false
     */
    fork(clear?: boolean, useContext?: boolean): D[typeof EntityManagerType];
    /**
     * Gets the UnitOfWork used by the EntityManager to coordinate operations.
     */
    getUnitOfWork(): UnitOfWork;
    /**
     * Gets the EntityFactory used by the EntityManager.
     */
    getEntityFactory(): EntityFactory;
    /**
     * Gets the EntityManager based on current transaction/request context.
     */
    getContext(): EntityManager;
    getEventManager(): EventManager;
    /**
     * Checks whether this EntityManager is currently operating inside a database transaction.
     */
    isInTransaction(): boolean;
    /**
     * Gets the transaction context (driver dependent object used to make sure queries are executed on same connection).
     */
    getTransactionContext<T extends Transaction = Transaction>(): T | undefined;
    /**
     * Sets the transaction context.
     */
    setTransactionContext(ctx: Transaction): void;
    /**
     * Resets the transaction context.
     */
    resetTransactionContext(): void;
    /**
     * Gets the MetadataStorage.
     */
    getMetadata(): MetadataStorage;
    /**
     * Gets the EntityComparator.
     */
    getComparator(): EntityComparator;
    private checkLockRequirements;
    private lockAndPopulate;
    private preparePopulate;
    private preparePopulateObject;
    /**
     * @internal
     */
    tryCache<T extends AnyEntity, R>(entityName: string, config: boolean | number | [string, number] | undefined, key: unknown, refresh?: boolean, merge?: boolean): Promise<{
        data?: R;
        key: string;
    } | undefined>;
    /**
     * @internal
     */
    storeCache(config: boolean | number | [string, number] | undefined, key: {
        key: string;
    }, data: unknown | (() => unknown)): Promise<void>;
    /**
     * @internal
     */
    [inspect.custom](): string;
}
