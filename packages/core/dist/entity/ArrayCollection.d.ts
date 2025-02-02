import { AnyEntity, Dictionary, EntityProperty, IPrimaryKey, Primary } from '../typings';
import { Reference } from './Reference';
export declare class ArrayCollection<T, O> {
    readonly owner: O & AnyEntity<O>;
    [k: number]: T;
    protected readonly items: Set<T>;
    protected initialized: boolean;
    protected _count?: number;
    private _property?;
    constructor(owner: O & AnyEntity<O>, items?: T[]);
    loadCount(): Promise<number>;
    getItems(): T[];
    toArray(): Dictionary[];
    toJSON(): Dictionary[];
    getIdentifiers<U extends IPrimaryKey = Primary<T> & IPrimaryKey>(field?: string): U[];
    add(...items: (T | Reference<T>)[]): void;
    set(items: (T | Reference<T>)[]): void;
    /**
     * @internal
     */
    hydrate(items: T[]): void;
    remove(...items: (T | Reference<T>)[]): void;
    removeAll(): void;
    contains(item: T | Reference<T>, check?: boolean): boolean;
    count(): number;
    isInitialized(fully?: boolean): boolean;
    get length(): number;
    [Symbol.iterator](): IterableIterator<T>;
    /**
     * @internal
     */
    get property(): EntityProperty<T>;
    protected propagate(item: T, method: 'add' | 'remove'): void;
    protected propagateToInverseSide(item: T, method: 'add' | 'remove'): void;
    protected propagateToOwningSide(item: T, method: 'add' | 'remove'): void;
    protected shouldPropagateToCollection(collection: ArrayCollection<O, T>, method: 'add' | 'remove'): boolean;
    protected incrementCount(value: number): void;
}
