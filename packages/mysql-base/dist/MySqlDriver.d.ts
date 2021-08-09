import { AnyEntity, Configuration, EntityDictionary, QueryResult, Transaction } from '@mikro-orm/core';
import { AbstractSqlDriver, Knex } from '@mikro-orm/knex';
import { MySqlConnection } from './MySqlConnection';
export declare class MySqlDriver extends AbstractSqlDriver<MySqlConnection> {
    constructor(config: Configuration);
    nativeInsertMany<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>[], ctx?: Transaction<Knex.Transaction>, processCollections?: boolean): Promise<QueryResult>;
}
