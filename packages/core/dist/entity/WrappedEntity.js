"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrappedEntity = void 0;
const util_1 = require("util");
const Reference_1 = require("./Reference");
const EntityTransformer_1 = require("./EntityTransformer");
const EntityAssigner_1 = require("./EntityAssigner");
const Utils_1 = require("../utils/Utils");
const errors_1 = require("../errors");
class WrappedEntity {
    constructor(entity, pkGetter, pkSerializer, pkGetterConverted) {
        this.entity = entity;
        this.pkGetter = pkGetter;
        this.pkSerializer = pkSerializer;
        this.pkGetterConverted = pkGetterConverted;
        this.__initialized = true;
        this.__serializationContext = {};
    }
    isInitialized() {
        return this.__initialized;
    }
    populated(populated = true) {
        this.__populated = populated;
        this.__lazyInitialized = false;
    }
    toReference() {
        return Reference_1.Reference.create(this.entity);
    }
    toObject(ignoreFields = []) {
        return EntityTransformer_1.EntityTransformer.toObject(this.entity, ignoreFields);
    }
    toPOJO() {
        return EntityTransformer_1.EntityTransformer.toObject(this.entity, [], true);
    }
    toJSON(...args) {
        // toJSON methods is added to thee prototype during discovery to support automatic serialization via JSON.stringify()
        return this.entity.toJSON(...args);
    }
    assign(data, options) {
        if ('assign' in this.entity) {
            return this.entity.assign(data, options);
        }
        return EntityAssigner_1.EntityAssigner.assign(this.entity, data, options);
    }
    async init(populated = true, populate, lockMode) {
        if (!this.__em) {
            throw errors_1.ValidationError.entityNotManaged(this.entity);
        }
        await this.__em.findOne(this.entity.constructor.name, this.entity, { refresh: true, lockMode, populate });
        this.populated(populated);
        this.__lazyInitialized = true;
        return this.entity;
    }
    hasPrimaryKey() {
        const pk = this.getPrimaryKey();
        return pk !== undefined && pk !== null;
    }
    getPrimaryKey(convertCustomTypes = false) {
        if (convertCustomTypes) {
            return this.pkGetterConverted(this.entity);
        }
        return this.pkGetter(this.entity);
    }
    getPrimaryKeys(convertCustomTypes = false) {
        const pk = this.getPrimaryKey(convertCustomTypes);
        if (!pk) {
            return null;
        }
        if (this.__meta.compositePK) {
            return this.__meta.primaryKeys.reduce((ret, pk) => {
                const child = this.entity[pk];
                if (Utils_1.Utils.isEntity(child, true)) {
                    const childPk = child.__helper.getPrimaryKeys(convertCustomTypes);
                    ret.push(...childPk);
                }
                else {
                    ret.push(child);
                }
                return ret;
            }, []);
        }
        return [pk];
    }
    setPrimaryKey(id) {
        this.entity[this.entity.__meta.primaryKeys[0]] = id;
    }
    getSerializedPrimaryKey() {
        return this.pkSerializer(this.entity);
    }
    get __meta() {
        return this.entity.__meta;
    }
    get __platform() {
        return this.entity.__platform;
    }
    get __primaryKeys() {
        return Utils_1.Utils.getPrimaryKeyValues(this.entity, this.entity.__meta.primaryKeys);
    }
    // TODO used only at one place, probably replaceable
    get __primaryKeyCond() {
        if (this.entity.__meta.compositePK) {
            return this.__primaryKeys;
        }
        return this.getPrimaryKey();
    }
    [util_1.inspect.custom]() {
        return `[WrappedEntity<${this.entity.__meta.className}>]`;
    }
}
exports.WrappedEntity = WrappedEntity;
