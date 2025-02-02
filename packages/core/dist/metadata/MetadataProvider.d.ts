import { EntityMetadata, EntityProperty } from '../typings';
export interface IConfiguration {
    get(key: string, defaultValue?: any): any;
}
export declare abstract class MetadataProvider {
    protected readonly config: IConfiguration;
    constructor(config: IConfiguration);
    abstract loadEntityMetadata(meta: EntityMetadata, name: string): Promise<void>;
    loadFromCache(meta: EntityMetadata, cache: EntityMetadata): void;
    useCache(): boolean;
    protected initProperties(meta: EntityMetadata, fallback: (prop: EntityProperty) => void | Promise<void>): Promise<void>;
}
