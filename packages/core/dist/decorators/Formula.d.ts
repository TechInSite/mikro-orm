import { AnyEntity } from '../typings';
import { PropertyOptions } from './Property';
export declare function Formula<T>(formula: string | ((alias: string) => string), options?: FormulaOptions<T>): (target: AnyEntity, propertyName: string) => any;
export interface FormulaOptions<T> extends PropertyOptions<T> {
}
