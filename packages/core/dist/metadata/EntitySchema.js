"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySchema = void 0;
const typings_1 = require("../typings");
const entity_1 = require("../entity");
const enums_1 = require("../enums");
const types_1 = require("../types");
const utils_1 = require("../utils");
const EnumArrayType_1 = require("../types/EnumArrayType");
class EntitySchema {
    constructor(meta) {
        var _a;
        this._meta = new typings_1.EntityMetadata();
        this.internal = false;
        this.initialized = false;
        meta.name = meta.class ? meta.class.name : meta.name;
        if (meta.tableName || meta.collection) {
            utils_1.Utils.renameKey(meta, 'tableName', 'collection');
            meta.tableName = meta.collection;
        }
        Object.assign(this._meta, { className: meta.name }, meta);
        this._meta.root = (_a = this._meta.root) !== null && _a !== void 0 ? _a : this._meta;
    }
    static fromMetadata(meta) {
        const schema = new EntitySchema(meta);
        schema.internal = true;
        return schema;
    }
    addProperty(name, type, options = {}) {
        const rename = (data, from, to) => {
            if (options[from] && !options[to]) {
                options[to] = [options[from]];
                delete options[from];
            }
        };
        if (name !== options.name) {
            utils_1.Utils.renameKey(options, 'name', 'fieldName');
        }
        rename(options, 'fieldName', 'fieldNames');
        rename(options, 'joinColumn', 'joinColumns');
        rename(options, 'inverseJoinColumn', 'inverseJoinColumns');
        rename(options, 'referenceColumnName', 'referencedColumnNames');
        rename(options, 'columnType', 'columnTypes');
        const prop = Object.assign(Object.assign({ name, reference: enums_1.ReferenceType.SCALAR }, options), { type: this.normalizeType(options, type) });
        // eslint-disable-next-line no-prototype-builtins
        if (type && types_1.Type.isPrototypeOf(type)) {
            prop.type = type;
        }
        if (utils_1.Utils.isString(prop.formula)) {
            const formula = prop.formula; // tmp var is needed here
            prop.formula = () => formula;
        }
        this._meta.properties[name] = prop;
    }
    addEnum(name, type, options = {}) {
        if (options.items instanceof Function) {
            options.items = utils_1.Utils.extractEnumValues(options.items());
        }
        // enum arrays are simple numeric/string arrays, the constrain is enforced in the custom type only
        if (options.array && !options.customType) {
            options.customType = new EnumArrayType_1.EnumArrayType(`${this._meta.className}.${name}`, options.items);
            options.enum = false;
        }
        const prop = Object.assign({ enum: true }, options);
        if (prop.array) {
            prop.enum = false;
        }
        this.addProperty(name, this.internal ? type : type || 'enum', prop);
    }
    addVersion(name, type, options = {}) {
        this.addProperty(name, type, Object.assign({ version: true }, options));
    }
    addPrimaryKey(name, type, options = {}) {
        this.addProperty(name, type, Object.assign({ primary: true }, options));
    }
    addSerializedPrimaryKey(name, type, options = {}) {
        this._meta.serializedPrimaryKey = name;
        this.addProperty(name, type, options);
    }
    addEmbedded(name, options) {
        utils_1.Utils.defaultValue(options, 'prefix', true);
        if (options.array) {
            options.object = true; // force object mode for arrays
        }
        this._meta.properties[name] = Object.assign({ name, type: this.normalizeType(options), reference: enums_1.ReferenceType.EMBEDDED }, options);
    }
    addManyToOne(name, type, options) {
        const prop = this.createProperty(enums_1.ReferenceType.MANY_TO_ONE, options);
        utils_1.Utils.defaultValue(prop, 'nullable', prop.cascade.includes(enums_1.Cascade.REMOVE) || prop.cascade.includes(enums_1.Cascade.ALL));
        if (prop.joinColumns && !prop.fieldNames) {
            prop.fieldNames = prop.joinColumns;
        }
        if (prop.fieldNames && !prop.joinColumns) {
            prop.joinColumns = prop.fieldNames;
        }
        this.addProperty(name, type, prop);
    }
    addManyToMany(name, type, options) {
        options.fixedOrder = options.fixedOrder || !!options.fixedOrderColumn;
        if (!options.owner && !options.mappedBy) {
            options.owner = true;
        }
        if (options.owner) {
            utils_1.Utils.renameKey(options, 'mappedBy', 'inversedBy');
        }
        const prop = this.createProperty(enums_1.ReferenceType.MANY_TO_MANY, options);
        this.addProperty(name, type, prop);
    }
    addOneToMany(name, type, options) {
        const prop = this.createProperty(enums_1.ReferenceType.ONE_TO_MANY, options);
        this.addProperty(name, type, prop);
    }
    addOneToOne(name, type, options) {
        const prop = this.createProperty(enums_1.ReferenceType.ONE_TO_ONE, options);
        utils_1.Utils.defaultValue(prop, 'nullable', prop.cascade.includes(enums_1.Cascade.REMOVE) || prop.cascade.includes(enums_1.Cascade.ALL));
        utils_1.Utils.defaultValue(prop, 'owner', !!prop.inversedBy || !prop.mappedBy);
        utils_1.Utils.defaultValue(prop, 'unique', prop.owner);
        if (prop.owner && options.mappedBy) {
            utils_1.Utils.renameKey(prop, 'mappedBy', 'inversedBy');
        }
        if (prop.joinColumns && !prop.fieldNames) {
            prop.fieldNames = prop.joinColumns;
        }
        if (prop.fieldNames && !prop.joinColumns) {
            prop.joinColumns = prop.fieldNames;
        }
        this.addProperty(name, type, prop);
    }
    addIndex(options) {
        this._meta.indexes.push(options);
    }
    addUnique(options) {
        this._meta.uniques.push(options);
    }
    setCustomRepository(repository) {
        this._meta.customRepository = repository;
    }
    setExtends(base) {
        this._meta.extends = base;
    }
    setClass(proto) {
        this._meta.class = proto;
        this._meta.prototype = proto.prototype;
        this._meta.className = proto.name;
        this._meta.constructorParams = utils_1.Utils.getParamNames(proto, 'constructor');
        this._meta.toJsonParams = utils_1.Utils.getParamNames(proto, 'toJSON').filter(p => p !== '...args');
        if (Object.getPrototypeOf(proto) !== entity_1.BaseEntity) {
            this._meta.extends = this._meta.extends || Object.getPrototypeOf(proto).name || undefined;
        }
    }
    get meta() {
        return this._meta;
    }
    get name() {
        return this._meta.name;
    }
    /**
     * @internal
     */
    init() {
        var _a;
        if (this.initialized) {
            return this;
        }
        if (!this._meta.class) {
            const name = this.name;
            this._meta.class = ({ [name]: class {
                } })[name];
        }
        this.setClass(this._meta.class);
        if (this._meta.abstract && !this._meta.discriminatorColumn) {
            delete this._meta.name;
        }
        const tableName = (_a = this._meta.collection) !== null && _a !== void 0 ? _a : this._meta.tableName;
        if ((tableName === null || tableName === void 0 ? void 0 : tableName.includes('.')) && !this._meta.schema) {
            this._meta.schema = tableName.substr(0, tableName.indexOf('.'));
            this._meta.collection = tableName.substr(tableName.indexOf('.') + 1);
        }
        this.initProperties();
        this.initPrimaryKeys();
        this._meta.props = Object.values(this._meta.properties);
        this._meta.relations = this._meta.props.filter(prop => prop.reference !== enums_1.ReferenceType.SCALAR && prop.reference !== enums_1.ReferenceType.EMBEDDED);
        this.initialized = true;
        return this;
    }
    initProperties() {
        Object.entries(this._meta.properties).forEach(([name, options]) => {
            options.type = options.customType != null ? options.customType.constructor.name : options.type;
            switch (options.reference) {
                case enums_1.ReferenceType.ONE_TO_ONE:
                    this.addOneToOne(name, options.type, options);
                    break;
                case enums_1.ReferenceType.ONE_TO_MANY:
                    this.addOneToMany(name, options.type, options);
                    break;
                case enums_1.ReferenceType.MANY_TO_ONE:
                    this.addManyToOne(name, options.type, options);
                    break;
                case enums_1.ReferenceType.MANY_TO_MANY:
                    this.addManyToMany(name, options.type, options);
                    break;
                case enums_1.ReferenceType.EMBEDDED:
                    this.addEmbedded(name, options);
                    break;
                default:
                    if (options.enum) {
                        this.addEnum(name, options.type, options);
                    }
                    else if (options.primary) {
                        this.addPrimaryKey(name, options.type, options);
                    }
                    else if (options.serializedPrimaryKey) {
                        this.addSerializedPrimaryKey(name, options.type, options);
                    }
                    else if (options.version) {
                        this.addVersion(name, options.type, options);
                    }
                    else {
                        this.addProperty(name, options.type, options);
                    }
            }
        });
    }
    initPrimaryKeys() {
        var _a;
        const pks = Object.values(this._meta.properties).filter(prop => prop.primary);
        if (pks.length > 0) {
            this._meta.primaryKeys = pks.map(prop => prop.name);
            this._meta.compositePK = pks.length > 1;
        }
        // FK used as PK, we need to cascade
        if (pks.length === 1 && pks[0].reference !== enums_1.ReferenceType.SCALAR) {
            pks[0].onDelete = 'cascade';
        }
        if (pks.length === 1 && pks[0].type === 'number') {
            pks[0].autoincrement = (_a = pks[0].autoincrement) !== null && _a !== void 0 ? _a : true;
        }
        const serializedPrimaryKey = Object.values(this._meta.properties).find(prop => prop.serializedPrimaryKey);
        if (serializedPrimaryKey) {
            this._meta.serializedPrimaryKey = serializedPrimaryKey.name;
        }
    }
    normalizeType(options, type) {
        if ('entity' in options) {
            if (utils_1.Utils.isString(options.entity)) {
                type = options.type = options.entity;
            }
            else if (options.entity) {
                type = options.type = utils_1.Utils.className(options.entity());
            }
        }
        if (type instanceof Function) {
            type = type.name;
        }
        if (['String', 'Number', 'Boolean', 'Array'].includes(type)) {
            type = type.toLowerCase();
        }
        return type;
    }
    createProperty(reference, options) {
        return Object.assign({ reference, cascade: [enums_1.Cascade.PERSIST] }, options);
    }
}
exports.EntitySchema = EntitySchema;
