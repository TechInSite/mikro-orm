import { AbstractSqlPlatform } from '@mikro-orm/knex';
import { MySqlSchemaHelper } from './MySqlSchemaHelper';
import { MySqlExceptionConverter } from './MySqlExceptionConverter';
import { Type } from '@mikro-orm/core';
export declare class MySqlPlatform extends AbstractSqlPlatform {
    protected readonly schemaHelper: MySqlSchemaHelper;
    protected readonly exceptionConverter: MySqlExceptionConverter;
    getDefaultCharset(): string;
    getSearchJsonPropertyKey(path: string[], type: string): string;
    getBooleanTypeDeclarationSQL(): string;
    getMappedType(type: string): Type<unknown>;
    supportsUnsigned(): boolean;
    /**
     * Returns the default name of index for the given columns
     * cannot go past 64 character length for identifiers in MySQL
     */
    getIndexName(tableName: string, columns: string[], type: 'index' | 'unique' | 'foreign' | 'primary' | 'sequence'): string;
}
