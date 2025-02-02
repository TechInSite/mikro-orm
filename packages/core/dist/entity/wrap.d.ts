import { IWrappedEntity, IWrappedEntityInternal, PrimaryProperty } from '../typings';
/**
 * returns WrappedEntity instance associated with this entity. This includes all the internal properties like `__meta` or `__em`.
 */
export declare function wrap<T, PK extends keyof T | unknown = PrimaryProperty<T>>(entity: T, preferHelper: true): IWrappedEntityInternal<T, PK>;
/**
 * wraps entity type with WrappedEntity internal properties and helpers like init/isInitialized/populated/toJSON
 */
export declare function wrap<T, PK extends keyof T | unknown = PrimaryProperty<T>>(entity: T, preferHelper?: false): IWrappedEntity<T, PK>;
