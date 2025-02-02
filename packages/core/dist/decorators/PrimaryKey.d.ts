import { PropertyOptions } from './Property';
import { AnyEntity } from '../typings';
export declare function PrimaryKey<T>(options?: PrimaryKeyOptions<T>): (target: AnyEntity<any>, propertyName: string) => any;
export declare function SerializedPrimaryKey<T>(options?: SerializedPrimaryKeyOptions<T>): (target: AnyEntity<any>, propertyName: string) => any;
export interface PrimaryKeyOptions<T> extends PropertyOptions<T> {
}
export interface SerializedPrimaryKeyOptions<T> extends PropertyOptions<T> {
    type?: any;
}
