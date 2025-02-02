import { EntityRepository } from '../entity';
import { NamingStrategy } from '../naming-strategy';
import { Constructor, EntityProperty, IEntityGenerator, IMigrator, IPrimaryKey, ISchemaGenerator, Primary } from '../typings';
import { ExceptionConverter } from './ExceptionConverter';
import { EntityManager } from '../EntityManager';
import { Configuration } from '../utils/Configuration';
import { Type } from '../types';
export declare const JsonProperty: unique symbol;
export declare abstract class Platform {
    protected readonly exceptionConverter: ExceptionConverter;
    protected config: Configuration;
    protected namingStrategy: NamingStrategy;
    protected timezone?: string;
    usesPivotTable(): boolean;
    supportsTransactions(): boolean;
    usesImplicitTransactions(): boolean;
    getNamingStrategy(): {
        new (): NamingStrategy;
    };
    usesReturningStatement(): boolean;
    usesCascadeStatement(): boolean;
    getSchemaHelper(): unknown;
    indexForeignKeys(): boolean;
    allowsMultiInsert(): boolean;
    /**
     * Whether or not the driver supports retuning list of created PKs back when multi-inserting
     */
    usesBatchInserts(): boolean;
    /**
     * Whether or not the driver supports updating many records at once
     */
    usesBatchUpdates(): boolean;
    usesDefaultKeyword(): boolean;
    /**
     * Normalizes primary key wrapper to scalar value (e.g. mongodb's ObjectId to string)
     */
    normalizePrimaryKey<T extends number | string = number | string>(data: Primary<T> | IPrimaryKey): T;
    /**
     * Converts scalar primary key representation to native driver wrapper (e.g. string to mongodb's ObjectId)
     */
    denormalizePrimaryKey(data: IPrimaryKey): IPrimaryKey;
    /**
     * Used when serializing via toObject and toJSON methods, allows to use different PK field name (like `id` instead of `_id`)
     */
    getSerializedPrimaryKeyField(field: string): string;
    usesDifferentSerializedPrimaryKey(): boolean;
    /**
     * Returns the SQL specific for the platform to get the current timestamp
     */
    getCurrentTimestampSQL(length?: number): string;
    getDateTimeTypeDeclarationSQL(column: {
        length?: number;
    }): string;
    getDateTypeDeclarationSQL(length?: number): string;
    getTimeTypeDeclarationSQL(length?: number): string;
    getRegExpOperator(): string;
    quoteVersionValue(value: Date | number, prop: EntityProperty): Date | string | number;
    getDefaultVersionLength(): number;
    requiresValuesKeyword(): boolean;
    allowsComparingTuples(): boolean;
    allowsUniqueBatchUpdates(): boolean;
    isBigIntProperty(prop: EntityProperty): boolean;
    isRaw(value: any): boolean;
    getBooleanTypeDeclarationSQL(): string;
    getIntegerTypeDeclarationSQL(column: {
        length?: number;
        unsigned?: boolean;
        autoincrement?: boolean;
    }): string;
    getSmallIntTypeDeclarationSQL(column: {
        length?: number;
        unsigned?: boolean;
        autoincrement?: boolean;
    }): string;
    getTinyIntTypeDeclarationSQL(column: {
        length?: number;
        unsigned?: boolean;
        autoincrement?: boolean;
    }): string;
    getBigIntTypeDeclarationSQL(column: {
        length?: number;
        unsigned?: boolean;
        autoincrement?: boolean;
    }): string;
    getVarcharTypeDeclarationSQL(column: {
        length?: number;
    }): string;
    getTextTypeDeclarationSQL(_column: {
        length?: number;
    }): string;
    getEnumTypeDeclarationSQL(column: {
        items?: unknown[];
        fieldNames: string[];
        length?: number;
        unsigned?: boolean;
        autoincrement?: boolean;
    }): string;
    getFloatDeclarationSQL(): string;
    getDoubleDeclarationSQL(): string;
    getDecimalTypeDeclarationSQL(column: {
        precision?: number;
        scale?: number;
    }): string;
    getUuidTypeDeclarationSQL(column: {
        length?: number;
    }): string;
    extractSimpleType(type: string): string;
    getMappedType(type: string): Type<unknown>;
    getArrayDeclarationSQL(): string;
    getDefaultIntegrityRule(): string;
    marshallArray(values: string[]): string;
    unmarshallArray(value: string): string[];
    getBlobDeclarationSQL(): string;
    getJsonDeclarationSQL(): string;
    getSearchJsonPropertySQL(path: string, type: string): string;
    getSearchJsonPropertyKey(path: string[], type: string): string;
    convertsJsonAutomatically(marshall?: boolean): boolean;
    getRepositoryClass<T>(): Constructor<EntityRepository<T>>;
    getDefaultCharset(): string;
    getExceptionConverter(): ExceptionConverter;
    getSchemaGenerator(em: EntityManager): ISchemaGenerator;
    getEntityGenerator(em: EntityManager): IEntityGenerator;
    getMigrator(em: EntityManager): IMigrator;
    processDateProperty(value: unknown): string | number | Date;
    quoteIdentifier(id: string, quote?: string): string;
    quoteValue(value: any): string;
    cloneEmbeddable<T>(data: T): T;
    setConfig(config: Configuration): void;
    isNumericColumn(mappedType: Type<unknown>): boolean;
    supportsUnsigned(): boolean;
    /**
     * Returns the default name of index for the given columns
     */
    getIndexName(tableName: string, columns: string[], type: 'index' | 'unique' | 'foreign' | 'primary' | 'sequence'): string;
}
