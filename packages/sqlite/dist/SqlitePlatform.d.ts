import { EntityProperty } from '@mikro-orm/core';
import { AbstractSqlPlatform } from '@mikro-orm/knex';
import { SqliteSchemaHelper } from './SqliteSchemaHelper';
import { SqliteExceptionConverter } from './SqliteExceptionConverter';
export declare class SqlitePlatform extends AbstractSqlPlatform {
    protected readonly schemaHelper: SqliteSchemaHelper;
    protected readonly exceptionConverter: SqliteExceptionConverter;
    usesDefaultKeyword(): boolean;
    getCurrentTimestampSQL(length: number): string;
    getDateTimeTypeDeclarationSQL(column: {
        length?: number;
    }): string;
    getEnumTypeDeclarationSQL(column: {
        items?: unknown[];
        fieldNames: string[];
        length?: number;
        unsigned?: boolean;
        autoincrement?: boolean;
    }): string;
    getTinyIntTypeDeclarationSQL(column: {
        length?: number;
        unsigned?: boolean;
        autoincrement?: boolean;
    }): string;
    getSmallIntTypeDeclarationSQL(column: {
        length?: number;
        unsigned?: boolean;
        autoincrement?: boolean;
    }): string;
    getIntegerTypeDeclarationSQL(column: {
        length?: number;
        unsigned?: boolean;
        autoincrement?: boolean;
    }): string;
    getFloatDeclarationSQL(): string;
    getBooleanTypeDeclarationSQL(): string;
    getVarcharTypeDeclarationSQL(column: {
        length?: number;
    }): string;
    convertsJsonAutomatically(): boolean;
    allowsComparingTuples(): boolean;
    /**
     * This is used to narrow the value of Date properties as they will be stored as timestamps in sqlite.
     * We use this method to convert Dates to timestamps when computing the changeset, so we have the right
     * data type in the payload as well as in original entity data. Without that, we would end up with diffs
     * including all Date properties, as we would be comparing Date object with timestamp.
     */
    processDateProperty(value: unknown): string | number | Date;
    quoteVersionValue(value: Date | number, prop: EntityProperty): Date | string | number;
    requiresValuesKeyword(): boolean;
    quoteValue(value: any): string;
    getSearchJsonPropertyKey(path: string[], type: string): string;
    getDefaultIntegrityRule(): string;
    getIndexName(tableName: string, columns: string[], type: 'index' | 'unique' | 'foreign' | 'primary' | 'sequence'): string;
}
