import 'reflect-metadata';
import { EntityMetadata, EntityProperty } from '../typings';
import { MetadataProvider } from './MetadataProvider';
export declare class ReflectMetadataProvider extends MetadataProvider {
    loadEntityMetadata(meta: EntityMetadata, name: string): Promise<void>;
    protected initPropertyType(meta: EntityMetadata, prop: EntityProperty): void;
}
