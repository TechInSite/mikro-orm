import { EntityManagerType, IDatabaseDriver } from './drivers';
import { MetadataStorage } from './metadata';
import { Configuration, Options } from './utils';
import { EntityManager } from './EntityManager';
import { AnyEntity, Constructor, IEntityGenerator, IMigrator, ISchemaGenerator, ISeedManager } from './typings';
/**
 * Helper class for bootstrapping the MikroORM.
 */
export declare class MikroORM<D extends IDatabaseDriver = IDatabaseDriver> {
    em: D[typeof EntityManagerType] & EntityManager;
    readonly config: Configuration<D>;
    private metadata;
    private readonly driver;
    private readonly logger;
    private readonly discovery;
    /**
     * Initialize the ORM, load entity metadata, create EntityManager and connect to the database.
     * If you omit the `options` parameter, your CLI config will be used.
     */
    static init<D extends IDatabaseDriver = IDatabaseDriver>(options?: Options<D> | Configuration<D>, connect?: boolean): Promise<MikroORM<D>>;
    constructor(options: Options<D> | Configuration<D>);
    /**
     * Connects to the database.
     */
    connect(): Promise<D>;
    /**
     * Checks whether the database connection is active.
     */
    isConnected(): Promise<boolean>;
    /**
     * Closes the database connection.
     */
    close(force?: boolean): Promise<void>;
    /**
     * Gets the MetadataStorage.
     */
    getMetadata(): MetadataStorage;
    discoverEntities(): Promise<void>;
    /**
     * Allows dynamically discovering new entity by reference, handy for testing schema diffing.
     */
    discoverEntity<T>(entities: Constructor<T> | Constructor<AnyEntity>[]): Promise<void>;
    /**
     * Gets the SchemaGenerator.
     */
    getSchemaGenerator<T extends ISchemaGenerator = ISchemaGenerator>(): T;
    /**
     * Gets the EntityGenerator.
     */
    getEntityGenerator<T extends IEntityGenerator = IEntityGenerator>(): T;
    /**
     * Gets the Migrator.
     */
    getMigrator<T extends IMigrator = IMigrator>(): T;
    getSeeder<T extends ISeedManager = ISeedManager>(): T;
}
