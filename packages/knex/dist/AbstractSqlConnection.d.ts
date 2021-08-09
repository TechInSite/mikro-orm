import { Knex } from 'knex';
import { AnyEntity, Configuration, Connection, ConnectionOptions, EntityData, IsolationLevel, QueryResult, Transaction, TransactionEventBroadcaster } from '@mikro-orm/core';
import { AbstractSqlPlatform } from './AbstractSqlPlatform';
export declare abstract class AbstractSqlConnection extends Connection {
    protected platform: AbstractSqlPlatform;
    protected client: Knex;
    constructor(config: Configuration, options?: ConnectionOptions, type?: 'read' | 'write');
    getKnex(): Knex;
    close(force?: boolean): Promise<void>;
    isConnected(): Promise<boolean>;
    transactional<T>(cb: (trx: Transaction<Knex.Transaction>) => Promise<T>, options?: {
        isolationLevel?: IsolationLevel;
        ctx?: Knex.Transaction;
        eventBroadcaster?: TransactionEventBroadcaster;
    }): Promise<T>;
    begin(options?: {
        isolationLevel?: IsolationLevel;
        ctx?: Knex.Transaction;
        eventBroadcaster?: TransactionEventBroadcaster;
    }): Promise<Knex.Transaction>;
    commit(ctx: Knex.Transaction, eventBroadcaster?: TransactionEventBroadcaster): Promise<void>;
    rollback(ctx: Knex.Transaction, eventBroadcaster?: TransactionEventBroadcaster): Promise<void>;
    execute<T extends QueryResult | EntityData<AnyEntity> | EntityData<AnyEntity>[] = EntityData<AnyEntity>[]>(queryOrKnex: string | Knex.QueryBuilder | Knex.Raw, params?: any[], method?: 'all' | 'get' | 'run', ctx?: Transaction): Promise<T>;
    /**
     * Execute raw SQL queries from file
     */
    loadFile(path: string): Promise<void>;
    protected logQuery(query: string, took?: number): void;
    protected createKnexClient(type: string): Knex;
    protected getKnexOptions(type: string): Knex.Config;
    private getSql;
    /**
     * do not call `positionBindings` when there are no bindings - it was messing up with
     * already interpolated strings containing `?`, and escaping that was not enough to
     * support edge cases like `\\?` strings (as `positionBindings` was removing the `\\`)
     */
    private patchKnexClient;
    protected abstract transformRawResult<T>(res: any, method: 'all' | 'get' | 'run'): T;
}
