import { AnyEntity, EntityData, EntityMetadata, EntityProperty, FilterQuery } from '../typings';
export declare class EntityValidator {
    private strict;
    constructor(strict: boolean);
    validate<T extends AnyEntity<T>>(entity: T, payload: any, meta: EntityMetadata): void;
    validateProperty<T extends AnyEntity<T>>(prop: EntityProperty, givenValue: any, entity: T): any;
    validateParams(params: any, type?: string, field?: string): void;
    validatePrimaryKey<T extends AnyEntity<T>>(entity: EntityData<T>, meta: EntityMetadata): void;
    validateEmptyWhere<T extends AnyEntity<T>>(where: FilterQuery<T>): void;
    private getValue;
    private setValue;
    private validateCollection;
    private fixTypes;
    private fixDateType;
    private fixNumberType;
    private fixBooleanType;
}
