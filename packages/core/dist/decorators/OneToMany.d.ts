import { ReferenceOptions } from './Property';
import { ReferenceType, QueryOrder } from '../enums';
import { EntityName, AnyEntity } from '../typings';
export declare function createOneToDecorator<T, O>(entity: OneToManyOptions<T, O> | string | ((e?: any) => EntityName<T>), mappedBy: (string & keyof T) | ((e: T) => any) | undefined, options: Partial<OneToManyOptions<T, O>>, reference: ReferenceType): (target: AnyEntity, propertyName: string) => any;
export declare function OneToMany<T, O>(entity: string | ((e?: any) => EntityName<T>), mappedBy: (string & keyof T) | ((e: T) => any), options?: Partial<OneToManyOptions<T, O>>): (target: AnyEntity, propertyName: string) => void;
export declare function OneToMany<T, O>(options: OneToManyOptions<T, O>): (target: AnyEntity, propertyName: string) => void;
export declare type OneToManyOptions<T, O> = ReferenceOptions<T, O> & {
    entity?: string | (() => EntityName<T>);
    orphanRemoval?: boolean;
    orderBy?: {
        [field: string]: QueryOrder;
    };
    joinColumn?: string;
    joinColumns?: string[];
    inverseJoinColumn?: string;
    inverseJoinColumns?: string[];
    referenceColumnName?: string;
    mappedBy: (string & keyof T) | ((e: T) => any);
};
