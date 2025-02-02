import { ArrayType } from './ArrayType';
import { Platform } from '../platforms';
export declare class EnumArrayType<T extends string | number = string> extends ArrayType<T> {
    private readonly owner;
    private readonly items?;
    constructor(owner: string, items?: T[] | undefined, hydrate?: (i: string) => T);
    convertToDatabaseValue(value: T[] | null, platform: Platform, fromQuery?: boolean): string | null;
}
