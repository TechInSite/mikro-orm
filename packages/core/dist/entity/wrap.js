"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrap = void 0;
/**
 * wraps entity type with WrappedEntity internal properties and helpers like init/isInitialized/populated/toJSON
 * use `preferHelper = true` to have access to the internal `__` properties like `__meta` or `__em`
 */
function wrap(entity, preferHelper = false) {
    if ((entity === null || entity === void 0 ? void 0 : entity.__baseEntity) && !preferHelper) {
        return entity;
    }
    if (entity) {
        return entity.__helper;
    }
    return entity;
}
exports.wrap = wrap;
