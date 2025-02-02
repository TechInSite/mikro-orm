import { SourceFile } from 'ts-morph';
import { EntityMetadata, MetadataProvider } from '@mikro-orm/core';
export declare class TsMorphMetadataProvider extends MetadataProvider {
    private readonly project;
    private sources;
    useCache(): boolean;
    loadEntityMetadata(meta: EntityMetadata, name: string): Promise<void>;
    getExistingSourceFile(path: string, ext?: string, validate?: boolean): Promise<SourceFile>;
    /**
     * Re-hydrates missing attributes like `customType` (functions/instances are lost when caching to JSON)
     */
    loadFromCache(meta: EntityMetadata, cache: EntityMetadata): void;
    protected initProperties(meta: EntityMetadata): Promise<void>;
    private extractType;
    private initPropertyType;
    private readTypeFromSource;
    private getSourceFile;
    private processWrapper;
    private initSourceFiles;
}
