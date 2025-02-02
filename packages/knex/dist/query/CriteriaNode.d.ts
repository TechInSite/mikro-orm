/// <reference types="node" />
import { inspect } from 'util';
import { EntityProperty, MetadataStorage } from '@mikro-orm/core';
import { ICriteriaNode, IQueryBuilder } from '../typings';
/**
 * Helper for working with deeply nested where/orderBy/having criteria. Uses composite pattern to build tree from the payload.
 * Auto-joins relations and converts payload from { books: { publisher: { name: '...' } } } to { 'publisher_alias.name': '...' }
 * @internal
 */
export declare class CriteriaNode implements ICriteriaNode {
    protected readonly metadata: MetadataStorage;
    readonly entityName: string;
    readonly parent?: ICriteriaNode | undefined;
    readonly key?: string | undefined;
    payload: any;
    prop?: EntityProperty;
    constructor(metadata: MetadataStorage, entityName: string, parent?: ICriteriaNode | undefined, key?: string | undefined, validate?: boolean);
    process<T>(qb: IQueryBuilder<T>, alias?: string): any;
    shouldInline(payload: any): boolean;
    willAutoJoin<T>(qb: IQueryBuilder<T>, alias?: string): boolean;
    shouldRename(payload: any): boolean;
    renameFieldToPK<T>(qb: IQueryBuilder<T>): string;
    getPath(): string;
    private isPivotJoin;
    getPivotPath(path: string): string;
    [inspect.custom](): string;
    static isCustomExpression(field: string): boolean;
}
