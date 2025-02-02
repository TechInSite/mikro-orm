/// <reference types="node" />
import { Cascade, EventType, LoadStrategy, LockMode, QueryOrder, ReferenceType } from './enums';
import { AssignOptions, Collection, EntityFactory, EntityIdentifier, EntityRepository, IdentifiedReference, Reference, SerializationContext } from './entity';
import { EntitySchema, MetadataStorage } from './metadata';
import { Type } from './types';
import { Platform } from './platforms';
import { Configuration } from './utils';
import { EntityManager } from './EntityManager';
export declare type Constructor<T = unknown> = new (...args: any[]) => T;
export declare type Dictionary<T = any> = {
    [k: string]: T;
};
export declare type ExcludeFunctions<T, K extends keyof T> = T[K] extends Function ? never : K;
export declare type Cast<T, R> = T extends R ? T : R;
export declare type IsUnknown<T> = T extends unknown ? unknown extends T ? true : never : never;
export declare type DeepPartial<T> = T & {
    [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends Readonly<infer U>[] ? Readonly<DeepPartial<U>>[] : DeepPartial<T[P]>;
};
export declare const EntityRepositoryType: unique symbol;
export declare const PrimaryKeyType: unique symbol;
export declare const PrimaryKeyProp: unique symbol;
declare type ReadonlyPrimary<T> = T extends any[] ? Readonly<T> : T;
export declare type Primary<T> = T extends {
    [PrimaryKeyType]: infer PK;
} ? ReadonlyPrimary<PK> : T extends {
    _id: infer PK;
} ? ReadonlyPrimary<PK> | string : T extends {
    uuid: infer PK;
} ? ReadonlyPrimary<PK> : T extends {
    id: infer PK;
} ? ReadonlyPrimary<PK> : never;
export declare type PrimaryProperty<T> = T extends {
    [PrimaryKeyProp]?: infer PK;
} ? PK : T extends {
    _id: any;
} ? '_id' | string : T extends {
    uuid: any;
} ? 'uuid' : T extends {
    id: any;
} ? 'id' : never;
export declare type IPrimaryKeyValue = number | string | bigint | Date | {
    toHexString(): string;
};
export declare type IPrimaryKey<T extends IPrimaryKeyValue = IPrimaryKeyValue> = T;
export declare type Scalar = boolean | number | string | bigint | symbol | Date | RegExp | Buffer | {
    toHexString(): string;
};
export declare type ExpandScalar<T> = null | (T extends string ? string | RegExp : T extends Date ? Date | string : T);
export declare type OperatorMap<T> = {
    $and?: Query<T>[];
    $or?: Query<T>[];
    $eq?: ExpandScalar<T>;
    $ne?: ExpandScalar<T>;
    $in?: ExpandScalar<T>[];
    $nin?: ExpandScalar<T>[];
    $not?: Query<T>;
    $gt?: ExpandScalar<T>;
    $gte?: ExpandScalar<T>;
    $lt?: ExpandScalar<T>;
    $lte?: ExpandScalar<T>;
    $like?: string;
    $re?: string;
    $ilike?: string;
    $overlap?: string[];
    $contains?: string[];
    $contained?: string[];
};
export declare type FilterValue2<T> = T | ExpandScalar<T> | Primary<T>;
export declare type FilterValue<T> = OperatorMap<FilterValue2<T>> | FilterValue2<T> | FilterValue2<T>[] | null;
declare type ExpandObject<T> = {
    [K in keyof T as ExcludeFunctions<T, K>]?: Query<ExpandProperty<T[K]>> | FilterValue<ExpandProperty<T[K]>> | null;
} | FilterValue<ExpandProperty<T>>;
export declare type Query<T> = T extends Scalar ? FilterValue<T> : T extends Collection<infer U> ? ExpandObject<U> : ExpandObject<T>;
export declare type FilterQuery<T> = NonNullable<Query<T>> | {
    [PrimaryKeyType]?: any;
};
export declare type QBFilterQuery<T = any> = FilterQuery<T> & Dictionary | FilterQuery<T>;
export interface IWrappedEntity<T extends AnyEntity<T>, PK extends keyof T | unknown = PrimaryProperty<T>, P extends Populate<T> | unknown = unknown> {
    isInitialized(): boolean;
    populated(populated?: boolean): void;
    init<P extends Populate<T> = Populate<T>>(populated?: boolean, populate?: P, lockMode?: LockMode): Promise<T>;
    toReference<PK2 extends PK | unknown = PrimaryProperty<T>, P2 extends P | unknown = unknown>(): IdentifiedReference<T, PK2> & LoadedReference<T, P2>;
    toObject(ignoreFields?: string[]): EntityDTO<T>;
    toJSON(...args: any[]): EntityDTO<T>;
    toPOJO(): EntityDTO<T>;
    assign(data: EntityData<T> | Partial<EntityDTO<T>>, options?: AssignOptions | boolean): T;
}
export interface IWrappedEntityInternal<T, PK extends keyof T | unknown = PrimaryProperty<T>, P = keyof T> extends IWrappedEntity<T, PK, P> {
    hasPrimaryKey(): boolean;
    getPrimaryKey(convertCustomTypes?: boolean): Primary<T> | null;
    getPrimaryKeys(convertCustomTypes?: boolean): Primary<T>[] | null;
    setPrimaryKey(val: Primary<T>): void;
    getSerializedPrimaryKey(): string & keyof T;
    __meta: EntityMetadata<T>;
    __data: Dictionary;
    __em?: any;
    __platform: Platform;
    __initialized: boolean;
    __originalEntityData?: EntityData<T>;
    __identifier?: EntityIdentifier;
    __managed: boolean;
    __populated: boolean;
    __lazyInitialized: boolean;
    __primaryKeys: Primary<T>[];
    __primaryKeyCond: Primary<T> | Primary<T>[];
    __serializationContext: {
        root?: SerializationContext<T>;
        populate?: PopulateOptions<T>[];
    };
}
export declare type AnyEntity<T = any> = Partial<T> & {
    [PrimaryKeyType]?: unknown;
    [EntityRepositoryType]?: unknown;
    __helper?: IWrappedEntityInternal<T, keyof T>;
    __meta?: EntityMetadata<T>;
    __platform?: Platform;
};
export declare type EntityClass<T extends AnyEntity<T>> = Function & {
    prototype: T;
};
export declare type EntityClassGroup<T extends AnyEntity<T>> = {
    entity: EntityClass<T>;
    schema: EntityMetadata<T> | EntitySchema<T>;
};
export declare type EntityName<T extends AnyEntity<T>> = string | EntityClass<T> | EntitySchema<T, any>;
export declare type GetRepository<T extends AnyEntity<T>, U> = T[typeof EntityRepositoryType] extends EntityRepository<any> | undefined ? NonNullable<T[typeof EntityRepositoryType]> : U;
export declare type EntityDataPropValue<T> = T | Primary<T>;
declare type ExpandEntityProp<T> = T extends Record<string, any> ? {
    [K in keyof T]?: EntityDataProp<ExpandProperty<T[K]>> | EntityDataPropValue<ExpandProperty<T[K]>> | null;
} | EntityDataPropValue<ExpandProperty<T>> : T;
export declare type EntityDataProp<T> = T extends Scalar ? T : T extends Reference<infer U> ? EntityDataNested<U> : T extends Collection<infer U> ? U | U[] | EntityDataNested<U> | EntityDataNested<U>[] : T extends readonly (infer U)[] ? U | U[] | EntityDataNested<U> | EntityDataNested<U>[] : EntityDataNested<T>;
export declare type EntityDataNested<T> = T extends undefined ? never : T extends any[] ? Readonly<T> : EntityData<T> | ExpandEntityProp<T>;
declare type EntityDataItem<T> = T | EntityDataProp<T> | null;
export declare type EntityData<T> = {
    [K in keyof T]?: EntityDataItem<T[K]>;
};
export declare type EntityDictionary<T> = EntityData<T> & Dictionary;
declare type Relation<T> = {
    [P in keyof T as T[P] extends unknown[] | Record<string | number | symbol, unknown> ? P : never]?: T[P];
};
export declare type EntityDTOProp<T> = T extends Scalar ? T : T extends Reference<infer U> ? EntityDTO<U> : T extends Collection<infer U> ? EntityDTO<U>[] : T extends {
    $: infer U;
} ? (U extends readonly (infer V)[] ? EntityDTO<V>[] : EntityDTO<U>) : T extends readonly (infer U)[] ? U[] : T extends Relation<T> ? EntityDTO<T> : T;
export declare type EntityDTO<T> = {
    [K in keyof T as ExcludeFunctions<T, K>]: EntityDTOProp<T[K]>;
};
export interface EntityProperty<T extends AnyEntity<T> = any> {
    name: string & keyof T;
    entity: () => EntityName<T>;
    type: string;
    targetMeta?: EntityMetadata;
    columnTypes: string[];
    customType: Type<any>;
    autoincrement?: boolean;
    primary?: boolean;
    serializedPrimaryKey: boolean;
    lazy?: boolean;
    array?: boolean;
    length?: number;
    precision?: number;
    scale?: number;
    reference: ReferenceType;
    wrappedReference?: boolean;
    fieldNames: string[];
    fieldNameRaw?: string;
    default?: string | number | boolean | null;
    defaultRaw?: string;
    formula?: (alias: string) => string;
    prefix?: string | boolean;
    embedded?: [string, string];
    embeddable: Constructor<T>;
    embeddedProps: Dictionary<EntityProperty>;
    object?: boolean;
    index?: boolean | string;
    unique?: boolean | string;
    nullable?: boolean;
    inherited?: boolean;
    unsigned?: boolean;
    mapToPk?: boolean;
    persist?: boolean;
    hidden?: boolean;
    enum?: boolean;
    items?: (number | string)[];
    version?: boolean;
    eager?: boolean;
    setter?: boolean;
    getter?: boolean;
    getterName?: keyof T;
    cascade: Cascade[];
    orphanRemoval?: boolean;
    onCreate?: (entity: T) => any;
    onUpdate?: (entity: T) => any;
    onDelete?: 'cascade' | 'no action' | 'set null' | 'set default' | string;
    onUpdateIntegrity?: 'cascade' | 'no action' | 'set null' | 'set default' | string;
    strategy?: LoadStrategy;
    owner: boolean;
    inversedBy: string;
    mappedBy: string;
    orderBy?: {
        [field: string]: QueryOrder;
    };
    fixedOrder?: boolean;
    fixedOrderColumn?: string;
    pivotTable: string;
    joinColumns: string[];
    inverseJoinColumns: string[];
    referencedColumnNames: string[];
    referencedTableName: string;
    referencedPKs: string[];
    serializer?: (value: any) => any;
    serializedName?: string;
    comment?: string;
    userDefined?: boolean;
}
export declare class EntityMetadata<T extends AnyEntity<T> = any> {
    readonly propertyOrder: Map<string, number>;
    constructor(meta?: Partial<EntityMetadata>);
    addProperty(prop: EntityProperty<T>, sync?: boolean): void;
    removeProperty(name: string, sync?: boolean): void;
    getPrimaryProps(): EntityProperty<T>[];
    sync(initIndexes?: boolean): void;
    private initIndexes;
}
export interface EntityMetadata<T extends AnyEntity<T> = any> {
    name?: string;
    className: string;
    tableName: string;
    schema?: string;
    pivotTable: boolean;
    discriminatorColumn?: string;
    discriminatorValue?: string;
    discriminatorMap?: Dictionary<string>;
    embeddable: boolean;
    constructorParams: string[];
    forceConstructor: boolean;
    toJsonParams: string[];
    extends: string;
    collection: string;
    path: string;
    primaryKeys: (keyof T & string)[];
    compositePK: boolean;
    versionProperty: keyof T & string;
    serializedPrimaryKey: keyof T & string;
    properties: {
        [K in keyof T & string]: EntityProperty<T>;
    };
    props: EntityProperty<T>[];
    relations: EntityProperty<T>[];
    comparableProps: EntityProperty<T>[];
    hydrateProps: EntityProperty<T>[];
    indexes: {
        properties: (keyof T & string) | (keyof T & string)[];
        name?: string;
        type?: string;
        options?: Dictionary;
        expression?: string;
    }[];
    uniques: {
        properties: (keyof T & string) | (keyof T & string)[];
        name?: string;
        options?: Dictionary;
    }[];
    customRepository: () => Constructor<EntityRepository<T>>;
    hooks: Partial<Record<keyof typeof EventType, (string & keyof T)[]>>;
    prototype: T;
    class: Constructor<T>;
    abstract: boolean;
    useCache: boolean;
    filters: Dictionary<FilterDef<T>>;
    comment?: string;
    selfReferencing?: boolean;
    readonly?: boolean;
    root: EntityMetadata<T>;
}
export interface ISchemaGenerator {
    generate(): Promise<string>;
    createSchema(options?: {
        wrap?: boolean;
    }): Promise<void>;
    ensureDatabase(): Promise<void>;
    getCreateSchemaSQL(options?: {
        wrap?: boolean;
    }): Promise<string>;
    dropSchema(options?: {
        wrap?: boolean;
        dropMigrationsTable?: boolean;
        dropDb?: boolean;
    }): Promise<void>;
    getDropSchemaSQL(options?: {
        wrap?: boolean;
        dropMigrationsTable?: boolean;
    }): Promise<string>;
    updateSchema(options?: {
        wrap?: boolean;
        safe?: boolean;
        dropDb?: boolean;
        dropTables?: boolean;
    }): Promise<void>;
    getUpdateSchemaSQL(options?: {
        wrap?: boolean;
        safe?: boolean;
        dropDb?: boolean;
        dropTables?: boolean;
    }): Promise<string>;
    createDatabase(name: string): Promise<void>;
    dropDatabase(name: string): Promise<void>;
    execute(sql: string, options?: {
        wrap?: boolean;
    }): Promise<void>;
}
export interface IEntityGenerator {
    generate(options?: {
        baseDir?: string;
        save?: boolean;
    }): Promise<string[]>;
}
declare type UmzugMigration = {
    path?: string;
    file: string;
};
declare type MigrateOptions = {
    from?: string | number;
    to?: string | number;
    migrations?: string[];
};
declare type MigrationResult = {
    fileName: string;
    code: string;
    diff: string[];
};
declare type MigrationRow = {
    name: string;
    executed_at: Date;
};
export interface IMigrator {
    createMigration(path?: string, blank?: boolean, initial?: boolean): Promise<MigrationResult>;
    createInitialMigration(path?: string): Promise<MigrationResult>;
    getExecutedMigrations(): Promise<MigrationRow[]>;
    getPendingMigrations(): Promise<UmzugMigration[]>;
    up(options?: string | string[] | MigrateOptions): Promise<UmzugMigration[]>;
    down(options?: string | string[] | MigrateOptions): Promise<UmzugMigration[]>;
}
export interface Migration {
    up(): Promise<void>;
    down(): Promise<void>;
}
export interface MigrationObject {
    name: string;
    class: Constructor<Migration>;
}
export declare type FilterDef<T extends AnyEntity<T>> = {
    name: string;
    cond: FilterQuery<T> | ((args: Dictionary, type: 'read' | 'update' | 'delete') => FilterQuery<T> | Promise<FilterQuery<T>>);
    default?: boolean;
    entity?: string[];
    args?: boolean;
};
export declare type ExpandProperty<T> = T extends Reference<infer U> ? NonNullable<U> : T extends Collection<infer U> ? NonNullable<U> : T extends (infer U)[] ? NonNullable<U> : NonNullable<T>;
export declare type PopulateChildren<T> = {
    [K in keyof T]?: PopulateMap<ExpandProperty<T[K]>>;
};
export declare type PopulateMap<T> = boolean | LoadStrategy | PopulateChildren<T>;
export declare type Populate<T> = readonly (keyof T)[] | readonly string[] | boolean | PopulateMap<T>;
export declare type PopulateOptions<T> = {
    field: string;
    strategy?: LoadStrategy;
    all?: boolean;
    children?: PopulateOptions<T[keyof T]>[];
};
export interface LoadedReference<T extends AnyEntity<T>, P = never> extends Reference<T> {
    $: T & P;
    get(): T & P;
}
export interface LoadedCollection<T extends AnyEntity<T>, P = never> extends Collection<T> {
    $: readonly (T & P)[];
    get(): readonly (T & P)[];
}
declare type MarkLoaded<T extends AnyEntity<T>, P, H = unknown> = P extends Reference<infer U> ? LoadedReference<U, Loaded<U, H>> : P extends Collection<infer U> ? LoadedCollection<U, Loaded<U, H>> : P;
declare type LoadedIfInKeyHint<T extends AnyEntity<T>, K extends keyof T, H> = K extends H ? MarkLoaded<T, T[K]> : T[K];
declare type LoadedIfInNestedHint<T extends AnyEntity<T>, K extends keyof T, H> = K extends keyof H ? MarkLoaded<T, T[K], H[K]> : T[K];
declare type SubType<T, C> = Pick<T, {
    [K in keyof T]: T[K] extends C ? K : never;
}[keyof T]>;
declare type RelationsIn<T> = SubType<T, Collection<any> | Reference<any> | undefined>;
declare type NestedLoadHint<T> = {
    [K in keyof RelationsIn<T>]?: true | LoadStrategy | PopulateMap<ExpandProperty<T[K]>>;
};
export declare type Loaded<T extends AnyEntity<T>, P = unknown> = unknown extends P ? T : T & {
    [K in keyof RelationsIn<T>]: P extends readonly (infer U)[] ? LoadedIfInKeyHint<T, K, U> : P extends NestedLoadHint<T> ? LoadedIfInNestedHint<T, K, P> : LoadedIfInKeyHint<T, K, P>;
};
export declare type New<T extends AnyEntity<T>, P = string[]> = Loaded<T, P>;
export interface Highlighter {
    highlight(text: string): string;
}
export interface IMetadataStorage {
    getAll(): Dictionary<EntityMetadata>;
    get<T extends AnyEntity<T> = any>(entity: string, init?: boolean, validate?: boolean): EntityMetadata<T>;
    find<T extends AnyEntity<T> = any>(entity: string): EntityMetadata<T> | undefined;
    has(entity: string): boolean;
    set(entity: string, meta: EntityMetadata): EntityMetadata;
    reset(entity: string): void;
}
export interface IHydrator {
    /**
     * Hydrates the whole entity. This process handles custom type conversions, creating missing Collection instances,
     * mapping FKs to entity instances, as well as merging those entities.
     */
    hydrate<T extends AnyEntity<T>>(entity: T, meta: EntityMetadata<T>, data: EntityData<T>, factory: EntityFactory, type: 'full' | 'returning' | 'reference', newEntity?: boolean, convertCustomTypes?: boolean): void;
    /**
     * Hydrates primary keys only
     */
    hydrateReference<T extends AnyEntity<T>>(entity: T, meta: EntityMetadata<T>, data: EntityData<T>, factory: EntityFactory, convertCustomTypes?: boolean): void;
}
export interface HydratorConstructor {
    new (metadata: MetadataStorage, platform: Platform, config: Configuration): IHydrator;
}
export interface ISeedManager {
    refreshDatabase(): Promise<void>;
    seed(...seederClasses: {
        new (): Seeder;
    }[]): Promise<void>;
    seedString(...seederClasses: string[]): Promise<void>;
    createSeeder(seederClass: string): Promise<void>;
}
export interface Seeder {
    run(em: EntityManager): Promise<void>;
}
export declare abstract class PlainObject {
}
export declare type MaybePromise<T> = T | Promise<T>;
export {};
