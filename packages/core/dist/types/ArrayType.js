"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayType = void 0;
const Type_1 = require("./Type");
const utils_1 = require("../utils");
const errors_1 = require("../errors");
class ArrayType extends Type_1.Type {
    constructor(hydrate = i => i) {
        super();
        this.hydrate = hydrate;
    }
    convertToDatabaseValue(value, platform, fromQuery) {
        if (!value) {
            return value;
        }
        if (Array.isArray(value)) {
            return platform.marshallArray(value);
        }
        if (fromQuery) {
            return value;
        }
        throw errors_1.ValidationError.invalidType(ArrayType, value, 'JS');
    }
    convertToJSValue(value, platform) {
        if (!utils_1.Utils.isDefined(value, true)) {
            return value;
        }
        if (utils_1.Utils.isString(value)) {
            value = platform.unmarshallArray(value);
        }
        return value.map(i => this.hydrate(i));
    }
    compareAsType() {
        return 'string[]';
    }
    toJSON(value) {
        return value;
    }
    getColumnType(prop, platform) {
        return platform.getArrayDeclarationSQL();
    }
}
exports.ArrayType = ArrayType;
