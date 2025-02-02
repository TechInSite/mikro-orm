/// <reference types="node" />
import { GlobbyOptions } from 'globby';
import { AnyEntity, Dictionary, EntityDictionary, EntityMetadata, EntityName, EntityProperty, IMetadataStorage, Primary } from '../typings';
import { ReferenceType } from '../enums';
import { Collection } from '../entity';
import { Platform } from '../platforms';
export declare const ObjectBindingPattern: unique symbol;
export declare function compareObjects(a: any, b: any): boolean;
export declare function compareArrays(a: any[], b: any[]): boolean;
export declare function compareBuffers(a: Buffer, b: Buffer): boolean;
/**
 * Checks if arguments are deeply (but not strictly) equal.
 */
export declare function equals(a: any, b: any): boolean;
export declare class Utils {
    static readonly PK_SEPARATOR = "~~~";
    /**
     * Checks if the argument is not undefined
     */
    static isDefined<T = Record<string, unknown>>(data: any, considerNullUndefined?: boolean): data is T;
    /**
     * Checks if the argument is instance of `Object`. Returns false for arrays.
     */
    static isObject<T = Dictionary>(o: any): o is T;
    /**
     * Checks if the argument is instance of `Object`, but not one of the blacklisted types. Returns false for arrays.
     */
    static isNotObject<T = Dictionary>(o: any, not: any[]): o is T;
    /**
     * Removes `undefined` properties (recursively) so they are not saved as nulls
     */
    static dropUndefinedProperties<T = Dictionary | unknown[]>(o: any): void;
    /**
     * Returns the number of properties on `obj`. This is 20x faster than Object.keys(obj).length.
     * @see https://github.com/deepkit/deepkit-framework/blob/master/packages/core/src/core.ts
     */
    static getObjectKeysSize(object: Dictionary): number;
    /**
     * Returns true if `obj` has at least one property. This is 20x faster than Object.keys(obj).length.
     * @see https://github.com/deepkit/deepkit-framework/blob/master/packages/core/src/core.ts
     */
    static hasObjectKeys(object: Dictionary): boolean;
    /**
     * Checks if the argument is string
     */
    static isString(s: any): s is string;
    /**
     * Checks if the argument is number
     */
    static isNumber<T = number>(s: any): s is T;
    /**
     * Checks if arguments are deeply (but not strictly) equal.
     */
    static equals(a: any, b: any): boolean;
    /**
     * Gets array without duplicates.
     */
    static unique<T = string>(items: T[]): T[];
    /**
     * Merges all sources into the target recursively.
     */
    static merge(target: any, ...sources: any[]): any;
    static getRootEntity(metadata: IMetadataStorage, meta: EntityMetadata): EntityMetadata;
    /**
     * Computes difference between two objects, ignoring items missing in `b`.
     */
    static diff(a: Dictionary, b: Dictionary): Record<keyof (typeof a & typeof b), any>;
    /**
     * Creates deep copy of given object.
     */
    static copy<T>(entity: T): T;
    /**
     * Normalize the argument to always be an array.
     */
    static asArray<T>(data?: T | T[], strict?: boolean): T[];
    /**
     * Renames object key, keeps order of properties.
     */
    static renameKey<T>(payload: T, from: string | keyof T, to: string): void;
    /**
     * Returns array of functions argument names. Uses `escaya` for source code analysis.
     */
    static getParamNames(func: {
        toString(): string;
    } | string, methodName?: string): string[];
    private static walkNode;
    /**
     * Checks whether the argument looks like primary key (string, number or ObjectId).
     */
    static isPrimaryKey<T>(key: any, allowComposite?: boolean): key is Primary<T>;
    /**
     * Extracts primary key from `data`. Accepts objects or primary keys directly.
     */
    static extractPK<T extends AnyEntity<T>>(data: any, meta?: EntityMetadata<T>, strict?: boolean): Primary<T> | string | null;
    static getCompositeKeyHash<T extends AnyEntity<T>>(entity: T, meta: EntityMetadata<T>): string;
    static getPrimaryKeyHash(pks: string[]): string;
    static splitPrimaryKeys(key: string): string[];
    static getPrimaryKeyValues<T extends AnyEntity<T>>(entity: T, primaryKeys: string[], allowScalar?: boolean, convertCustomTypes?: boolean): any;
    static getPrimaryKeyCond<T extends AnyEntity<T>>(entity: T, primaryKeys: string[]): Record<string, Primary<T>> | null;
    static getPrimaryKeyCondFromArray<T extends AnyEntity<T>>(pks: Primary<T>[], primaryKeys: string[]): Record<string, Primary<T>>;
    static getOrderedPrimaryKeys<T extends AnyEntity<T>>(id: Primary<T> | Record<string, Primary<T>>, meta: EntityMetadata<T>, platform?: Platform, convertCustomTypes?: boolean): Primary<T>[];
    /**
     * Checks whether given object is an entity instance.
     */
    static isEntity<T = AnyEntity>(data: any, allowReference?: boolean): data is T;
    /**
     * Checks whether the argument is ObjectId instance
     */
    static isObjectID(key: any): boolean;
    /**
     * Checks whether the argument is empty (array without items, object without keys or falsy value).
     */
    static isEmpty(data: any): boolean;
    /**
     * Gets string name of given class.
     */
    static className<T>(classOrName: EntityName<T>): string;
    /**
     * Tries to detect `ts-node` runtime.
     */
    static detectTsNode(): boolean;
    /**
     * Uses some dark magic to get source path to caller where decorator is used.
     * Analyses stack trace of error created inside the function call.
     */
    static lookupPathFromDecorator(name: string, stack?: string[]): string;
    /**
     * Gets the type of the argument.
     */
    static getObjectType(value: any): string;
    /**
     * Checks whether the value is POJO (e.g. `{ foo: 'bar' }`, and not instance of `Foo`)
     */
    static isPlainObject(value: any): value is Dictionary;
    /**
     * Executes the `cb` promise serially on every element of the `items` array and returns array of resolved values.
     */
    static runSerial<T = any, U = any>(items: Iterable<U>, cb: (item: U) => Promise<T>): Promise<T[]>;
    static isCollection<T, O = unknown>(item: any, prop?: EntityProperty<T>, type?: ReferenceType): item is Collection<T, O>;
    static normalizePath(...parts: string[]): string;
    static relativePath(path: string, relativeTo: string): string;
    static absolutePath(path: string, baseDir?: string): string;
    static hash(data: string): string;
    static runIfNotEmpty(clause: () => any, data: any): void;
    static defaultValue<T extends Dictionary>(prop: T, option: keyof T, defaultValue: any): void;
    static findDuplicates<T>(items: T[]): T[];
    static randomInt(min: number, max: number): number;
    static pathExists(path: string, options?: GlobbyOptions): Promise<boolean>;
    /**
     * Extracts all possible values of a TS enum. Works with both string and numeric enums.
     */
    static extractEnumValues(target: Dictionary): (string | number)[];
    static flatten<T>(arrays: T[][]): T[];
    static isOperator(key: string, includeGroupOperators?: boolean): boolean;
    static isGroupOperator(key: string): boolean;
    static getGlobalStorage(namespace: string): Dictionary;
    /**
     * Require a module from a specific location
     * @param id The module to require
     * @param from Location to start the node resolution
     */
    static requireFrom(id: string, from: string): any;
    static getORMVersion(): string;
    static createFunction(context: Map<string, any>, code: string): any;
    static callCompiledFunction<T extends unknown[], R>(fn: (...args: T) => R, ...args: T): R;
    /**
     * @see https://github.com/mikro-orm/mikro-orm/issues/840
     */
    static propertyDecoratorReturnValue(): any;
    static unwrapProperty<T>(entity: T, meta: EntityMetadata<T>, prop: EntityProperty<T>, payload?: boolean): [unknown, number[]][];
    static setPayloadProperty<T>(entity: EntityDictionary<T>, meta: EntityMetadata<T>, prop: EntityProperty<T>, value: unknown, idx?: number[]): void;
    static tryRequire<T = any>({ module, from, allowError, warning }: {
        module: string;
        warning: string;
        from?: string;
        allowError?: string;
    }): T | undefined;
}
