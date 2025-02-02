import { Knex } from 'knex';
import { Connection, Dictionary } from '@mikro-orm/core';
import { AbstractSqlConnection } from '../AbstractSqlConnection';
import { AbstractSqlPlatform } from '../AbstractSqlPlatform';
import { Column, Index, TableDifference } from '../typings';
import { DatabaseTable } from './DatabaseTable';
export declare abstract class SchemaHelper {
    protected readonly platform: AbstractSqlPlatform;
    constructor(platform: AbstractSqlPlatform);
    getSchemaBeginning(charset: string): string;
    disableForeignKeysSQL(): string;
    enableForeignKeysSQL(): string;
    getSchemaEnd(): string;
    finalizeTable(table: Knex.TableBuilder, charset: string, collate?: string): void;
    supportsSchemaConstraints(): boolean;
    getPrimaryKeys(connection: AbstractSqlConnection, indexes: Index[], tableName: string, schemaName?: string): Promise<string[]>;
    getForeignKeys(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Dictionary>;
    getEnumDefinitions(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Dictionary>;
    getListTablesSQL(): string;
    getRenameColumnSQL(tableName: string, oldColumnName: string, to: Column): string;
    getCreateIndexSQL(tableName: string, index: Index): string;
    getDropIndexSQL(tableName: string, index: Index): string;
    getRenameIndexSQL(tableName: string, index: Index, oldIndexName: string): string;
    createTableColumn(table: Knex.TableBuilder, column: Column, fromTable: DatabaseTable, changedProperties?: Set<string>): any;
    configureColumn(column: Column, col: Knex.ColumnBuilder, knex: Knex, changedProperties?: Set<string>): Knex.ColumnBuilder;
    configureColumnDefault(column: Column, col: Knex.ColumnBuilder, knex: Knex, changedProperties?: Set<string>): Knex.ColumnBuilder;
    getPreAlterTable(tableDiff: TableDifference, safe: boolean): string;
    getAlterColumnAutoincrement(tableName: string, column: Column): string;
    getChangeColumnCommentSQL(tableName: string, to: Column): string;
    getColumns(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Column[]>;
    getIndexes(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Index[]>;
    protected mapIndexes(indexes: Index[]): Promise<Index[]>;
    getForeignKeysSQL(tableName: string, schemaName?: string): string;
    mapForeignKeys(fks: any[], tableName: string, schemaName?: string): Dictionary;
    normalizeDefaultValue(defaultValue: string, length?: number, defaultValues?: Dictionary<string[]>): string | number;
    getCreateDatabaseSQL(name: string): string;
    getDropDatabaseSQL(name: string): string;
    getDatabaseExistsSQL(name: string): string;
    getDatabaseNotExistsError(dbName: string): string;
    getManagementDbName(): string;
    getDefaultEmptyString(): string;
    databaseExists(connection: Connection, name: string): Promise<boolean>;
    /**
     * Uses `raw` method injected in `AbstractSqlConnection` to allow adding custom queries inside alter statements.
     */
    pushTableQuery(table: Knex.TableBuilder, expression: string, grouping?: string): void;
}
