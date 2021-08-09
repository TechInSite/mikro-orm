import { DatabaseSchema } from './DatabaseSchema';
import { SqlEntityManager } from '../SqlEntityManager';
export declare class SchemaGenerator {
    private readonly em;
    private readonly config;
    private readonly driver;
    private readonly metadata;
    private readonly platform;
    private readonly helper;
    private readonly connection;
    private readonly knex;
    constructor(em: SqlEntityManager);
    generate(): Promise<string>;
    createSchema(options?: {
        wrap?: boolean;
    }): Promise<void>;
    ensureDatabase(): Promise<void>;
    getTargetSchema(): DatabaseSchema;
    getCreateSchemaSQL(options?: {
        wrap?: boolean;
    }): Promise<string>;
    dropSchema(options?: {
        wrap?: boolean;
        dropMigrationsTable?: boolean;
        dropDb?: boolean;
    }): Promise<void>;
    getDropSchemaSQL(options?: {
        wrap?: boolean;
        dropMigrationsTable?: boolean;
    }): Promise<string>;
    updateSchema(options?: {
        wrap?: boolean;
        safe?: boolean;
        dropTables?: boolean;
        fromSchema?: DatabaseSchema;
    }): Promise<void>;
    getUpdateSchemaSQL(options?: {
        wrap?: boolean;
        safe?: boolean;
        dropTables?: boolean;
        fromSchema?: DatabaseSchema;
    }): Promise<string>;
    private createForeignKey;
    /**
     * We need to drop foreign keys first for all tables to allow dropping PK constraints.
     */
    private preAlterTable;
    private alterTable;
    /**
     * creates new database and connects to it
     */
    createDatabase(name: string): Promise<void>;
    dropDatabase(name: string): Promise<void>;
    execute(sql: string, options?: {
        wrap?: boolean;
    }): Promise<void>;
    private wrapSchema;
    private createTable;
    private createIndex;
    private dropIndex;
    private dropTable;
    private configureColumn;
    private createForeignKeys;
    private getOrderedMetadata;
    private dump;
}
