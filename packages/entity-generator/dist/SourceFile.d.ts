import { EntityMetadata, NamingStrategy, Platform } from '@mikro-orm/core';
import { SchemaHelper } from '@mikro-orm/knex';
export declare class SourceFile {
    private readonly meta;
    private readonly namingStrategy;
    private readonly platform;
    private readonly helper;
    private readonly coreImports;
    private readonly entityImports;
    constructor(meta: EntityMetadata, namingStrategy: NamingStrategy, platform: Platform, helper: SchemaHelper);
    generate(): string;
    getBaseName(): string;
    private getCollectionDecl;
    private getPropertyDefinition;
    private getPropertyDecorator;
    private getPropertyIndexes;
    private getCommonDecoratorOptions;
    private getScalarPropertyDecoratorOptions;
    private getForeignKeyDecoratorOptions;
    private quote;
    private getDecoratorType;
}
