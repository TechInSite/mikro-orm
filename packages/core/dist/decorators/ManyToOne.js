"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManyToOne = void 0;
const metadata_1 = require("../metadata");
const utils_1 = require("../utils");
const enums_1 = require("../enums");
function ManyToOne(entity = {}, options = {}) {
    return function (target, propertyName) {
        var _a;
        options = utils_1.Utils.isObject(entity) ? entity : Object.assign(Object.assign({}, options), { entity });
        const meta = metadata_1.MetadataStorage.getMetadataFromDecorator(target.constructor);
        metadata_1.MetadataValidator.validateSingleDecorator(meta, propertyName, enums_1.ReferenceType.MANY_TO_ONE);
        const property = { name: propertyName, reference: enums_1.ReferenceType.MANY_TO_ONE };
        meta.properties[propertyName] = Object.assign((_a = meta.properties[propertyName]) !== null && _a !== void 0 ? _a : {}, property, options);
        return utils_1.Utils.propertyDecoratorReturnValue();
    };
}
exports.ManyToOne = ManyToOne;
