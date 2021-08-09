import { AnyEntity, Dictionary, FilterQuery, PopulateOptions } from '../typings';
import { EntityManager } from '../EntityManager';
import { LoadStrategy, QueryOrderMap } from '../enums';
import { FieldsMap } from '../drivers/IDatabaseDriver';
export declare type EntityLoaderOptions<T> = {
    where?: FilterQuery<T>;
    fields?: (string | FieldsMap)[];
    orderBy?: QueryOrderMap;
    refresh?: boolean;
    validate?: boolean;
    lookup?: boolean;
    convertCustomTypes?: boolean;
    filters?: Dictionary<boolean | Dictionary> | string[] | boolean;
    strategy?: LoadStrategy;
};
export declare class EntityLoader {
    private readonly em;
    private readonly metadata;
    private readonly driver;
    constructor(em: EntityManager);
    /**
     * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
     */
    populate<T extends AnyEntity<T>>(entityName: string, entities: T[], populate: PopulateOptions<T>[] | boolean, options: EntityLoaderOptions<T>): Promise<void>;
    normalizePopulate<T>(entityName: string, populate: PopulateOptions<T>[] | true, strategy?: LoadStrategy, lookup?: boolean): PopulateOptions<T>[];
    /**
     * merge multiple populates for the same entity with different children
     */
    private mergeNestedPopulate;
    /**
     * Expands `books.perex` like populate to use `children` array instead of the dot syntax
     */
    private expandNestedPopulate;
    /**
     * preload everything in one call (this will update already existing references in IM)
     */
    private populateMany;
    private initializeCollections;
    private initializeOneToMany;
    private initializeManyToMany;
    private findChildren;
    private populateField;
    private findChildrenFromPivotTable;
    private extractChildCondition;
    private buildFields;
    private getChildReferences;
    private filterCollections;
    private filterReferences;
    private lookupAllRelationships;
    private lookupEagerLoadedRelationships;
}
