"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assign = exports.EntityAssigner = void 0;
const util_1 = require("util");
const Utils_1 = require("../utils/Utils");
const Reference_1 = require("./Reference");
const enums_1 = require("../enums");
const EntityValidator_1 = require("./EntityValidator");
const wrap_1 = require("./wrap");
const validator = new EntityValidator_1.EntityValidator(false);
class EntityAssigner {
    static assign(entity, data, options = {}) {
        options = Object.assign({ updateNestedEntities: true, updateByPrimaryKey: true }, options);
        const wrapped = entity.__helper;
        const meta = entity.__meta;
        const em = options.em || wrapped.__em;
        const props = meta.properties;
        Object.keys(data).forEach(prop => {
            var _a, _b, _c, _d;
            if (options.onlyProperties && !(prop in props)) {
                return;
            }
            let value = data[prop];
            if (props[prop] && !props[prop].nullable && (value === undefined || value === null)) {
                throw new Error(`You must pass a non-${value} value to the property ${prop} of entity ${entity.constructor.name}.`);
            }
            if (props[prop] && Utils_1.Utils.isCollection(entity[prop], props[prop]) && Array.isArray(value) && EntityAssigner.validateEM(em)) {
                return EntityAssigner.assignCollection(entity, entity[prop], value, props[prop], em, options);
            }
            /* istanbul ignore next */
            const customType = (_a = props[prop]) === null || _a === void 0 ? void 0 : _a.customType;
            if (options.convertCustomTypes && customType && props[prop].reference === enums_1.ReferenceType.SCALAR && !Utils_1.Utils.isEntity(data)) {
                value = props[prop].customType.convertToJSValue(value, entity.__platform);
            }
            if ([enums_1.ReferenceType.MANY_TO_ONE, enums_1.ReferenceType.ONE_TO_ONE].includes((_b = props[prop]) === null || _b === void 0 ? void 0 : _b.reference) && Utils_1.Utils.isDefined(value, true) && EntityAssigner.validateEM(em)) {
                // eslint-disable-next-line no-prototype-builtins
                if (options.updateNestedEntities && entity.hasOwnProperty(prop) && Utils_1.Utils.isEntity(entity[prop], true) && Utils_1.Utils.isPlainObject(value)) {
                    const unwrappedEntity = Reference_1.Reference.unwrapReference(entity[prop]);
                    if (options.updateByPrimaryKey) {
                        const pk = Utils_1.Utils.extractPK(value, props[prop].targetMeta);
                        if (pk) {
                            const ref = em.getReference(props[prop].type, pk);
                            if (ref.__helper.isInitialized()) {
                                return EntityAssigner.assign(ref, value, options);
                            }
                        }
                        return EntityAssigner.assignReference(entity, value, props[prop], em, options);
                    }
                    if (wrap_1.wrap(unwrappedEntity).isInitialized()) {
                        return EntityAssigner.assign(unwrappedEntity, value, options);
                    }
                }
                return EntityAssigner.assignReference(entity, value, props[prop], em, options);
            }
            if (((_c = props[prop]) === null || _c === void 0 ? void 0 : _c.reference) === enums_1.ReferenceType.SCALAR && enums_1.SCALAR_TYPES.includes(props[prop].type) && (props[prop].setter || !props[prop].getter)) {
                return entity[prop] = validator.validateProperty(props[prop], value, entity);
            }
            if (((_d = props[prop]) === null || _d === void 0 ? void 0 : _d.reference) === enums_1.ReferenceType.EMBEDDED) {
                return EntityAssigner.assignEmbeddable(entity, value, props[prop], em, options);
            }
            if (options.mergeObjects && Utils_1.Utils.isPlainObject(value)) {
                Utils_1.Utils.merge(entity[prop], value);
            }
            else if (!props[prop] || props[prop].setter || !props[prop].getter) {
                entity[prop] = value;
            }
        });
        return entity;
    }
    /**
     * auto-wire 1:1 inverse side with owner as in no-sql drivers it can't be joined
     * also makes sure the link is bidirectional when creating new entities from nested structures
     * @internal
     */
    static autoWireOneToOne(prop, entity) {
        if (prop.reference !== enums_1.ReferenceType.ONE_TO_ONE) {
            return;
        }
        const meta2 = entity[prop.name].__meta;
        const prop2 = meta2.properties[prop.inversedBy || prop.mappedBy];
        /* istanbul ignore next */
        if (prop2 && !entity[prop.name][prop2.name]) {
            if (Reference_1.Reference.isReference(entity[prop.name])) {
                entity[prop.name].unwrap()[prop2.name] = Reference_1.Reference.wrapReference(entity, prop2);
            }
            else {
                entity[prop.name][prop2.name] = Reference_1.Reference.wrapReference(entity, prop2);
            }
        }
    }
    static validateEM(em) {
        if (!em) {
            throw new Error(`To use assign() on not managed entities, explicitly provide EM instance: wrap(entity).assign(data, { em: orm.em })`);
        }
        return true;
    }
    static assignReference(entity, value, prop, em, options) {
        if (Utils_1.Utils.isEntity(value, true)) {
            entity[prop.name] = value;
        }
        else if (Utils_1.Utils.isPrimaryKey(value, true)) {
            entity[prop.name] = Reference_1.Reference.wrapReference(em.getReference(prop.type, value, false, options.convertCustomTypes), prop);
        }
        else if (Utils_1.Utils.isPlainObject(value) && options.merge) {
            entity[prop.name] = Reference_1.Reference.wrapReference(em.merge(prop.type, value), prop);
        }
        else if (Utils_1.Utils.isPlainObject(value)) {
            entity[prop.name] = Reference_1.Reference.wrapReference(em.create(prop.type, value), prop);
        }
        else {
            const name = entity.constructor.name;
            throw new Error(`Invalid reference value provided for '${name}.${prop.name}' in ${name}.assign(): ${JSON.stringify(value)}`);
        }
        EntityAssigner.autoWireOneToOne(prop, entity);
    }
    static assignCollection(entity, collection, value, prop, em, options) {
        const invalid = [];
        const items = value.map((item, idx) => {
            var _a;
            if (options.updateNestedEntities && options.updateByPrimaryKey && Utils_1.Utils.isPlainObject(item)) {
                const pk = Utils_1.Utils.extractPK(item, prop.targetMeta);
                if (pk) {
                    const ref = em.getReference(prop.type, pk);
                    /* istanbul ignore else */
                    if (ref.__helper.isInitialized()) {
                        return EntityAssigner.assign(ref, item, options);
                    }
                }
                return this.createCollectionItem(item, em, prop, invalid, options);
            }
            /* istanbul ignore next */
            if (options.updateNestedEntities && !options.updateByPrimaryKey && ((_a = collection[idx]) === null || _a === void 0 ? void 0 : _a.__helper.isInitialized())) {
                return EntityAssigner.assign(collection[idx], item, options);
            }
            return this.createCollectionItem(item, em, prop, invalid, options);
        });
        if (invalid.length > 0) {
            const name = entity.constructor.name;
            throw new Error(`Invalid collection values provided for '${name}.${prop.name}' in ${name}.assign(): ${util_1.inspect(invalid)}`);
        }
        collection.set(items);
    }
    static assignEmbeddable(entity, value, prop, em, options) {
        const Embeddable = prop.embeddable;
        const propName = prop.embedded ? prop.embedded[1] : prop.name;
        entity[propName] = prop.array || options.mergeObjects ? (entity[propName] || Object.create(Embeddable.prototype)) : Object.create(Embeddable.prototype);
        if (!value) {
            entity[propName] = value;
            return;
        }
        // if the value is not an array, we just push, otherwise we replace the array
        if (prop.array && (Array.isArray(value) || entity[propName] == null)) {
            entity[propName] = [];
        }
        if (prop.array) {
            return Utils_1.Utils.asArray(value).forEach(item => {
                const tmp = {};
                this.assignEmbeddable(tmp, item, Object.assign(Object.assign({}, prop), { array: false }), em, options);
                entity[propName].push(...Object.values(tmp));
            });
        }
        Object.keys(value).forEach(key => {
            const childProp = prop.embeddedProps[key];
            if (childProp && childProp.reference === enums_1.ReferenceType.EMBEDDED) {
                return EntityAssigner.assignEmbeddable(entity[propName], value[key], childProp, em, options);
            }
            entity[propName][key] = value[key];
        });
    }
    static createCollectionItem(item, em, prop, invalid, options) {
        if (Utils_1.Utils.isEntity(item)) {
            return item;
        }
        if (Utils_1.Utils.isPrimaryKey(item)) {
            return em.getReference(prop.type, item);
        }
        if (Utils_1.Utils.isPlainObject(item) && options.merge) {
            return em.merge(prop.type, item);
        }
        if (Utils_1.Utils.isPlainObject(item)) {
            return em.create(prop.type, item);
        }
        invalid.push(item);
        return item;
    }
}
exports.EntityAssigner = EntityAssigner;
exports.assign = EntityAssigner.assign;
