import { Dictionary, FilterQuery, Populate } from '../typings';
import { ArrayCollection } from './ArrayCollection';
import { QueryOrderMap } from '../enums';
import { Reference } from './Reference';
import { Transaction } from '../connections/Connection';
import { FindOptions } from '../drivers/IDatabaseDriver';
export interface MatchingOptions<T, P extends Populate<T> = Populate<T>> extends FindOptions<T, P> {
    where?: FilterQuery<T>;
    store?: boolean;
    ctx?: Transaction;
}
export declare class Collection<T, O = unknown> extends ArrayCollection<T, O> {
    private snapshot;
    private dirty;
    private readonly?;
    private _populated;
    private _lazyInitialized;
    constructor(owner: O, items?: T[], initialized?: boolean);
    /**
     * Creates new Collection instance, assigns it to the owning entity and sets the items to it (propagating them to their inverse sides)
     */
    static create<T, O = any>(owner: O, prop: keyof O, items: undefined | T[], initialized: boolean): Collection<T, O>;
    /**
     * Initializes the collection and returns the items
     */
    loadItems(): Promise<T[]>;
    /**
     * Gets the count of collection items from database instead of counting loaded items.
     * The value is cached, use `refresh = true` to force reload it.
     */
    loadCount(refresh?: boolean): Promise<number>;
    matching(options: MatchingOptions<T>): Promise<T[]>;
    /**
     * Returns the items (the collection must be initialized)
     */
    getItems(check?: boolean): T[];
    toJSON(): Dictionary[];
    add(...items: (T | Reference<T>)[]): void;
    set(items: (T | Reference<T>)[]): void;
    /**
     * @internal
     */
    hydrate(items: T[]): void;
    removeAll(): void;
    remove(...items: (T | Reference<T>)[]): void;
    contains(item: (T | Reference<T>), check?: boolean): boolean;
    count(): number;
    shouldPopulate(): boolean;
    populated(populated?: boolean): void;
    isDirty(): boolean;
    setDirty(dirty?: boolean): void;
    init(options?: InitOptions<T>): Promise<this>;
    init(populate?: string[], where?: FilterQuery<T>, orderBy?: QueryOrderMap): Promise<this>;
    /**
     * @internal
     */
    takeSnapshot(): void;
    /**
     * @internal
     */
    getSnapshot(): T[] | undefined;
    private getEntityManager;
    private createCondition;
    private createOrderBy;
    private createManyToManyCondition;
    private createLoadCountCondition;
    private modify;
    private checkInitialized;
    /**
     * re-orders items after searching with `$in` operator
     */
    private reorderItems;
    private cancelOrphanRemoval;
    private validateItemType;
    private validateModification;
}
export interface InitOptions<T> {
    populate?: Populate<T>;
    orderBy?: QueryOrderMap;
    where?: FilterQuery<T>;
}
