"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalarCriteriaNode = void 0;
const core_1 = require("@mikro-orm/core");
const CriteriaNode_1 = require("./CriteriaNode");
/**
 * @internal
 */
class ScalarCriteriaNode extends CriteriaNode_1.CriteriaNode {
    process(qb, alias) {
        if (this.shouldJoin()) {
            const path = this.getPath();
            const parentPath = this.parent.getPath(); // the parent is always there, otherwise `shouldJoin` would return `false`
            const nestedAlias = qb.getAliasForJoinPath(path) || qb.getNextAlias();
            const field = `${alias}.${this.prop.name}`;
            const type = this.prop.reference === core_1.ReferenceType.MANY_TO_MANY ? 'pivotJoin' : 'leftJoin';
            qb.join(field, nestedAlias, undefined, type, path);
            // select the owner as virtual property when joining from 1:1 inverse side, but only if the parent is root entity
            if (this.prop.reference === core_1.ReferenceType.ONE_TO_ONE && !parentPath.includes('.')) {
                qb.addSelect(field);
            }
        }
        return this.payload;
    }
    shouldJoin() {
        if (!this.parent || !this.prop) {
            return false;
        }
        switch (this.prop.reference) {
            case core_1.ReferenceType.ONE_TO_MANY: return true;
            case core_1.ReferenceType.MANY_TO_MANY: return true;
            case core_1.ReferenceType.ONE_TO_ONE: return !this.prop.owner;
            default: return false; // SCALAR, MANY_TO_ONE
        }
    }
}
exports.ScalarCriteriaNode = ScalarCriteriaNode;
