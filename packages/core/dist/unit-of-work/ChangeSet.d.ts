import { EntityData, AnyEntity, EntityMetadata, EntityDictionary, Primary } from '../typings';
export declare class ChangeSet<T extends AnyEntity<T>> {
    entity: T;
    type: ChangeSetType;
    payload: EntityDictionary<T>;
    private primaryKey?;
    constructor(entity: T, type: ChangeSetType, payload: EntityDictionary<T>, meta: EntityMetadata<T>);
    getPrimaryKey(): Primary<T> | Primary<T>[] | null;
}
export interface ChangeSet<T extends AnyEntity<T>> {
    name: string;
    rootName: string;
    collection: string;
    type: ChangeSetType;
    entity: T;
    payload: EntityDictionary<T>;
    persisted: boolean;
    originalEntity?: EntityData<T>;
}
export declare enum ChangeSetType {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}
