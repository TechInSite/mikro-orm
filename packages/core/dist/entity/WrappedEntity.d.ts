/// <reference types="node" />
import { inspect } from 'util';
import { EntityManager } from '../EntityManager';
import { AnyEntity, EntityData, EntityDictionary, EntityMetadata, Populate, PopulateOptions, Primary } from '../typings';
import { IdentifiedReference } from './Reference';
import { SerializationContext } from './EntityTransformer';
import { AssignOptions } from './EntityAssigner';
import { LockMode } from '../enums';
import { EntityIdentifier } from './EntityIdentifier';
export declare class WrappedEntity<T extends AnyEntity<T>, PK extends keyof T> {
    private readonly entity;
    private readonly pkGetter?;
    private readonly pkSerializer?;
    private readonly pkGetterConverted?;
    __initialized: boolean;
    __populated?: boolean;
    __lazyInitialized?: boolean;
    __managed?: boolean;
    __em?: EntityManager;
    __serializationContext: {
        root?: SerializationContext<T>;
        populate?: PopulateOptions<T>[];
    };
    /** holds last entity data snapshot so we can compute changes when persisting managed entities */
    __originalEntityData?: EntityData<T>;
    /** holds wrapped primary key so we can compute change set without eager commit */
    __identifier?: EntityIdentifier;
    constructor(entity: T, pkGetter?: ((e: T) => Primary<T>) | undefined, pkSerializer?: ((e: T) => string) | undefined, pkGetterConverted?: ((e: T) => Primary<T>) | undefined);
    isInitialized(): boolean;
    populated(populated?: boolean): void;
    toReference(): IdentifiedReference<T, PK>;
    toObject(ignoreFields?: string[]): EntityData<T>;
    toPOJO(): EntityData<T>;
    toJSON(...args: any[]): EntityDictionary<T>;
    assign(data: EntityData<T>, options?: AssignOptions): T;
    init<P extends Populate<T> = Populate<T>>(populated?: boolean, populate?: P, lockMode?: LockMode): Promise<T>;
    hasPrimaryKey(): boolean;
    getPrimaryKey(convertCustomTypes?: boolean): Primary<T> | null;
    getPrimaryKeys(convertCustomTypes?: boolean): Primary<T>[] | null;
    setPrimaryKey(id: Primary<T> | null): void;
    getSerializedPrimaryKey(): string;
    get __meta(): EntityMetadata<T>;
    get __platform(): import("..").Platform;
    get __primaryKeys(): Primary<T>[];
    get __primaryKeyCond(): Primary<T> | Primary<T>[] | null;
    [inspect.custom](): string;
}
