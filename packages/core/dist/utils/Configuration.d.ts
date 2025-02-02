import { NamingStrategy } from '../naming-strategy';
import { CacheAdapter, FileCacheAdapter } from '../cache';
import { EntityRepository } from '../entity';
import { AnyEntity, Constructor, Dictionary, EntityClass, EntityClassGroup, FilterDef, Highlighter, HydratorConstructor, IHydrator, IPrimaryKey, MaybePromise, MigrationObject } from '../typings';
import { ObjectHydrator } from '../hydration';
import { NullHighlighter } from '../utils/NullHighlighter';
import { Logger, LoggerNamespace } from '../utils/Logger';
import { EntityManager } from '../EntityManager';
import { EntitySchema } from '../metadata/EntitySchema';
import { MetadataProvider } from '../metadata/MetadataProvider';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { ReflectMetadataProvider } from '../metadata/ReflectMetadataProvider';
import { EventSubscriber } from '../events';
import { IDatabaseDriver } from '../drivers/IDatabaseDriver';
import { EntityOptions } from '../decorators';
import { NotFoundError } from '../errors';
import { LoadStrategy } from '../enums';
import { MemoryCacheAdapter } from '../cache/MemoryCacheAdapter';
export declare class Configuration<D extends IDatabaseDriver = IDatabaseDriver> {
    static readonly DEFAULTS: {
        pool: {};
        entities: never[];
        entitiesTs: never[];
        subscribers: never[];
        filters: {};
        discovery: {
            warnWhenNoEntities: boolean;
            requireEntitiesArray: boolean;
            alwaysAnalyseProperties: boolean;
            disableDynamicFileAccess: boolean;
        };
        strict: boolean;
        validate: boolean;
        context: (name: string) => EntityManager<IDatabaseDriver<import("..").Connection>> | undefined;
        contextName: string;
        logger: {
            (...data: any[]): void;
            (message?: any, ...optionalParams: any[]): void;
        };
        findOneOrFailHandler: (entityName: string, where: Dictionary | IPrimaryKey) => NotFoundError<AnyEntity<any>>;
        baseDir: string;
        hydrator: typeof ObjectHydrator;
        loadStrategy: LoadStrategy;
        autoJoinOneToOneOwner: boolean;
        propagateToOneOwner: boolean;
        populateAfterFlush: boolean;
        forceEntityConstructor: boolean;
        forceUndefined: boolean;
        forceUtcTimezone: boolean;
        ensureIndexes: boolean;
        batchSize: number;
        debug: boolean;
        verbose: boolean;
        driverOptions: {};
        migrations: {
            tableName: string;
            path: string;
            pattern: RegExp;
            transactional: boolean;
            disableForeignKeys: boolean;
            allOrNothing: boolean;
            dropTables: boolean;
            safe: boolean;
            snapshot: boolean;
            emit: string;
            fileName: (timestamp: string) => string;
        };
        cache: {
            pretty: boolean;
            adapter: typeof FileCacheAdapter;
            options: {
                cacheDir: string;
            };
        };
        resultCache: {
            adapter: typeof MemoryCacheAdapter;
            expiration: number;
            options: {};
        };
        metadataProvider: typeof ReflectMetadataProvider;
        highlighter: NullHighlighter;
        seeder: {
            path: string;
            defaultSeeder: string;
        };
    };
    static readonly PLATFORMS: {
        mongo: {
            className: string;
            module: () => any;
        };
        mysql: {
            className: string;
            module: () => any;
        };
        mariadb: {
            className: string;
            module: () => any;
        };
        postgresql: {
            className: string;
            module: () => any;
        };
        sqlite: {
            className: string;
            module: () => any;
        };
    };
    private readonly options;
    private readonly logger;
    private readonly driver;
    private readonly platform;
    private readonly cache;
    constructor(options: Options, validate?: boolean);
    /**
     * Gets specific configuration option. Falls back to specified `defaultValue` if provided.
     */
    get<T extends keyof MikroORMOptions<D>, U extends MikroORMOptions<D>[T]>(key: T, defaultValue?: U): U;
    getAll(): MikroORMOptions<D>;
    /**
     * Overrides specified configuration value.
     */
    set<T extends keyof MikroORMOptions<D>, U extends MikroORMOptions<D>[T]>(key: T, value: U): void;
    /**
     * Resets the configuration to its default value
     */
    reset<T extends keyof MikroORMOptions<D>, U extends MikroORMOptions<D>[T]>(key: T): void;
    /**
     * Gets Logger instance.
     */
    getLogger(): Logger;
    /**
     * Gets current client URL (connection string).
     */
    getClientUrl(hidePassword?: boolean): string;
    /**
     * Gets current database driver instance.
     */
    getDriver(): D;
    /**
     * Gets instance of NamingStrategy. (cached)
     */
    getNamingStrategy(): NamingStrategy;
    /**
     * Gets instance of Hydrator.
     */
    getHydrator(metadata: MetadataStorage): IHydrator;
    /**
     * Gets instance of MetadataProvider. (cached)
     */
    getMetadataProvider(): MetadataProvider;
    /**
     * Gets instance of CacheAdapter. (cached)
     */
    getCacheAdapter(): CacheAdapter;
    /**
     * Gets instance of CacheAdapter for result cache. (cached)
     */
    getResultCacheAdapter(): CacheAdapter;
    /**
     * Gets EntityRepository class to be instantiated.
     */
    getRepositoryClass(customRepository: EntityOptions<any>['customRepository']): MikroORMOptions<D>['entityRepository'];
    private init;
    private validateOptions;
    private initDriver;
    private cached;
}
export interface DynamicPassword {
    password: string;
    expirationChecker?: () => boolean;
}
export interface ConnectionOptions {
    dbName?: string;
    schema?: string;
    name?: string;
    clientUrl?: string;
    host?: string;
    port?: number;
    user?: string;
    password?: string | (() => MaybePromise<string> | MaybePromise<DynamicPassword>);
    charset?: string;
    collate?: string;
    multipleStatements?: boolean;
    pool?: PoolConfig;
}
export declare type MigrationsOptions = {
    tableName?: string;
    path?: string;
    pattern?: RegExp;
    transactional?: boolean;
    disableForeignKeys?: boolean;
    allOrNothing?: boolean;
    dropTables?: boolean;
    safe?: boolean;
    snapshot?: boolean;
    emit?: 'js' | 'ts';
    fileName?: (timestamp: string) => string;
    migrationsList?: MigrationObject[];
};
export interface PoolConfig {
    name?: string;
    afterCreate?: (...a: unknown[]) => unknown;
    min?: number;
    max?: number;
    refreshIdle?: boolean;
    idleTimeoutMillis?: number;
    reapIntervalMillis?: number;
    returnToHead?: boolean;
    priorityRange?: number;
    log?: (message: string, logLevel: string) => void;
    maxWaitingClients?: number;
    testOnBorrow?: boolean;
    acquireTimeoutMillis?: number;
    fifo?: boolean;
    autostart?: boolean;
    evictionRunIntervalMillis?: number;
    numTestsPerRun?: number;
    softIdleTimeoutMillis?: number;
    Promise?: any;
}
export interface MikroORMOptions<D extends IDatabaseDriver = IDatabaseDriver> extends ConnectionOptions {
    entities: (string | EntityClass<AnyEntity> | EntityClassGroup<AnyEntity> | EntitySchema<any>)[];
    entitiesTs: (string | EntityClass<AnyEntity> | EntityClassGroup<AnyEntity> | EntitySchema<any>)[];
    subscribers: EventSubscriber[];
    filters: Dictionary<{
        name?: string;
    } & Omit<FilterDef<AnyEntity>, 'name'>>;
    discovery: {
        warnWhenNoEntities?: boolean;
        requireEntitiesArray?: boolean;
        alwaysAnalyseProperties?: boolean;
        disableDynamicFileAccess?: boolean;
    };
    type?: keyof typeof Configuration.PLATFORMS;
    driver?: {
        new (config: Configuration): D;
    };
    driverOptions: Dictionary;
    namingStrategy?: {
        new (): NamingStrategy;
    };
    implicitTransactions?: boolean;
    autoJoinOneToOneOwner: boolean;
    propagateToOneOwner: boolean;
    populateAfterFlush: boolean;
    forceEntityConstructor: boolean | (Constructor<AnyEntity> | string)[];
    forceUndefined: boolean;
    forceUtcTimezone: boolean;
    timezone?: string;
    ensureIndexes: boolean;
    useBatchInserts?: boolean;
    useBatchUpdates?: boolean;
    batchSize: number;
    hydrator: HydratorConstructor;
    loadStrategy: LoadStrategy;
    entityRepository?: Constructor<EntityRepository<any>>;
    replicas?: Partial<ConnectionOptions>[];
    strict: boolean;
    validate: boolean;
    context: (name: string) => EntityManager | undefined;
    contextName: string;
    logger: (message: string) => void;
    findOneOrFailHandler: (entityName: string, where: Dictionary | IPrimaryKey) => Error;
    debug: boolean | LoggerNamespace[];
    highlighter: Highlighter;
    tsNode?: boolean;
    baseDir: string;
    migrations: MigrationsOptions;
    cache: {
        enabled?: boolean;
        pretty?: boolean;
        adapter?: {
            new (...params: any[]): CacheAdapter;
        };
        options?: Dictionary;
    };
    resultCache: {
        expiration?: number;
        adapter?: {
            new (...params: any[]): CacheAdapter;
        };
        options?: Dictionary;
    };
    metadataProvider: {
        new (config: Configuration): MetadataProvider;
    };
    seeder: {
        path: string;
        defaultSeeder: string;
    };
}
export declare type Options<D extends IDatabaseDriver = IDatabaseDriver> = Pick<MikroORMOptions<D>, Exclude<keyof MikroORMOptions<D>, keyof typeof Configuration.DEFAULTS>> & Partial<MikroORMOptions<D>>;
