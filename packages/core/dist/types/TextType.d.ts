import { Type } from './Type';
import { Platform } from '../platforms';
import { EntityProperty } from '../typings';
export declare class TextType extends Type<string | null | undefined, string | null | undefined> {
    getColumnType(prop: EntityProperty, platform: Platform): string;
    compareAsType(): string;
}
