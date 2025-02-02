import { OneToManyOptions } from './OneToMany';
import { EntityName } from '../typings';
export declare function OneToOne<T, O>(entity?: OneToOneOptions<T, O> | string | ((e?: any) => EntityName<T>), mappedBy?: (string & keyof T) | ((e: T) => any), options?: Partial<OneToOneOptions<T, O>>): (target: import("../typings").AnyEntity<any>, propertyName: string) => any;
export interface OneToOneOptions<T, O> extends Partial<Omit<OneToManyOptions<T, O>, 'orderBy'>> {
    owner?: boolean;
    inversedBy?: (string & keyof T) | ((e: T) => any);
    wrappedReference?: boolean;
    primary?: boolean;
    mapToPk?: boolean;
    onDelete?: 'cascade' | 'no action' | 'set null' | 'set default' | string;
    onUpdateIntegrity?: 'cascade' | 'no action' | 'set null' | 'set default' | string;
}
