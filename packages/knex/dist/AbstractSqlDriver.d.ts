import { Knex } from 'knex';
import { AnyEntity, Collection, Configuration, Constructor, DatabaseDriver, Dictionary, EntityData, EntityManagerType, EntityMetadata, EntityProperty, FilterQuery, FindOneOptions, FindOptions, IDatabaseDriver, LockMode, Primary, QueryOrderMap, QueryResult, Transaction, PopulateOptions, CountOptions, FieldsMap, EntityDictionary } from '@mikro-orm/core';
import { AbstractSqlConnection } from './AbstractSqlConnection';
import { AbstractSqlPlatform } from './AbstractSqlPlatform';
import { QueryBuilder } from './query/QueryBuilder';
import { SqlEntityManager } from './SqlEntityManager';
import { Field } from './typings';
export declare abstract class AbstractSqlDriver<C extends AbstractSqlConnection = AbstractSqlConnection> extends DatabaseDriver<C> {
    [EntityManagerType]: SqlEntityManager<this>;
    protected readonly connection: C;
    protected readonly replicas: C[];
    protected readonly platform: AbstractSqlPlatform;
    protected constructor(config: Configuration, platform: AbstractSqlPlatform, connection: Constructor<C>, connector: string[]);
    getPlatform(): AbstractSqlPlatform;
    createEntityManager<D extends IDatabaseDriver = IDatabaseDriver>(useContext?: boolean): D[typeof EntityManagerType];
    find<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options?: FindOptions<T>, ctx?: Transaction<Knex.Transaction>): Promise<EntityData<T>[]>;
    findOne<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options?: FindOneOptions<T>, ctx?: Transaction<Knex.Transaction>): Promise<EntityData<T> | null>;
    mapResult<T extends AnyEntity<T>>(result: EntityData<T>, meta: EntityMetadata<T>, populate?: PopulateOptions<T>[], qb?: QueryBuilder<T>, map?: Dictionary): EntityData<T> | null;
    private mapJoinedProps;
    private appendToCollection;
    count<T extends AnyEntity<T>>(entityName: string, where: any, options?: CountOptions<T>, ctx?: Transaction<Knex.Transaction>): Promise<number>;
    nativeInsert<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>, ctx?: Transaction<Knex.Transaction>, convertCustomTypes?: boolean): Promise<QueryResult>;
    nativeInsertMany<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>[], ctx?: Transaction<Knex.Transaction>, processCollections?: boolean, convertCustomTypes?: boolean): Promise<QueryResult>;
    nativeUpdate<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, data: EntityDictionary<T>, ctx?: Transaction<Knex.Transaction>, convertCustomTypes?: boolean): Promise<QueryResult>;
    nativeUpdateMany<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>[], data: EntityDictionary<T>[], ctx?: Transaction<Knex.Transaction>, processCollections?: boolean, convertCustomTypes?: boolean): Promise<QueryResult>;
    nativeDelete<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T> | string | any, ctx?: Transaction<Knex.Transaction>): Promise<QueryResult>;
    syncCollection<T extends AnyEntity<T>, O extends AnyEntity<O>>(coll: Collection<T, O>, ctx?: Transaction): Promise<void>;
    loadFromPivotTable<T extends AnyEntity<T>, O extends AnyEntity<O>>(prop: EntityProperty, owners: Primary<O>[][], where?: FilterQuery<T>, orderBy?: QueryOrderMap, ctx?: Transaction, options?: FindOptions<T>): Promise<Dictionary<T[]>>;
    execute<T extends QueryResult | EntityData<AnyEntity> | EntityData<AnyEntity>[] = EntityData<AnyEntity>[]>(queryOrKnex: string | Knex.QueryBuilder | Knex.Raw, params?: any[], method?: 'all' | 'get' | 'run', ctx?: Transaction): Promise<T>;
    /**
     * 1:1 owner side needs to be marked for population so QB auto-joins the owner id
     */
    protected autoJoinOneToOneOwner<T>(meta: EntityMetadata, populate: PopulateOptions<T>[], fields?: (string | FieldsMap)[]): PopulateOptions<T>[];
    protected joinedProps<T>(meta: EntityMetadata, populate: PopulateOptions<T>[]): PopulateOptions<T>[];
    /**
     * @internal
     */
    mergeJoinedResult<T extends AnyEntity<T>>(rawResults: EntityData<T>[], meta: EntityMetadata<T>): EntityData<T>[];
    protected getFieldsForJoinedLoad<T extends AnyEntity<T>>(qb: QueryBuilder<T>, meta: EntityMetadata<T>, explicitFields?: Field<T>[], populate?: PopulateOptions<T>[], parentTableAlias?: string, parentJoinPath?: string): Field<T>[];
    /**
     * @internal
     */
    mapPropToFieldNames<T extends AnyEntity<T>>(qb: QueryBuilder<T>, prop: EntityProperty<T>, tableAlias?: string): Field<T>[];
    protected createQueryBuilder<T extends AnyEntity<T>>(entityName: string, ctx?: Transaction<Knex.Transaction>, write?: boolean, convertCustomTypes?: boolean): QueryBuilder<T>;
    protected extractManyToMany<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>): EntityData<T>;
    protected processManyToMany<T extends AnyEntity<T>>(meta: EntityMetadata<T> | undefined, pks: Primary<T>[], collections: EntityData<T>, clear: boolean, ctx?: Transaction<Knex.Transaction>): Promise<void>;
    protected updateCollectionDiff<T extends AnyEntity<T>, O extends AnyEntity<O>>(meta: EntityMetadata<O>, prop: EntityProperty<T>, pks: Primary<O>[], deleteDiff: Primary<T>[][] | boolean, insertDiff: Primary<T>[][], ctx?: Transaction): Promise<void>;
    lockPessimistic<T extends AnyEntity<T>>(entity: T, mode: LockMode, tables?: string[], ctx?: Transaction): Promise<void>;
    protected buildJoinedPropsOrderBy<T extends AnyEntity<T>>(entityName: string, qb: QueryBuilder<T>, meta: EntityMetadata<T>, populate: PopulateOptions<T>[], parentPath?: string): QueryOrderMap;
    protected buildFields<T extends AnyEntity<T>>(meta: EntityMetadata<T>, populate: PopulateOptions<T>[], joinedProps: PopulateOptions<T>[], qb: QueryBuilder<T>, fields?: Field<T>[]): Field<T>[];
}
