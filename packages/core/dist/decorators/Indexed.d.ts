import { AnyEntity, Dictionary } from '../typings';
export declare function Index<T>(options?: IndexOptions<T>): (target: AnyEntity<any>, propertyName?: string | undefined) => any;
export declare function Unique<T>(options?: UniqueOptions<T>): (target: AnyEntity<any>, propertyName?: string | undefined) => any;
export interface UniqueOptions<T extends AnyEntity<T>> {
    name?: string;
    properties?: keyof T | (keyof T)[];
    options?: Dictionary;
}
export interface IndexOptions<T extends AnyEntity<T>> extends UniqueOptions<T> {
    type?: string;
    expression?: string;
}
