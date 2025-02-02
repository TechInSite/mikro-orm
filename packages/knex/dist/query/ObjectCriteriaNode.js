"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectCriteriaNode = void 0;
const core_1 = require("@mikro-orm/core");
const CriteriaNode_1 = require("./CriteriaNode");
const enums_1 = require("./enums");
/**
 * @internal
 */
class ObjectCriteriaNode extends CriteriaNode_1.CriteriaNode {
    process(qb, alias) {
        const nestedAlias = qb.getAliasForJoinPath(this.getPath());
        const ownerAlias = alias || qb.alias;
        if (nestedAlias) {
            alias = nestedAlias;
        }
        if (this.shouldAutoJoin(nestedAlias)) {
            alias = this.autoJoin(qb, ownerAlias);
        }
        return Object.keys(this.payload).reduce((o, field) => {
            var _a, _b;
            const childNode = this.payload[field];
            const payload = childNode.process(qb, this.prop ? alias : ownerAlias);
            const operator = core_1.Utils.isOperator(field);
            const customExpression = ObjectCriteriaNode.isCustomExpression(field);
            const virtual = ((_a = childNode.prop) === null || _a === void 0 ? void 0 : _a.persist) === false;
            // if key is missing, we are inside group operator and we need to prefix with alias
            const primaryKey = this.key && this.metadata.find(this.entityName).primaryKeys.includes(field);
            if (childNode.shouldInline(payload)) {
                const childAlias = qb.getAliasForJoinPath(childNode.getPath());
                this.inlineChildPayload(o, payload, field, alias, childAlias);
            }
            else if (childNode.shouldRename(payload)) {
                o[childNode.renameFieldToPK(qb)] = payload;
            }
            else if (primaryKey || virtual || operator || customExpression || field.includes('.') || ![enums_1.QueryType.SELECT, enums_1.QueryType.COUNT].includes((_b = qb.type) !== null && _b !== void 0 ? _b : enums_1.QueryType.SELECT)) {
                o[field] = payload;
            }
            else {
                o[`${alias}.${field}`] = payload;
            }
            return o;
        }, {});
    }
    willAutoJoin(qb, alias) {
        const nestedAlias = qb.getAliasForJoinPath(this.getPath());
        const ownerAlias = alias || qb.alias;
        if (nestedAlias) {
            alias = nestedAlias;
        }
        if (this.shouldAutoJoin(nestedAlias)) {
            return true;
        }
        return Object.keys(this.payload).some(field => {
            const childNode = this.payload[field];
            return childNode.willAutoJoin(qb, this.prop ? alias : ownerAlias);
        });
    }
    shouldInline(payload) {
        const customExpression = ObjectCriteriaNode.isCustomExpression(this.key);
        const scalar = core_1.Utils.isPrimaryKey(payload) || payload instanceof RegExp || payload instanceof Date || customExpression;
        const operator = core_1.Utils.isObject(payload) && Object.keys(payload).every(k => core_1.Utils.isOperator(k, false));
        return !!this.prop && this.prop.reference !== core_1.ReferenceType.SCALAR && !scalar && !operator;
    }
    inlineChildPayload(o, payload, field, alias, childAlias) {
        var _a;
        const prop = this.metadata.find(this.entityName).properties[field];
        for (const k of Object.keys(payload)) {
            if (core_1.Utils.isOperator(k, false)) {
                const tmp = payload[k];
                delete payload[k];
                o[`${alias}.${field}`] = Object.assign({ [k]: tmp }, (o[`${alias}.${field}`] || {}));
            }
            else if (this.isPrefixed(k) || core_1.Utils.isOperator(k) || !childAlias) {
                const idx = prop.referencedPKs.indexOf(k);
                const key = idx !== -1 && !childAlias ? prop.joinColumns[idx] : k;
                if (key in o) {
                    /* istanbul ignore next */
                    const $and = (_a = o.$and) !== null && _a !== void 0 ? _a : [];
                    $and.push({ [key]: o[key] }, { [key]: payload[k] });
                    delete o[key];
                    o.$and = $and;
                }
                else {
                    o[key] = payload[k];
                }
            }
            else {
                o[`${childAlias}.${k}`] = payload[k];
            }
        }
    }
    shouldAutoJoin(nestedAlias) {
        if (!this.prop || !this.parent) {
            return false;
        }
        const embeddable = this.prop.reference === core_1.ReferenceType.EMBEDDED;
        const knownKey = [core_1.ReferenceType.SCALAR, core_1.ReferenceType.MANY_TO_ONE, core_1.ReferenceType.EMBEDDED].includes(this.prop.reference) || (this.prop.reference === core_1.ReferenceType.ONE_TO_ONE && this.prop.owner);
        const operatorKeys = knownKey && Object.keys(this.payload).every(key => core_1.Utils.isOperator(key, false));
        const primaryKeys = knownKey && Object.keys(this.payload).every(key => this.metadata.find(this.entityName).primaryKeys.includes(key));
        return !primaryKeys && !nestedAlias && !operatorKeys && !embeddable;
    }
    autoJoin(qb, alias) {
        var _a;
        const nestedAlias = qb.getNextAlias();
        const customExpression = ObjectCriteriaNode.isCustomExpression(this.key);
        const scalar = core_1.Utils.isPrimaryKey(this.payload) || this.payload instanceof RegExp || this.payload instanceof Date || customExpression;
        const operator = core_1.Utils.isPlainObject(this.payload) && Object.keys(this.payload).every(k => core_1.Utils.isOperator(k, false));
        const field = `${alias}.${this.prop.name}`;
        if (this.prop.reference === core_1.ReferenceType.MANY_TO_MANY && (scalar || operator)) {
            qb.join(field, nestedAlias, undefined, 'pivotJoin', this.getPath());
        }
        else {
            const prev = (_a = qb._fields) === null || _a === void 0 ? void 0 : _a.slice();
            qb.join(field, nestedAlias, undefined, 'leftJoin', this.getPath());
            qb._fields = prev;
        }
        return nestedAlias;
    }
    isPrefixed(field) {
        return !!field.match(/\w+\./);
    }
}
exports.ObjectCriteriaNode = ObjectCriteriaNode;
