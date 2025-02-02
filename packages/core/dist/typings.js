"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlainObject = exports.EntityMetadata = exports.PrimaryKeyProp = exports.PrimaryKeyType = exports.EntityRepositoryType = void 0;
const enums_1 = require("./enums");
const utils_1 = require("./utils");
exports.EntityRepositoryType = Symbol('EntityRepositoryType');
exports.PrimaryKeyType = Symbol('PrimaryKeyType');
exports.PrimaryKeyProp = Symbol('PrimaryKeyProp');
class EntityMetadata {
    constructor(meta = {}) {
        this.propertyOrder = new Map();
        this.properties = {};
        this.props = [];
        this.primaryKeys = [];
        this.filters = {};
        this.hooks = {};
        this.indexes = [];
        this.uniques = [];
        Object.assign(this, meta);
    }
    addProperty(prop, sync = true) {
        this.properties[prop.name] = prop;
        this.propertyOrder.set(prop.name, this.props.length);
        /* istanbul ignore next */
        if (sync) {
            this.sync();
        }
    }
    removeProperty(name, sync = true) {
        delete this.properties[name];
        this.propertyOrder.delete(name);
        /* istanbul ignore next */
        if (sync) {
            this.sync();
        }
    }
    getPrimaryProps() {
        return this.primaryKeys.map(pk => this.properties[pk]);
    }
    sync(initIndexes = false) {
        var _a;
        this.root = (_a = this.root) !== null && _a !== void 0 ? _a : this;
        const props = Object.values(this.properties).sort((a, b) => this.propertyOrder.get(a.name) - this.propertyOrder.get(b.name));
        this.props = [...props.filter(p => p.primary), ...props.filter(p => !p.primary)];
        this.relations = this.props.filter(prop => prop.reference !== enums_1.ReferenceType.SCALAR && prop.reference !== enums_1.ReferenceType.EMBEDDED);
        this.comparableProps = this.props.filter(prop => utils_1.EntityComparator.isComparable(prop, this.root));
        this.hydrateProps = this.props.filter(prop => {
            // `prop.userDefined` is either `undefined` or `false`
            const discriminator = this.root.discriminatorColumn === prop.name && prop.userDefined === false;
            const onlyGetter = prop.getter && !prop.setter;
            return !prop.inherited && !discriminator && !prop.embedded && !onlyGetter;
        });
        this.selfReferencing = this.relations.some(prop => [this.className, this.root.className].includes(prop.type));
        if (initIndexes && this.name) {
            this.props.forEach(prop => this.initIndexes(prop));
        }
    }
    initIndexes(prop) {
        const simpleIndex = this.indexes.find(index => index.properties === prop.name && !index.options && !index.type && !index.expression);
        const simpleUnique = this.uniques.find(index => index.properties === prop.name && !index.options);
        const owner = prop.reference === enums_1.ReferenceType.MANY_TO_ONE || (prop.reference === enums_1.ReferenceType.ONE_TO_ONE && prop.owner);
        if (!prop.index && simpleIndex) {
            utils_1.Utils.defaultValue(simpleIndex, 'name', true);
            prop.index = simpleIndex.name;
            this.indexes.splice(this.indexes.indexOf(simpleIndex), 1);
        }
        if (!prop.unique && simpleUnique) {
            utils_1.Utils.defaultValue(simpleUnique, 'name', true);
            prop.unique = simpleUnique.name;
            this.uniques.splice(this.uniques.indexOf(simpleUnique), 1);
        }
        if (owner && prop.fieldNames.length > 1) {
            this.indexes.push({ properties: prop.name });
            prop.index = false;
        }
        if (owner && prop.fieldNames.length > 1 && prop.unique) {
            this.uniques.push({ properties: prop.name });
            prop.unique = false;
        }
    }
}
exports.EntityMetadata = EntityMetadata;
class PlainObject {
}
exports.PlainObject = PlainObject;
