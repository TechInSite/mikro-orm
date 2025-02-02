import { Type } from './Type';
import { Platform } from '../platforms';
import { EntityProperty } from '../typings';
export declare class FloatType extends Type<number | null | undefined, number | null | undefined> {
    getColumnType(prop: EntityProperty, platform: Platform): string;
    compareAsType(): string;
}
