import { AnyEntity, Configuration, EntityDictionary, QueryResult, Transaction } from '@mikro-orm/core';
import { AbstractSqlDriver, Knex } from '@mikro-orm/mysql-base';
import { MariaDbConnection } from './MariaDbConnection';
export declare class MariaDbDriver extends AbstractSqlDriver<MariaDbConnection> {
    constructor(config: Configuration);
    nativeInsertMany<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>[], ctx?: Transaction<Knex.Transaction>, processCollections?: boolean): Promise<QueryResult>;
}
