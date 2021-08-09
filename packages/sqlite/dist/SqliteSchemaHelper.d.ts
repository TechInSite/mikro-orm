import { Connection, Dictionary } from '@mikro-orm/core';
import { AbstractSqlConnection, Index, SchemaHelper } from '@mikro-orm/knex';
export declare class SqliteSchemaHelper extends SchemaHelper {
    getSchemaBeginning(charset: string): string;
    getSchemaEnd(): string;
    supportsSchemaConstraints(): boolean;
    getListTablesSQL(): string;
    getColumns(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<any[]>;
    getPrimaryKeys(connection: AbstractSqlConnection, indexes: Dictionary, tableName: string, schemaName?: string): Promise<string[]>;
    getIndexes(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Index[]>;
    getForeignKeysSQL(tableName: string): string;
    mapForeignKeys(fks: any[], tableName: string): Dictionary;
    databaseExists(connection: Connection, name: string): Promise<boolean>;
    /**
     * Implicit indexes will be ignored when diffing
     */
    isImplicitIndex(name: string): boolean;
}
