import { Type } from './Type';
import { Platform } from '../platforms';
import { EntityProperty } from '../typings';
/**
 * This type will automatically convert string values returned from the database to native JS bigints.
 */
export declare class BigIntType extends Type<string | bigint | null | undefined, string | null | undefined> {
    convertToDatabaseValue(value: string | bigint | null | undefined): string | null | undefined;
    convertToJSValue(value: string | bigint | null | undefined): string | null | undefined;
    getColumnType(prop: EntityProperty, platform: Platform): string;
    compareAsType(): string;
}
