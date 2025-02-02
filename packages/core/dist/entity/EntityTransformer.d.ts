import { AnyEntity, EntityData, PopulateOptions } from '../typings';
/**
 * Helper that allows to keep track of where we are currently at when serializing complex entity graph with cycles.
 * Before we process a property, we call `visit` that checks if it is not a cycle path (but allows to pass cycles that
 * are defined in populate hint). If not, we proceed and call `leave` afterwards.
 */
export declare class SerializationContext<T extends AnyEntity<T>> {
    private readonly populate;
    readonly path: [string, string][];
    constructor(populate: PopulateOptions<T>[]);
    visit(entityName: string, prop: string): boolean;
    leave<U>(entityName: string, prop: string): void;
    /**
     * When initializing new context, we need to propagate it to the whole entity graph recursively.
     */
    static propagate(root: SerializationContext<AnyEntity>, entity: AnyEntity): void;
    private isMarkedAsPopulated;
}
export declare class EntityTransformer {
    static toObject<T extends AnyEntity<T>>(entity: T, ignoreFields?: string[], raw?: boolean): EntityData<T>;
    private static isVisible;
    private static propertyName;
    private static processProperty;
    private static processEntity;
    private static processCollection;
}
