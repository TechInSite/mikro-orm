import { Configuration, MigrationsOptions, Transaction } from '@mikro-orm/core';
import { AbstractSqlDriver } from '@mikro-orm/knex';
import { Migration } from './Migration';
export declare class MigrationRunner {
    protected readonly driver: AbstractSqlDriver;
    protected readonly options: MigrationsOptions;
    protected readonly config: Configuration;
    private readonly connection;
    private readonly helper;
    private masterTransaction?;
    constructor(driver: AbstractSqlDriver, options: MigrationsOptions, config: Configuration);
    run(migration: Migration, method: 'up' | 'down'): Promise<void>;
    setMasterMigration(trx: Transaction): void;
    unsetMasterMigration(): void;
    private getQueries;
}
