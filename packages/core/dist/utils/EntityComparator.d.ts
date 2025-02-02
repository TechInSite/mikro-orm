import { AnyEntity, EntityData, EntityDictionary, EntityMetadata, EntityProperty, IMetadataStorage } from '../typings';
import { Platform } from '../platforms';
declare type Comparator<T> = (a: T, b: T) => EntityData<T>;
declare type ResultMapper<T> = (result: EntityData<T>) => EntityData<T> | null;
declare type SnapshotGenerator<T> = (entity: T) => EntityData<T>;
export declare class EntityComparator {
    private readonly metadata;
    private readonly platform;
    private readonly comparators;
    private readonly mappers;
    private readonly snapshotGenerators;
    private readonly pkGetters;
    private readonly pkGettersConverted;
    private readonly pkSerializers;
    private tmpIndex;
    constructor(metadata: IMetadataStorage, platform: Platform);
    /**
     * Computes difference between two entities.
     */
    diffEntities<T extends EntityData<T>>(entityName: string, a: T, b: T): EntityData<T>;
    /**
     * Removes ORM specific code from entities and prepares it for serializing. Used before change set computation.
     * References will be mapped to primary keys, collections to arrays of primary keys.
     */
    prepareEntity<T extends AnyEntity<T>>(entity: T): EntityData<T>;
    /**
     * Maps database columns to properties.
     */
    mapResult<T extends AnyEntity<T>>(entityName: string, result: EntityDictionary<T>): EntityData<T> | null;
    /**
     * @internal Highly performance-sensitive method.
     */
    getPkGetter<T extends AnyEntity<T>>(meta: EntityMetadata<T>): any;
    /**
     * @internal Highly performance-sensitive method.
     */
    getPkGetterConverted<T extends AnyEntity<T>>(meta: EntityMetadata<T>): any;
    /**
     * @internal Highly performance-sensitive method.
     */
    getPkSerializer<T extends AnyEntity<T>>(meta: EntityMetadata<T>): any;
    /**
     * @internal Highly performance-sensitive method.
     */
    getSnapshotGenerator<T extends AnyEntity<T>>(entityName: string): SnapshotGenerator<T>;
    /**
     * @internal Highly performance-sensitive method.
     */
    getResultMapper<T extends AnyEntity<T>>(entityName: string): ResultMapper<T>;
    private getPropertyCondition;
    private getEmbeddedArrayPropertySnapshot;
    /**
     * we need to serialize only object embeddables, and only the top level ones, so root object embeddable
     * properties and first child nested object embeddables with inlined parent
     */
    private shouldSerialize;
    private getEmbeddedPropertySnapshot;
    private getPropertySnapshot;
    /**
     * @internal Highly performance-sensitive method.
     */
    getEntityComparator<T>(entityName: string): Comparator<T>;
    private getGenericComparator;
    private getPropertyComparator;
    /**
     * perf: used to generate list of comparable properties during discovery, so we speed up the runtime comparison
     */
    static isComparable<T extends AnyEntity<T>>(prop: EntityProperty<T>, root: EntityMetadata): boolean;
}
export {};
