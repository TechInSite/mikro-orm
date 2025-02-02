"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriteriaNodeFactory = void 0;
const core_1 = require("@mikro-orm/core");
const ObjectCriteriaNode_1 = require("./ObjectCriteriaNode");
const ArrayCriteriaNode_1 = require("./ArrayCriteriaNode");
const ScalarCriteriaNode_1 = require("./ScalarCriteriaNode");
const CriteriaNode_1 = require("./CriteriaNode");
/**
 * @internal
 */
class CriteriaNodeFactory {
    static createNode(metadata, entityName, payload, parent, key) {
        const customExpression = CriteriaNode_1.CriteriaNode.isCustomExpression(key || '');
        const scalar = core_1.Utils.isPrimaryKey(payload) || payload instanceof RegExp || payload instanceof Date || customExpression;
        if (Array.isArray(payload) && !scalar) {
            return this.createArrayNode(metadata, entityName, payload, parent, key);
        }
        if (core_1.Utils.isPlainObject(payload) && !scalar) {
            return this.createObjectNode(metadata, entityName, payload, parent, key);
        }
        return this.createScalarNode(metadata, entityName, payload, parent, key);
    }
    static createScalarNode(metadata, entityName, payload, parent, key) {
        const node = new ScalarCriteriaNode_1.ScalarCriteriaNode(metadata, entityName, parent, key);
        node.payload = payload;
        return node;
    }
    static createArrayNode(metadata, entityName, payload, parent, key) {
        const node = new ArrayCriteriaNode_1.ArrayCriteriaNode(metadata, entityName, parent, key);
        node.payload = payload.map(item => this.createNode(metadata, entityName, item, node));
        return node;
    }
    static createObjectNode(metadata, entityName, payload, parent, key) {
        const meta = metadata.find(entityName);
        if (!parent && Object.keys(payload).every(k => { var _a; return ((_a = meta === null || meta === void 0 ? void 0 : meta.properties[k]) === null || _a === void 0 ? void 0 : _a.reference) === core_1.ReferenceType.SCALAR; })) {
            return this.createScalarNode(metadata, entityName, payload, parent, key);
        }
        const node = new ObjectCriteriaNode_1.ObjectCriteriaNode(metadata, entityName, parent, key);
        node.payload = Object.keys(payload).reduce((o, item) => {
            o[item] = this.createObjectItemNode(metadata, entityName, node, payload, item, meta);
            return o;
        }, {});
        return node;
    }
    static createObjectItemNode(metadata, entityName, node, payload, item, meta) {
        const prop = meta === null || meta === void 0 ? void 0 : meta.properties[item];
        if ((prop === null || prop === void 0 ? void 0 : prop.reference) !== core_1.ReferenceType.EMBEDDED) {
            const childEntity = prop && prop.reference !== core_1.ReferenceType.SCALAR ? prop.type : entityName;
            return this.createNode(metadata, childEntity, payload[item], node, item);
        }
        const operator = Object.keys(payload[item]).some(f => core_1.Utils.isOperator(f));
        if (operator) {
            throw core_1.ValidationError.cannotUseOperatorsInsideEmbeddables(entityName, prop.name, payload);
        }
        const map = Object.keys(payload[item]).reduce((oo, k) => {
            if (!prop.embeddedProps[k]) {
                throw core_1.ValidationError.invalidEmbeddableQuery(entityName, k, prop.type);
            }
            oo[prop.embeddedProps[k].name] = payload[item][k];
            return oo;
        }, {});
        return this.createNode(metadata, entityName, map, node, item);
    }
}
exports.CriteriaNodeFactory = CriteriaNodeFactory;
