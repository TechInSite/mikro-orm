import { Configuration, Dictionary, EntityMetadata } from '@mikro-orm/core';
import { DatabaseTable } from './DatabaseTable';
import { AbstractSqlConnection } from '../AbstractSqlConnection';
import { AbstractSqlPlatform } from '../AbstractSqlPlatform';
/**
 * @internal
 */
export declare class DatabaseSchema {
    private readonly platform;
    readonly name: string;
    private readonly tables;
    private readonly namespaces;
    constructor(platform: AbstractSqlPlatform, name: string);
    addTable(name: string, schema: string | undefined | null): DatabaseTable;
    getTables(): DatabaseTable[];
    getTable(name: string): DatabaseTable | undefined;
    hasTable(name: string): boolean;
    hasNamespace(namespace: string): boolean;
    getNamespaces(): string[];
    static create(connection: AbstractSqlConnection, platform: AbstractSqlPlatform, config: Configuration): Promise<DatabaseSchema>;
    static fromMetadata(metadata: EntityMetadata[], platform: AbstractSqlPlatform, config: Configuration): DatabaseSchema;
    private static shouldHaveColumn;
    toJSON(): Dictionary;
}
