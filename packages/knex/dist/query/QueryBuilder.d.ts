import { Knex } from 'knex';
import { AnyEntity, Dictionary, EntityData, EntityProperty, GroupOperator, LockMode, MetadataStorage, PopulateOptions, QBFilterQuery, QueryFlag, QueryOrderMap } from '@mikro-orm/core';
import { QueryType } from './enums';
import { AbstractSqlDriver } from '../AbstractSqlDriver';
import { SqlEntityManager } from '../SqlEntityManager';
import { Field } from '../typings';
/**
 * SQL query builder with fluent interface.
 *
 * ```ts
 * const qb = orm.em.createQueryBuilder(Publisher);
 * qb.select('*')
 *   .where({
 *     name: 'test 123',
 *     type: PublisherType.GLOBAL,
 *   })
 *   .orderBy({
 *     name: QueryOrder.DESC,
 *     type: QueryOrder.ASC,
 *   })
 *   .limit(2, 1);
 *
 * const publisher = await qb.getSingleResult();
 * ```
 */
export declare class QueryBuilder<T extends AnyEntity<T> = AnyEntity> {
    private readonly entityName;
    private readonly metadata;
    private readonly driver;
    private readonly context?;
    readonly alias: string;
    private connectionType?;
    private readonly em?;
    /** @internal */
    type: QueryType;
    /** @internal */
    _fields?: Field<T>[];
    /** @internal */
    _populate: PopulateOptions<T>[];
    /** @internal */
    _populateMap: Dictionary<string>;
    private aliasCounter;
    private flags;
    private finalized;
    private _joins;
    private _aliasMap;
    private _schema?;
    private _cond;
    private _data;
    private _orderBy;
    private _groupBy;
    private _having;
    private _onConflict?;
    private _limit?;
    private _offset?;
    private _joinedProps;
    private _cache?;
    private _indexHint?;
    private lockMode?;
    private lockTables?;
    private subQueries;
    private readonly platform;
    private readonly knex;
    private readonly helper;
    /**
     * @internal
     */
    constructor(entityName: string, metadata: MetadataStorage, driver: AbstractSqlDriver, context?: Knex.Transaction<any, any[]> | undefined, alias?: string, connectionType?: "write" | "read" | undefined, em?: SqlEntityManager<AbstractSqlDriver<import("..").AbstractSqlConnection>> | undefined);
    select(fields: Field<T> | Field<T>[], distinct?: boolean): this;
    addSelect(fields: Field<T> | Field<T>[]): this;
    insert(data: EntityData<T> | EntityData<T>[]): this;
    update(data: EntityData<T>): this;
    delete(cond?: QBFilterQuery): this;
    truncate(): this;
    count(field?: string | string[], distinct?: boolean): this;
    join(field: string, alias: string, cond?: QBFilterQuery, type?: 'leftJoin' | 'innerJoin' | 'pivotJoin', path?: string): this;
    leftJoin(field: string, alias: string, cond?: QBFilterQuery): this;
    joinAndSelect(field: string, alias: string, cond?: QBFilterQuery, type?: 'leftJoin' | 'innerJoin' | 'pivotJoin', path?: string): this;
    leftJoinAndSelect(field: string, alias: string, cond?: QBFilterQuery): this;
    protected getFieldsForJoinedLoad<U extends AnyEntity<U>>(prop: EntityProperty<U>, alias: string): Field<U>[];
    withSubQuery(subQuery: Knex.QueryBuilder, alias: string): this;
    where(cond: QBFilterQuery<T>, operator?: keyof typeof GroupOperator): this;
    where(cond: string, params?: any[], operator?: keyof typeof GroupOperator): this;
    andWhere(cond: QBFilterQuery<T>): this;
    andWhere(cond: string, params?: any[]): this;
    orWhere(cond: QBFilterQuery<T>): this;
    orWhere(cond: string, params?: any[]): this;
    orderBy(orderBy: QueryOrderMap): this;
    groupBy(fields: (string | keyof T) | (string | keyof T)[]): this;
    having(cond?: QBFilterQuery | string, params?: any[]): this;
    onConflict(fields?: string | string[]): this;
    ignore(): this;
    merge(data?: EntityData<T> | Field<T>[]): this;
    /**
     * @internal
     */
    populate(populate: PopulateOptions<T>[]): this;
    /**
     * @internal
     */
    ref(field: string): Knex.Ref<string, {
        [x: string]: string;
    }>;
    raw<R = Knex.Raw>(sql: string, bindings?: Knex.RawBinding[] | Knex.ValueDict): R;
    limit(limit?: number, offset?: number): this;
    offset(offset?: number): this;
    withSchema(schema?: string): this;
    setLockMode(mode?: LockMode, tables?: string[]): this;
    setFlag(flag: QueryFlag): this;
    unsetFlag(flag: QueryFlag): this;
    cache(config?: boolean | number | [string, number]): this;
    /**
     * Adds index hint to the FROM clause.
     */
    indexHint(sql: string): this;
    getKnexQuery(): Knex.QueryBuilder;
    /**
     * Returns the query with parameters as wildcards.
     */
    getQuery(): string;
    /**
     * Returns the list of all parameters for this query.
     */
    getParams(): readonly Knex.Value[];
    /**
     * Returns raw interpolated query string with all the parameters inlined.
     */
    getFormattedQuery(): string;
    getAliasForJoinPath(path?: string): string | undefined;
    getNextAlias(prefix?: string): string;
    /**
     * Executes this QB and returns the raw results, mapped to the property names (unless disabled via last parameter).
     * Use `method` to specify what kind of result you want to get (array/single/meta).
     */
    execute<U = any>(method?: 'all' | 'get' | 'run', mapResults?: boolean): Promise<U>;
    /**
     * Alias for `qb.getResultList()`
     */
    getResult(): Promise<T[]>;
    /**
     * Executes the query, returning array of results
     */
    getResultList(): Promise<T[]>;
    /**
     * Executes the query, returning the first result or null
     */
    getSingleResult(): Promise<T | null>;
    /**
     * Returns knex instance with sub-query aliased with given alias.
     * You can provide `EntityName.propName` as alias, then the field name will be used based on the metadata
     */
    as(alias: string): Knex.QueryBuilder;
    clone(): QueryBuilder<T>;
    getKnex(): Knex.QueryBuilder;
    private joinReference;
    private prepareFields;
    private init;
    private getQueryBase;
    private finalize;
    private wrapPaginateSubQuery;
    private wrapModifySubQuery;
    private autoJoinPivotTable;
}
