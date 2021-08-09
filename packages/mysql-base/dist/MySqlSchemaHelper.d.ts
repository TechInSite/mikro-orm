import { AbstractSqlConnection, SchemaHelper, Column, Index, Knex, TableDifference } from '@mikro-orm/knex';
import { Dictionary } from '@mikro-orm/core';
export declare class MySqlSchemaHelper extends SchemaHelper {
    static readonly DEFAULT_VALUES: {
        'now()': string[];
        'current_timestamp(?)': string[];
        '0': string[];
    };
    getSchemaBeginning(charset: string): string;
    getSchemaEnd(): string;
    disableForeignKeysSQL(): string;
    enableForeignKeysSQL(): string;
    finalizeTable(table: Knex.CreateTableBuilder, charset: string, collate?: string): void;
    getListTablesSQL(): string;
    getPreAlterTable(tableDiff: TableDifference, safe: boolean): string;
    getRenameColumnSQL(tableName: string, oldColumnName: string, to: Column): string;
    getRenameIndexSQL(tableName: string, index: Index, oldIndexName: string): string;
    getChangeColumnCommentSQL(tableName: string, to: Column): string;
    private getColumnDeclarationSQL;
    getForeignKeysSQL(tableName: string, schemaName?: string): string;
    getEnumDefinitions(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Dictionary>;
    getColumns(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Column[]>;
    getIndexes(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Index[]>;
    normalizeDefaultValue(defaultValue: string, length: number): string | number;
}
