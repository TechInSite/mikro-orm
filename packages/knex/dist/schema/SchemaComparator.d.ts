import { Column, ForeignKey, Index, SchemaDifference, TableDifference } from '../typings';
import { DatabaseSchema } from './DatabaseSchema';
import { DatabaseTable } from './DatabaseTable';
import { AbstractSqlPlatform } from '../AbstractSqlPlatform';
/**
 * Compares two Schemas and return an instance of SchemaDifference.
 */
export declare class SchemaComparator {
    private readonly platform;
    private readonly helper;
    constructor(platform: AbstractSqlPlatform);
    /**
     * Returns a SchemaDifference object containing the differences between the schemas fromSchema and toSchema.
     *
     * The returned differences are returned in such a way that they contain the
     * operations to change the schema stored in fromSchema to the schema that is
     * stored in toSchema.
     */
    compare(fromSchema: DatabaseSchema, toSchema: DatabaseSchema): SchemaDifference;
    /**
     * Returns the difference between the tables fromTable and toTable.
     * If there are no differences this method returns the boolean false.
     */
    diffTable(fromTable: DatabaseTable, toTable: DatabaseTable): TableDifference | false;
    /**
     * Try to find columns that only changed their name, rename operations maybe cheaper than add/drop
     * however ambiguities between different possibilities should not lead to renaming at all.
     */
    private detectColumnRenamings;
    /**
     * Try to find indexes that only changed their name, rename operations maybe cheaper than add/drop
     * however ambiguities between different possibilities should not lead to renaming at all.
     */
    private detectIndexRenamings;
    diffForeignKey(key1: ForeignKey, key2: ForeignKey): boolean;
    /**
     * Returns the difference between the columns
     * If there are differences this method returns field2, otherwise the boolean false.
     */
    diffColumn(column1: Column, column2: Column): Set<string>;
    diffComment(comment1?: string, comment2?: string): boolean;
    /**
     * Finds the difference between the indexes index1 and index2.
     * Compares index1 with index2 and returns index2 if there are any differences or false in case there are no differences.
     */
    diffIndex(index1: Index, index2: Index): boolean;
    /**
     * Checks if the other index already fulfills all the indexing and constraint needs of the current one.
     */
    isIndexFulfilledBy(index1: Index, index2: Index): boolean;
    hasSameDefaultValue(from: Column, to: Column): boolean;
    private mapColumnToProperty;
}
