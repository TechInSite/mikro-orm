import { AnyEntity, Cast, Dictionary, EntityProperty, IsUnknown, PrimaryProperty } from '../typings';
export declare type IdentifiedReference<T extends AnyEntity<T>, PK extends keyof T | unknown = PrimaryProperty<T>> = true extends IsUnknown<PK> ? Reference<T> : ({
    [K in Cast<PK, keyof T>]: T[K];
} & Reference<T>);
export declare class Reference<T extends AnyEntity<T>> {
    private entity;
    constructor(entity: T);
    static create<T extends AnyEntity<T>, PK extends keyof T | unknown = PrimaryProperty<T>>(entity: T | IdentifiedReference<T, PK>): IdentifiedReference<T, PK>;
    /**
     * Checks whether the argument is instance or `Reference` wrapper.
     */
    static isReference<T extends AnyEntity<T>>(data: any): data is Reference<T>;
    /**
     * Wraps the entity in a `Reference` wrapper if the property is defined as `wrappedReference`.
     */
    static wrapReference<T extends AnyEntity<T>>(entity: T | Reference<T>, prop: EntityProperty<T>): Reference<T> | T;
    /**
     * Returns wrapped entity.
     */
    static unwrapReference<T extends AnyEntity<T>>(ref: T | Reference<T>): T;
    /**
     * Ensures the underlying entity is loaded first (without reloading it if it already is loaded).
     * Returns the entity.
     */
    load(): Promise<T>;
    /**
     * Ensures the underlying entity is loaded first (without reloading it if it already is loaded).
     * Returns the requested property instead of the whole entity.
     */
    load<K extends keyof T>(prop: K): Promise<T[K]>;
    set(entity: T | IdentifiedReference<T>): void;
    unwrap(): T;
    getEntity(): T;
    getProperty<K extends keyof T>(prop: K): T[K];
    isInitialized(): boolean;
    populated(populated?: boolean): void;
    toJSON(...args: any[]): Dictionary;
}
