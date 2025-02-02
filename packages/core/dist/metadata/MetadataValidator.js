"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataValidator = void 0;
const utils_1 = require("../utils");
const errors_1 = require("../errors");
const enums_1 = require("../enums");
/**
 * @internal
 */
class MetadataValidator {
    /**
     * Validate there is only one property decorator. This disallows using `@Property()` together with e.g. `@ManyToOne()`
     * on the same property. One should use only `@ManyToOne()` in such case.
     * We allow the existence of the property in metadata if the reference type is the same, this should allow things like HMR to work.
     */
    static validateSingleDecorator(meta, propertyName, reference) {
        if (meta.properties[propertyName] && meta.properties[propertyName].reference !== reference) {
            throw errors_1.MetadataError.multipleDecorators(meta.className, propertyName);
        }
    }
    validateEntityDefinition(metadata, name) {
        var _a, _b;
        const meta = metadata.get(name);
        // entities have PK
        if (!meta.embeddable && (!meta.primaryKeys || meta.primaryKeys.length === 0)) {
            throw errors_1.MetadataError.fromMissingPrimaryKey(meta);
        }
        this.validateVersionField(meta);
        this.validateIndexes(meta, (_a = meta.indexes) !== null && _a !== void 0 ? _a : [], 'index');
        this.validateIndexes(meta, (_b = meta.uniques) !== null && _b !== void 0 ? _b : [], 'unique');
        const references = Object.values(meta.properties).filter(prop => prop.reference !== enums_1.ReferenceType.SCALAR);
        for (const prop of references) {
            this.validateReference(meta, prop, metadata);
            this.validateBidirectional(meta, prop, metadata);
        }
    }
    validateDiscovered(discovered, warnWhenNoEntities) {
        if (discovered.length === 0 && warnWhenNoEntities) {
            throw errors_1.MetadataError.noEntityDiscovered();
        }
        const duplicates = utils_1.Utils.findDuplicates(discovered.map(meta => meta.className));
        if (duplicates.length > 0) {
            throw errors_1.MetadataError.duplicateEntityDiscovered(duplicates);
        }
        // validate we found at least one entity (not just abstract/base entities)
        if (discovered.filter(meta => meta.name).length === 0 && warnWhenNoEntities) {
            throw errors_1.MetadataError.onlyAbstractEntitiesDiscovered();
        }
        // check for not discovered entities
        discovered.forEach(meta => Object.values(meta.properties).forEach(prop => {
            if (prop.reference !== enums_1.ReferenceType.SCALAR && !discovered.find(m => m.className === prop.type)) {
                throw errors_1.MetadataError.fromUnknownEntity(prop.type, `${meta.className}.${prop.name}`);
            }
        }));
    }
    validateReference(meta, prop, metadata) {
        // references do have types
        if (!prop.type) {
            throw errors_1.MetadataError.fromWrongTypeDefinition(meta, prop);
        }
        // references do have type of known entity
        if (!metadata.find(prop.type)) {
            throw errors_1.MetadataError.fromWrongTypeDefinition(meta, prop);
        }
    }
    validateBidirectional(meta, prop, metadata) {
        if (prop.inversedBy) {
            const inverse = metadata.get(prop.type).properties[prop.inversedBy];
            this.validateOwningSide(meta, prop, inverse, metadata);
        }
        else if (prop.mappedBy) {
            const inverse = metadata.get(prop.type).properties[prop.mappedBy];
            this.validateInverseSide(meta, prop, inverse, metadata);
        }
    }
    validateOwningSide(meta, prop, inverse, metadata) {
        var _a;
        // has correct `inversedBy` on owning side
        if (!inverse) {
            throw errors_1.MetadataError.fromWrongReference(meta, prop, 'inversedBy');
        }
        /* istanbul ignore next */
        const targetClassName = (_a = metadata.find(inverse.type)) === null || _a === void 0 ? void 0 : _a.root.className;
        // has correct `inversedBy` reference type
        if (inverse.type !== meta.className && targetClassName !== meta.root.className) {
            throw errors_1.MetadataError.fromWrongReference(meta, prop, 'inversedBy', inverse);
        }
        // inverse side is not defined as owner
        if (inverse.inversedBy) {
            throw errors_1.MetadataError.fromWrongOwnership(meta, prop, 'inversedBy');
        }
    }
    validateInverseSide(meta, prop, owner, metadata) {
        var _a;
        // has correct `mappedBy` on inverse side
        if (prop.mappedBy && !owner) {
            throw errors_1.MetadataError.fromWrongReference(meta, prop, 'mappedBy');
        }
        // has correct `mappedBy` reference type
        if (owner.type !== meta.className && ((_a = metadata.find(owner.type)) === null || _a === void 0 ? void 0 : _a.root.className) !== meta.root.className) {
            throw errors_1.MetadataError.fromWrongReference(meta, prop, 'mappedBy', owner);
        }
        // owning side is not defined as inverse
        if (owner.mappedBy) {
            throw errors_1.MetadataError.fromWrongOwnership(meta, prop, 'mappedBy');
        }
        // owning side is not defined as inverse
        const valid = [
            { owner: enums_1.ReferenceType.MANY_TO_ONE, inverse: enums_1.ReferenceType.ONE_TO_MANY },
            { owner: enums_1.ReferenceType.MANY_TO_MANY, inverse: enums_1.ReferenceType.MANY_TO_MANY },
            { owner: enums_1.ReferenceType.ONE_TO_ONE, inverse: enums_1.ReferenceType.ONE_TO_ONE },
        ];
        if (!valid.find(spec => spec.owner === owner.reference && spec.inverse === prop.reference)) {
            throw errors_1.MetadataError.fromWrongReferenceType(meta, owner, prop);
        }
    }
    validateIndexes(meta, indexes, type) {
        for (const index of indexes) {
            for (const prop of utils_1.Utils.asArray(index.properties)) {
                if (!(prop in meta.properties)) {
                    throw errors_1.MetadataError.unknownIndexProperty(meta, prop, type);
                }
            }
        }
    }
    validateVersionField(meta) {
        if (!meta.versionProperty) {
            return;
        }
        const props = Object.values(meta.properties).filter(p => p.version);
        if (props.length > 1) {
            throw errors_1.MetadataError.multipleVersionFields(meta, props.map(p => p.name));
        }
        const prop = meta.properties[meta.versionProperty];
        const type = prop.type.toLowerCase();
        if (type !== 'number' && type !== 'date' && !type.startsWith('timestamp') && !type.startsWith('datetime')) {
            throw errors_1.MetadataError.invalidVersionFieldType(meta);
        }
    }
}
exports.MetadataValidator = MetadataValidator;
