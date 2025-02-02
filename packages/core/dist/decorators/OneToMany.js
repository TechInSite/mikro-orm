"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneToMany = exports.createOneToDecorator = void 0;
const metadata_1 = require("../metadata");
const utils_1 = require("../utils");
const enums_1 = require("../enums");
function createOneToDecorator(entity, mappedBy, options, reference) {
    return function (target, propertyName) {
        var _a;
        options = utils_1.Utils.isObject(entity) ? entity : Object.assign(Object.assign({}, options), { entity, mappedBy });
        const meta = metadata_1.MetadataStorage.getMetadataFromDecorator(target.constructor);
        metadata_1.MetadataValidator.validateSingleDecorator(meta, propertyName, reference);
        const property = { name: propertyName, reference };
        meta.properties[propertyName] = Object.assign((_a = meta.properties[propertyName]) !== null && _a !== void 0 ? _a : {}, property, options);
        return utils_1.Utils.propertyDecoratorReturnValue();
    };
}
exports.createOneToDecorator = createOneToDecorator;
function OneToMany(entity, mappedBy, options = {}) {
    return createOneToDecorator(entity, mappedBy, options, enums_1.ReferenceType.ONE_TO_MANY);
}
exports.OneToMany = OneToMany;
