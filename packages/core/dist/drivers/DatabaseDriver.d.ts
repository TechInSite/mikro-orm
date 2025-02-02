import { CountOptions, EntityManagerType, FindOneOptions, FindOptions, IDatabaseDriver } from './IDatabaseDriver';
import { AnyEntity, Dictionary, EntityData, EntityDictionary, EntityMetadata, EntityProperty, FilterQuery, PopulateOptions, Primary } from '../typings';
import { MetadataStorage } from '../metadata';
import { Connection, QueryResult, Transaction } from '../connections';
import { Configuration, ConnectionOptions, EntityComparator } from '../utils';
import { LockMode, QueryOrderMap } from '../enums';
import { Platform } from '../platforms';
import { Collection } from '../entity';
import { EntityManager } from '../EntityManager';
import { DriverException } from '../exceptions';
export declare abstract class DatabaseDriver<C extends Connection> implements IDatabaseDriver<C> {
    protected readonly config: Configuration;
    protected readonly dependencies: string[];
    [EntityManagerType]: EntityManager<this>;
    protected readonly connection: C;
    protected readonly replicas: C[];
    protected readonly platform: Platform;
    protected readonly logger: import("../utils").Logger;
    protected comparator: EntityComparator;
    protected metadata: MetadataStorage;
    protected constructor(config: Configuration, dependencies: string[]);
    abstract find<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options?: FindOptions<T>, ctx?: Transaction): Promise<EntityData<T>[]>;
    abstract findOne<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options?: FindOneOptions<T>, ctx?: Transaction): Promise<EntityData<T> | null>;
    abstract nativeInsert<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>, ctx?: Transaction, convertCustomTypes?: boolean): Promise<QueryResult>;
    abstract nativeInsertMany<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>[], ctx?: Transaction, processCollections?: boolean, convertCustomTypes?: boolean): Promise<QueryResult>;
    abstract nativeUpdate<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, data: EntityDictionary<T>, ctx?: Transaction, convertCustomTypes?: boolean): Promise<QueryResult>;
    nativeUpdateMany<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>[], data: EntityDictionary<T>[], ctx?: Transaction, processCollections?: boolean, convertCustomTypes?: boolean): Promise<QueryResult>;
    abstract nativeDelete<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, ctx?: Transaction): Promise<QueryResult>;
    abstract count<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options?: CountOptions<T>, ctx?: Transaction): Promise<number>;
    createEntityManager<D extends IDatabaseDriver = IDatabaseDriver>(useContext?: boolean): D[typeof EntityManagerType];
    aggregate(entityName: string, pipeline: any[]): Promise<any[]>;
    loadFromPivotTable<T extends AnyEntity<T>, O extends AnyEntity<O>>(prop: EntityProperty, owners: Primary<O>[][], where?: FilterQuery<T>, orderBy?: QueryOrderMap, ctx?: Transaction, options?: FindOptions<T>): Promise<Dictionary<T[]>>;
    syncCollection<T extends AnyEntity<T>, O extends AnyEntity<O>>(coll: Collection<T, O>, ctx?: Transaction): Promise<void>;
    clearCollection<T extends AnyEntity<T>, O extends AnyEntity<O>>(coll: Collection<T, O>, ctx?: Transaction): Promise<void>;
    mapResult<T extends AnyEntity<T>>(result: EntityDictionary<T>, meta: EntityMetadata<T>, populate?: PopulateOptions<T>[]): EntityData<T> | null;
    connect(): Promise<C>;
    reconnect(): Promise<C>;
    getConnection(type?: 'read' | 'write'): C;
    close(force?: boolean): Promise<void>;
    getPlatform(): Platform;
    setMetadata(metadata: MetadataStorage): void;
    getDependencies(): string[];
    ensureIndexes(): Promise<void>;
    protected inlineEmbeddables<T>(meta: EntityMetadata<T>, data: T, where?: boolean): void;
    protected getPivotOrderBy(prop: EntityProperty, orderBy?: QueryOrderMap): QueryOrderMap;
    protected getPrimaryKeyFields(entityName: string): string[];
    protected getPivotInverseProperty(prop: EntityProperty): EntityProperty;
    protected createReplicas(cb: (c: ConnectionOptions) => C): C[];
    lockPessimistic<T extends AnyEntity<T>>(entity: T, mode: LockMode, tables?: string[], ctx?: Transaction): Promise<void>;
    /**
     * @internal
     */
    shouldHaveColumn<T extends AnyEntity<T>>(prop: EntityProperty<T>, populate: PopulateOptions<T>[], includeFormulas?: boolean): boolean;
    /**
     * @inheritDoc
     */
    convertException(exception: Error): DriverException;
    protected rethrow<T>(promise: Promise<T>): Promise<T>;
}
