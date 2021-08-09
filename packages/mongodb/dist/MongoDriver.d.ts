import { ClientSession } from 'mongodb';
import { DatabaseDriver, EntityData, AnyEntity, FilterQuery, EntityProperty, Configuration, FindOneOptions, FindOptions, QueryResult, Transaction, IDatabaseDriver, EntityManagerType, PopulateOptions, CountOptions, FieldsMap, EntityDictionary } from '@mikro-orm/core';
import { MongoConnection } from './MongoConnection';
import { MongoPlatform } from './MongoPlatform';
import { MongoEntityManager } from './MongoEntityManager';
export declare class MongoDriver extends DatabaseDriver<MongoConnection> {
    [EntityManagerType]: MongoEntityManager<this>;
    protected readonly connection: MongoConnection;
    protected readonly platform: MongoPlatform;
    constructor(config: Configuration);
    createEntityManager<D extends IDatabaseDriver = IDatabaseDriver>(useContext?: boolean): D[typeof EntityManagerType];
    find<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options?: FindOptions<T>, ctx?: Transaction<ClientSession>): Promise<EntityData<T>[]>;
    findOne<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options?: FindOneOptions<T>, ctx?: Transaction<ClientSession>): Promise<EntityData<T> | null>;
    count<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, options?: CountOptions<T>, ctx?: Transaction<ClientSession>): Promise<number>;
    nativeInsert<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>, ctx?: Transaction<ClientSession>): Promise<QueryResult>;
    nativeInsertMany<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>[], ctx?: Transaction<ClientSession>, processCollections?: boolean): Promise<QueryResult>;
    nativeUpdate<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, data: EntityDictionary<T>, ctx?: Transaction<ClientSession>): Promise<QueryResult>;
    nativeUpdateMany<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>[], data: EntityDictionary<T>[], ctx?: Transaction<ClientSession>, processCollections?: boolean): Promise<QueryResult>;
    nativeDelete<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, ctx?: Transaction<ClientSession>): Promise<QueryResult>;
    aggregate(entityName: string, pipeline: any[], ctx?: Transaction<ClientSession>): Promise<any[]>;
    createCollections(): Promise<void>;
    dropCollections(): Promise<void>;
    ensureIndexes(): Promise<void>;
    private createIndexes;
    private createUniqueIndexes;
    private createPropertyIndexes;
    private renameFields;
    private convertObjectIds;
    private buildFilterById;
    protected buildFields<T extends AnyEntity<T>>(entityName: string, populate: PopulateOptions<T>[], fields?: (string | FieldsMap)[]): string[] | undefined;
    shouldHaveColumn<T>(prop: EntityProperty<T>, populate: PopulateOptions<T>[]): boolean;
}
