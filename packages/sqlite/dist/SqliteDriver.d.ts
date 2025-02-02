import { AnyEntity, Configuration, EntityDictionary, QueryResult, Transaction } from '@mikro-orm/core';
import { AbstractSqlDriver, Knex } from '@mikro-orm/knex';
import { SqliteConnection } from './SqliteConnection';
export declare class SqliteDriver extends AbstractSqlDriver<SqliteConnection> {
    constructor(config: Configuration);
    nativeInsertMany<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>[], ctx?: Transaction<Knex.Transaction>, processCollections?: boolean): Promise<QueryResult>;
}
