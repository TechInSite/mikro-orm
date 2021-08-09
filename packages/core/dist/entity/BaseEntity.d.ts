import { EntityData, EntityDTO, IWrappedEntity, Populate } from '../typings';
import { AssignOptions } from './EntityAssigner';
export declare abstract class BaseEntity<T, PK extends keyof T, P extends Populate<T> | unknown = unknown> implements IWrappedEntity<T, PK, P> {
    constructor();
    isInitialized(): boolean;
    populated(populated?: boolean): void;
    toReference(): any;
    toObject(ignoreFields?: string[]): EntityDTO<T>;
    toJSON(...args: any[]): EntityDTO<T>;
    toPOJO(): EntityDTO<T>;
    assign(data: EntityData<T>, options?: AssignOptions): T;
    init(populated?: boolean): Promise<T>;
}
