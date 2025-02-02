import { EntityMetadata } from '../typings';
import { ReferenceType } from '../enums';
import { MetadataStorage } from './MetadataStorage';
/**
 * @internal
 */
export declare class MetadataValidator {
    /**
     * Validate there is only one property decorator. This disallows using `@Property()` together with e.g. `@ManyToOne()`
     * on the same property. One should use only `@ManyToOne()` in such case.
     * We allow the existence of the property in metadata if the reference type is the same, this should allow things like HMR to work.
     */
    static validateSingleDecorator(meta: EntityMetadata, propertyName: string, reference: ReferenceType): void;
    validateEntityDefinition(metadata: MetadataStorage, name: string): void;
    validateDiscovered(discovered: EntityMetadata[], warnWhenNoEntities: boolean): void;
    private validateReference;
    private validateBidirectional;
    private validateOwningSide;
    private validateInverseSide;
    private validateIndexes;
    private validateVersionField;
}
