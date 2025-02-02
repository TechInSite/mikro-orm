"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityHelper = void 0;
const util_1 = require("util");
const EntityTransformer_1 = require("./EntityTransformer");
const Reference_1 = require("./Reference");
const Utils_1 = require("../utils/Utils");
const WrappedEntity_1 = require("./WrappedEntity");
const enums_1 = require("../enums");
const entityHelperSymbol = Symbol('helper');
class EntityHelper {
    static decorate(meta, em) {
        if (meta.embeddable) {
            EntityHelper.defineBaseProperties(meta, meta.prototype, em);
            return;
        }
        const pk = meta.properties[meta.primaryKeys[0]];
        if (pk.name === '_id' && meta.serializedPrimaryKey === 'id') {
            EntityHelper.defineIdProperty(meta, em.getPlatform());
        }
        EntityHelper.defineBaseProperties(meta, meta.prototype, em);
        const prototype = meta.prototype;
        if (em.config.get('propagateToOneOwner')) {
            EntityHelper.defineReferenceProperties(meta);
        }
        if (!prototype.toJSON) { // toJSON can be overridden
            prototype.toJSON = function (...args) {
                return EntityTransformer_1.EntityTransformer.toObject(this, ...args.slice(meta.toJsonParams.length));
            };
        }
    }
    /**
     * defines magic id property getter/setter if PK property is `_id` and there is no `id` property defined
     */
    static defineIdProperty(meta, platform) {
        Object.defineProperty(meta.prototype, 'id', {
            get() {
                return this._id ? platform.normalizePrimaryKey(this._id) : null;
            },
            set(id) {
                this._id = id ? platform.denormalizePrimaryKey(id) : null;
            },
        });
    }
    static defineBaseProperties(meta, prototype, em) {
        const helperParams = meta.embeddable ? [] : [em.getComparator().getPkGetter(meta), em.getComparator().getPkSerializer(meta), em.getComparator().getPkGetterConverted(meta)];
        Object.defineProperties(prototype, {
            __entity: { value: !meta.embeddable },
            __meta: { value: meta },
            __platform: { value: em.getPlatform() },
            [entityHelperSymbol]: { value: null, writable: true, enumerable: false },
            __helper: {
                get() {
                    if (!this[entityHelperSymbol]) {
                        Object.defineProperty(this, entityHelperSymbol, {
                            value: new WrappedEntity_1.WrappedEntity(this, ...helperParams),
                            enumerable: false,
                        });
                    }
                    return this[entityHelperSymbol];
                },
            },
        });
    }
    /**
     * Defines getter and setter for every owning side of m:1 and 1:1 relation. This is then used for propagation of
     * changes to the inverse side of bi-directional relations.
     * First defines a setter on the prototype, once called, actual get/set handlers are registered on the instance rather
     * than on its prototype. Thanks to this we still have those properties enumerable (e.g. part of `Object.keys(entity)`).
     */
    static defineReferenceProperties(meta) {
        Object
            .values(meta.properties)
            .filter(prop => [enums_1.ReferenceType.ONE_TO_ONE, enums_1.ReferenceType.MANY_TO_ONE].includes(prop.reference) && (prop.inversedBy || prop.mappedBy) && !prop.mapToPk)
            .forEach(prop => {
            Object.defineProperty(meta.prototype, prop.name, {
                set(val) {
                    if (!('__data' in this)) {
                        Object.defineProperty(this, '__data', { value: {} });
                    }
                    EntityHelper.defineReferenceProperty(prop, this, val);
                },
            });
        });
        /* istanbul ignore else */
        if (!meta.prototype[util_1.inspect.custom]) {
            meta.prototype[util_1.inspect.custom] = function (depth) {
                const object = Object.assign({}, this);
                delete object[entityHelperSymbol];
                const ret = util_1.inspect(object, { depth });
                let name = this.constructor.name;
                // distinguish not initialized entities
                if (!this.__helper.__initialized) {
                    name = `Ref<${name}>`;
                }
                return ret === '[Object]' ? `[${name}]` : name + ' ' + ret;
            };
        }
    }
    static defineReferenceProperty(prop, ref, val) {
        Object.defineProperty(ref, prop.name, {
            get() {
                return this.__data[prop.name];
            },
            set(val) {
                const entity = Reference_1.Reference.unwrapReference(val !== null && val !== void 0 ? val : this.__data[prop.name]);
                this.__data[prop.name] = Reference_1.Reference.wrapReference(val, prop);
                EntityHelper.propagate(entity, this, prop, Reference_1.Reference.unwrapReference(val));
            },
            enumerable: true,
            configurable: true,
        });
        ref[prop.name] = val;
    }
    static propagate(entity, owner, prop, value) {
        const inverse = value && value[prop.inversedBy || prop.mappedBy];
        if (prop.reference === enums_1.ReferenceType.MANY_TO_ONE && Utils_1.Utils.isCollection(inverse) && inverse.isInitialized()) {
            inverse.add(owner);
        }
        if (prop.reference === enums_1.ReferenceType.ONE_TO_ONE && entity && entity.__helper.__initialized && Reference_1.Reference.unwrapReference(inverse) !== owner && value != null) {
            EntityHelper.propagateOneToOne(entity, owner, prop);
        }
        if (prop.reference === enums_1.ReferenceType.ONE_TO_ONE && entity && entity.__helper.__initialized && entity[prop.inversedBy || prop.mappedBy] != null && value == null) {
            entity[prop.inversedBy || prop.mappedBy] = value;
        }
    }
    static propagateOneToOne(entity, owner, prop) {
        const inverse = entity[prop.inversedBy || prop.mappedBy];
        if (Reference_1.Reference.isReference(inverse)) {
            inverse.set(owner);
        }
        else {
            entity[prop.inversedBy || prop.mappedBy] = Reference_1.Reference.wrapReference(owner, prop);
        }
    }
}
exports.EntityHelper = EntityHelper;
