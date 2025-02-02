import { AnyEntity, EntityData, EntityProperty, FilterQuery, Primary } from '../typings';
import { Collection, Reference } from '../entity';
import { ChangeSet } from './ChangeSet';
import { EntityManager } from '../EntityManager';
import { LockMode } from '../enums';
import { IdentityMap } from './IdentityMap';
export declare class UnitOfWork {
    private readonly em;
    /** map of references to managed entities */
    private readonly identityMap;
    private readonly persistStack;
    private readonly removeStack;
    private readonly orphanRemoveStack;
    private readonly changeSets;
    private readonly collectionUpdates;
    private readonly collectionDeletions;
    private readonly extraUpdates;
    private readonly metadata;
    private readonly platform;
    private readonly eventManager;
    private readonly comparator;
    private readonly changeSetComputer;
    private readonly changeSetPersister;
    private working;
    constructor(em: EntityManager);
    merge<T extends AnyEntity<T>>(entity: T, visited?: WeakSet<AnyEntity>): void;
    /**
     * @internal
     */
    registerManaged<T extends AnyEntity<T>>(entity: T, data?: EntityData<T>, refresh?: boolean, newEntity?: boolean): T;
    /**
     * Returns entity from the identity map. For composite keys, you need to pass an array of PKs in the same order as they are defined in `meta.primaryKeys`.
     */
    getById<T extends AnyEntity<T>>(entityName: string, id: Primary<T> | Primary<T>[]): T | undefined;
    tryGetById<T extends AnyEntity<T>>(entityName: string, where: FilterQuery<T>, strict?: boolean): T | null;
    /**
     * Returns map of all managed entities.
     */
    getIdentityMap(): IdentityMap;
    /**
     * @deprecated use `uow.getOriginalEntityData(entity)`
     */
    getOriginalEntityData<T extends AnyEntity<T>>(): AnyEntity[];
    /**
     * Returns stored snapshot of entity state that is used for change set computation.
     */
    getOriginalEntityData<T extends AnyEntity<T>>(entity: T): EntityData<T> | undefined;
    getPersistStack(): Set<AnyEntity>;
    getRemoveStack(): Set<AnyEntity>;
    getChangeSets(): ChangeSet<AnyEntity>[];
    getCollectionUpdates(): Collection<AnyEntity>[];
    getExtraUpdates(): Set<[AnyEntity, string | string[], (AnyEntity | AnyEntity[] | Reference<any> | Collection<any>)]>;
    computeChangeSet<T extends AnyEntity<T>>(entity: T): void;
    recomputeSingleChangeSet<T extends AnyEntity<T>>(entity: T): void;
    persist<T extends AnyEntity<T>>(entity: T, visited?: WeakSet<AnyEntity<any>>, checkRemoveStack?: boolean): void;
    remove(entity: AnyEntity, visited?: WeakSet<AnyEntity<any>>): void;
    commit(): Promise<void>;
    lock<T extends AnyEntity<T>>(entity: T, mode?: LockMode, version?: number | Date, tables?: string[]): Promise<void>;
    clear(): void;
    unsetIdentity(entity: AnyEntity): void;
    computeChangeSets(): void;
    scheduleExtraUpdate<T>(changeSet: ChangeSet<T>, props: EntityProperty<T>[]): void;
    scheduleOrphanRemoval(entity?: AnyEntity): void;
    cancelOrphanRemoval(entity: AnyEntity): void;
    /**
     * Schedules a complete collection for removal when this UnitOfWork commits.
     */
    scheduleCollectionDeletion(collection: Collection<AnyEntity>): void;
    /**
     * Gets the currently scheduled complete collection deletions
     */
    getScheduledCollectionDeletions(): Collection<AnyEntity<any>, unknown>[];
    private findNewEntities;
    private checkUniqueProps;
    private checkOrphanRemoval;
    private initIdentifier;
    private processReference;
    private processToOneReference;
    private processToManyReference;
    private runHooks;
    private postCommitCleanup;
    private cascade;
    private cascadeReference;
    private isCollectionSelfReferenced;
    private shouldCascade;
    private lockPessimistic;
    private lockOptimistic;
    private fixMissingReference;
    private persistToDatabase;
    private commitCreateChangeSets;
    private findExtraUpdates;
    private commitUpdateChangeSets;
    private commitDeleteChangeSets;
    /**
     * Orders change sets so FK constrains are maintained, ensures stable order (needed for node < 11)
     */
    private getChangeSetGroups;
    private getCommitOrder;
    private resetTransaction;
    /**
     * Takes snapshots of all processed collections
     */
    private takeCollectionSnapshots;
}
