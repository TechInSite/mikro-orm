import { Configuration, Transaction } from '@mikro-orm/core';
import { AbstractSqlDriver, Knex } from '@mikro-orm/knex';
export declare type Query = string | Knex.QueryBuilder | Knex.Raw;
export declare abstract class Migration {
    protected readonly driver: AbstractSqlDriver;
    protected readonly config: Configuration;
    private readonly queries;
    protected ctx?: Transaction<Knex.Transaction>;
    constructor(driver: AbstractSqlDriver, config: Configuration);
    abstract up(): Promise<void>;
    down(): Promise<void>;
    isTransactional(): boolean;
    addSql(sql: Query): void;
    reset(): void;
    setTransactionContext(ctx: Transaction): void;
    execute(sql: Query): Promise<import("@mikro-orm/core").EntityData<import("@mikro-orm/core").AnyEntity<any>>[]>;
    getKnex(): Knex<any, unknown[]>;
    getQueries(): Query[];
}
