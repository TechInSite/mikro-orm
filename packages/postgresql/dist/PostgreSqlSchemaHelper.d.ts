import { Dictionary } from '@mikro-orm/core';
import { AbstractSqlConnection, SchemaHelper, Column, Index, DatabaseTable } from '@mikro-orm/knex';
import { Knex } from 'knex';
export declare class PostgreSqlSchemaHelper extends SchemaHelper {
    static readonly DEFAULT_VALUES: {
        'now()': string[];
        'current_timestamp(?)': string[];
        "('now'::text)::timestamp(?) with time zone": string[];
        "('now'::text)::timestamp(?) without time zone": string[];
        'null::character varying': string[];
        'null::timestamp with time zone': string[];
        'null::timestamp without time zone': string[];
    };
    getSchemaBeginning(charset: string): string;
    getSchemaEnd(): string;
    getListTablesSQL(): string;
    getColumns(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Column[]>;
    getIndexes(connection: AbstractSqlConnection, tableName: string, schemaName: string): Promise<Index[]>;
    getForeignKeysSQL(tableName: string, schemaName?: string): string;
    getEnumDefinitions(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Dictionary>;
    createTableColumn(table: Knex.TableBuilder, column: Column, fromTable: DatabaseTable, changedProperties?: Set<string>): Knex.ColumnBuilder;
    configureColumn(column: Column, col: Knex.ColumnBuilder, knex: Knex, changedProperties?: Set<string>): Knex.ColumnBuilder;
    getAlterColumnAutoincrement(tableName: string, column: Column): string;
    getChangeColumnCommentSQL(tableName: string, to: Column): string;
    normalizeDefaultValue(defaultValue: string, length: number): string | number;
    getDatabaseExistsSQL(name: string): string;
    getDatabaseNotExistsError(dbName: string): string;
    getManagementDbName(): string;
    disableForeignKeysSQL(): string;
    enableForeignKeysSQL(): string;
    getRenameIndexSQL(tableName: string, index: Index, oldIndexName: string): string;
    private getIndexesSQL;
}
