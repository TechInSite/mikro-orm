import { Collection, Db, MongoClient, MongoClientOptions, ClientSession } from 'mongodb';
import { Connection, ConnectionConfig, QueryResult, Transaction, QueryOrderMap, FilterQuery, AnyEntity, EntityName, EntityData, TransactionEventBroadcaster, IsolationLevel } from '@mikro-orm/core';
export declare class MongoConnection extends Connection {
    protected client: MongoClient;
    protected db: Db;
    connect(): Promise<void>;
    close(force?: boolean): Promise<void>;
    isConnected(): Promise<boolean>;
    getCollection(name: EntityName<AnyEntity>): Collection;
    createCollection(name: EntityName<AnyEntity>): Promise<Collection>;
    listCollections(): Promise<string[]>;
    dropCollection(name: EntityName<AnyEntity>): Promise<boolean>;
    getDefaultClientUrl(): string;
    getConnectionOptions(): MongoClientOptions & ConnectionConfig;
    getClientUrl(): string;
    getDb(): Db;
    execute(query: string): Promise<any>;
    find<T extends AnyEntity<T>>(collection: string, where: FilterQuery<T>, orderBy?: QueryOrderMap, limit?: number, offset?: number, fields?: string[], ctx?: Transaction<ClientSession>): Promise<EntityData<T>[]>;
    insertOne<T extends {
        _id: any;
    }>(collection: string, data: Partial<T>, ctx?: Transaction<ClientSession>): Promise<QueryResult>;
    insertMany<T extends {
        _id: any;
    }>(collection: string, data: Partial<T>[], ctx?: Transaction<ClientSession>): Promise<QueryResult>;
    updateMany<T extends {
        _id: any;
    }>(collection: string, where: FilterQuery<T>, data: Partial<T>, ctx?: Transaction<ClientSession>): Promise<QueryResult>;
    bulkUpdateMany<T extends {
        _id: any;
    }>(collection: string, where: FilterQuery<T>[], data: Partial<T>[], ctx?: Transaction<ClientSession>): Promise<QueryResult>;
    deleteMany<T extends {
        _id: any;
    }>(collection: string, where: FilterQuery<T>, ctx?: Transaction<ClientSession>): Promise<QueryResult>;
    aggregate(collection: string, pipeline: any[], ctx?: Transaction<ClientSession>): Promise<any[]>;
    countDocuments<T extends {
        _id: any;
    }>(collection: string, where: FilterQuery<T>, ctx?: Transaction<ClientSession>): Promise<number>;
    transactional<T>(cb: (trx: Transaction<ClientSession>) => Promise<T>, options?: {
        isolationLevel?: IsolationLevel;
        ctx?: Transaction<ClientSession>;
        eventBroadcaster?: TransactionEventBroadcaster;
    }): Promise<T>;
    begin(options?: {
        isolationLevel?: IsolationLevel;
        ctx?: ClientSession;
        eventBroadcaster?: TransactionEventBroadcaster;
    }): Promise<ClientSession>;
    commit(ctx: ClientSession, eventBroadcaster?: TransactionEventBroadcaster): Promise<void>;
    rollback(ctx: ClientSession, eventBroadcaster?: TransactionEventBroadcaster): Promise<void>;
    protected logQuery(query: string, took?: number): void;
    private runQuery;
    private transformResult;
    private getCollectionName;
    private logObject;
}
