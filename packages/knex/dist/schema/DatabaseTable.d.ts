import { Dictionary, EntityMetadata, EntityProperty, NamingStrategy } from '@mikro-orm/core';
import { SchemaHelper } from './SchemaHelper';
import { Column, ForeignKey, Index } from '../typings';
import { AbstractSqlPlatform } from '../AbstractSqlPlatform';
/**
 * @internal
 */
export declare class DatabaseTable {
    private readonly platform;
    readonly name: string;
    readonly schema?: string | undefined;
    private columns;
    private indexes;
    private foreignKeys;
    comment?: string;
    constructor(platform: AbstractSqlPlatform, name: string, schema?: string | undefined);
    getColumns(): Column[];
    getColumn(name: string): Column | undefined;
    getIndexes(): Index[];
    init(cols: Column[], indexes: Index[], pks: string[], fks: Dictionary<ForeignKey>, enums: Dictionary<string[]>): void;
    addColumn(column: Column): void;
    addColumnFromProperty(prop: EntityProperty, meta: EntityMetadata): void;
    private getIndexName;
    getEntityDeclaration(namingStrategy: NamingStrategy, schemaHelper: SchemaHelper): EntityMetadata;
    /**
     * The shortest name is stripped of the default namespace. All other namespaced elements are returned as full-qualified names.
     */
    getShortestName(defaultNamespaceName?: string): string;
    getForeignKeys(): Dictionary<ForeignKey>;
    hasColumn(columnName: string): boolean;
    getIndex(indexName: string): Index | undefined;
    hasIndex(indexName: string): boolean;
    getPrimaryKey(): Index | undefined;
    hasPrimaryKey(): boolean;
    private getPropertyDeclaration;
    private getReferenceType;
    private getPropertyName;
    private getPropertyType;
    private getPropertyDefaultValue;
    addIndex(meta: EntityMetadata, index: {
        properties: string | string[];
        name?: string;
        type?: string;
        expression?: string;
        options?: Dictionary;
    }, type: 'index' | 'unique' | 'primary'): void;
    isInDefaultNamespace(defaultNamespaceName: string): boolean;
    toJSON(): Dictionary;
}
