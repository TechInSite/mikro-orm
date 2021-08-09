import { CriteriaNode } from './CriteriaNode';
import { IQueryBuilder } from '../typings';
/**
 * @internal
 */
export declare class ArrayCriteriaNode extends CriteriaNode {
    process<T>(qb: IQueryBuilder<T>, alias?: string): any;
    willAutoJoin<T>(qb: IQueryBuilder<T>, alias?: string): any;
    getPath(): string;
}
