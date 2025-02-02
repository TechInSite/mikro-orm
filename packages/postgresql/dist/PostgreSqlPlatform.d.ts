import { EntityProperty, Type } from '@mikro-orm/core';
import { AbstractSqlPlatform } from '@mikro-orm/knex';
import { PostgreSqlSchemaHelper } from './PostgreSqlSchemaHelper';
import { PostgreSqlExceptionConverter } from './PostgreSqlExceptionConverter';
export declare class PostgreSqlPlatform extends AbstractSqlPlatform {
    protected readonly schemaHelper: PostgreSqlSchemaHelper;
    protected readonly exceptionConverter: PostgreSqlExceptionConverter;
    usesReturningStatement(): boolean;
    usesCascadeStatement(): boolean;
    /**
     * Postgres will complain if we try to batch update uniquely constrained property (moving the value from one entity to another).
     * This flag will result in postponing 1:1 updates (removing them from the batched query).
     * @see https://stackoverflow.com/questions/5403437/atomic-multi-row-update-with-a-unique-constraint
     */
    allowsUniqueBatchUpdates(): boolean;
    getCurrentTimestampSQL(length: number): string;
    getDateTimeTypeDeclarationSQL(column: {
        length?: number;
    }): string;
    getTimeTypeDeclarationSQL(): string;
    getIntegerTypeDeclarationSQL(column: {
        length?: number;
        autoincrement?: boolean;
    }): string;
    getBigIntTypeDeclarationSQL(column: {
        autoincrement?: boolean;
    }): string;
    getTinyIntTypeDeclarationSQL(column: {
        length?: number;
        unsigned?: boolean;
        autoincrement?: boolean;
    }): string;
    getUuidTypeDeclarationSQL(column: {
        length?: number;
    }): string;
    getRegExpOperator(): string;
    isBigIntProperty(prop: EntityProperty): boolean;
    getArrayDeclarationSQL(): string;
    getFloatDeclarationSQL(): string;
    getDoubleDeclarationSQL(): string;
    getEnumTypeDeclarationSQL(column: {
        fieldNames: string[];
        items?: unknown[];
    }): string;
    marshallArray(values: string[]): string;
    getBlobDeclarationSQL(): string;
    getJsonDeclarationSQL(): string;
    getSearchJsonPropertyKey(path: string[], type: string): string;
    quoteIdentifier(id: string, quote?: string): string;
    quoteValue(value: any): string;
    getDefaultIntegrityRule(): string;
    indexForeignKeys(): boolean;
    getMappedType(type: string): Type<unknown>;
    supportsSchemas(): boolean;
    /**
     * Returns the default name of index for the given columns
     * cannot go past 64 character length for identifiers in MySQL
     */
    getIndexName(tableName: string, columns: string[], type: 'index' | 'unique' | 'foreign' | 'primary' | 'sequence'): string;
}
