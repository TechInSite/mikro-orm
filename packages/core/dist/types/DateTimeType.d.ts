import { Type } from './Type';
import { Platform } from '../platforms';
import { EntityProperty } from '../typings';
export declare class DateTimeType extends Type<Date, string> {
    getColumnType(prop: EntityProperty, platform: Platform): string;
    compareAsType(): string;
}
