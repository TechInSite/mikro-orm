import { Constructor } from '@mikro-orm/core';
import { DatabaseSchema, EntityManager } from '@mikro-orm/knex';
import { Migration } from './Migration';
import { MigrationStorage } from './MigrationStorage';
import { MigrateOptions, MigrationResult, MigrationRow, UmzugMigration } from './typings';
export declare class Migrator {
    private readonly em;
    private readonly umzug;
    private readonly driver;
    private readonly schemaGenerator;
    private readonly config;
    private readonly options;
    private readonly runner;
    private readonly generator;
    private readonly storage;
    private readonly absolutePath;
    private readonly snapshotPath;
    constructor(em: EntityManager);
    createMigration(path?: string, blank?: boolean, initial?: boolean): Promise<MigrationResult>;
    createInitialMigration(path?: string): Promise<MigrationResult>;
    /**
     * Initial migration can be created only if:
     * 1. no previous migrations were generated or executed
     * 2. existing schema do not contain any of the tables defined by metadata
     *
     * If existing schema contains all of the tables already, we return true, based on that we mark the migration as already executed.
     * If only some of the tables are present, exception is thrown.
     */
    private validateInitialMigration;
    getExecutedMigrations(): Promise<MigrationRow[]>;
    getPendingMigrations(): Promise<UmzugMigration[]>;
    up(options?: string | string[] | MigrateOptions): Promise<UmzugMigration[]>;
    down(options?: string | string[] | MigrateOptions): Promise<UmzugMigration[]>;
    getStorage(): MigrationStorage;
    protected resolve(file: string): {
        name: string | undefined;
        up: () => Promise<void>;
        down: () => Promise<void>;
    };
    protected getCurrentSchema(): Promise<DatabaseSchema>;
    protected storeCurrentSchema(): Promise<void>;
    protected initialize(MigrationClass: Constructor<Migration>, name?: string): {
        name: string | undefined;
        up: () => Promise<void>;
        down: () => Promise<void>;
    };
    private getSchemaDiff;
    private prefix;
    private runMigrations;
    private runInTransaction;
    private ensureMigrationsDirExists;
}
