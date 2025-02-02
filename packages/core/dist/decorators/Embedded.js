"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embedded = void 0;
const metadata_1 = require("../metadata");
const utils_1 = require("../utils");
const enums_1 = require("../enums");
function Embedded(type = {}, options = {}) {
    return function (target, propertyName) {
        const meta = metadata_1.MetadataStorage.getMetadataFromDecorator(target.constructor);
        metadata_1.MetadataValidator.validateSingleDecorator(meta, propertyName, enums_1.ReferenceType.EMBEDDED);
        options = type instanceof Function ? Object.assign({ entity: type }, options) : Object.assign(Object.assign({}, type), options);
        utils_1.Utils.defaultValue(options, 'prefix', true);
        const property = { name: propertyName, reference: enums_1.ReferenceType.EMBEDDED };
        meta.properties[propertyName] = Object.assign(property, options);
        return utils_1.Utils.propertyDecoratorReturnValue();
    };
}
exports.Embedded = Embedded;
