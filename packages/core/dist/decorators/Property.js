"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const metadata_1 = require("../metadata");
const utils_1 = require("../utils");
const enums_1 = require("../enums");
function Property(options = {}) {
    return function (target, propertyName) {
        const meta = metadata_1.MetadataStorage.getMetadataFromDecorator(target.constructor);
        const desc = Object.getOwnPropertyDescriptor(target, propertyName) || {};
        metadata_1.MetadataValidator.validateSingleDecorator(meta, propertyName, enums_1.ReferenceType.SCALAR);
        const name = options.name || propertyName;
        if (propertyName !== name && !(desc.value instanceof Function)) {
            utils_1.Utils.renameKey(options, 'name', 'fieldName');
        }
        options.name = propertyName;
        const prop = Object.assign({ reference: enums_1.ReferenceType.SCALAR }, options);
        prop.getter = !!desc.get;
        prop.setter = !!desc.set;
        if (desc.value instanceof Function) {
            prop.getter = true;
            prop.persist = false;
            prop.type = 'method';
            prop.getterName = propertyName;
            prop.name = name;
        }
        meta.properties[prop.name] = prop;
        return utils_1.Utils.propertyDecoratorReturnValue();
    };
}
exports.Property = Property;
