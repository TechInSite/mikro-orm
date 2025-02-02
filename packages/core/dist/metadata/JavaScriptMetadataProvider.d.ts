import { MetadataProvider } from './MetadataProvider';
import { EntityMetadata } from '../typings';
/**
 * @deprecated use EntitySchema instead
 */
export declare class JavaScriptMetadataProvider extends MetadataProvider {
    loadEntityMetadata(meta: EntityMetadata, name: string): Promise<void>;
    /**
     * Re-hydrates missing attributes like `onUpdate` (functions are lost when caching to JSON)
     */
    loadFromCache(meta: EntityMetadata, cache: EntityMetadata): void;
    private initProperty;
    private getSchema;
}
