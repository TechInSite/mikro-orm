"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityValidator = void 0;
const enums_1 = require("../enums");
const Utils_1 = require("../utils/Utils");
const errors_1 = require("../errors");
class EntityValidator {
    constructor(strict) {
        this.strict = strict;
    }
    validate(entity, payload, meta) {
        meta.props.forEach(prop => {
            if (prop.inherited) {
                return;
            }
            if ([enums_1.ReferenceType.ONE_TO_MANY, enums_1.ReferenceType.MANY_TO_MANY].includes(prop.reference)) {
                this.validateCollection(entity, prop);
            }
            const SCALAR_TYPES = ['string', 'number', 'boolean', 'Date'];
            if (prop.reference !== enums_1.ReferenceType.SCALAR || !SCALAR_TYPES.includes(prop.type)) {
                return;
            }
            const newValue = this.validateProperty(prop, this.getValue(payload, prop), entity);
            if (this.getValue(payload, prop) === newValue) {
                return;
            }
            this.setValue(payload, prop, newValue);
            /* istanbul ignore else */
            if (entity[prop.name]) {
                entity[prop.name] = payload[prop.name];
            }
        });
    }
    validateProperty(prop, givenValue, entity) {
        if (givenValue === null || givenValue === undefined) {
            return givenValue;
        }
        const expectedType = prop.type.toLowerCase();
        let givenType = Utils_1.Utils.getObjectType(givenValue);
        let ret = givenValue;
        if (!this.strict) {
            ret = this.fixTypes(expectedType, givenType, givenValue);
            givenType = Utils_1.Utils.getObjectType(ret);
        }
        if (givenType !== expectedType) {
            throw errors_1.ValidationError.fromWrongPropertyType(entity, prop.name, expectedType, givenType, givenValue);
        }
        return ret;
    }
    validateParams(params, type = 'search condition', field) {
        if (Utils_1.Utils.isPrimaryKey(params) || Utils_1.Utils.isEntity(params)) {
            return;
        }
        if (Array.isArray(params)) {
            return params.forEach((item) => this.validateParams(item, type, field));
        }
        if (Utils_1.Utils.isPlainObject(params)) {
            Object.keys(params).forEach(k => {
                this.validateParams(params[k], type, k);
            });
        }
    }
    validatePrimaryKey(entity, meta) {
        const pkExists = meta.primaryKeys.every(pk => Utils_1.Utils.isDefined(entity[pk], true)) || Utils_1.Utils.isDefined(entity[meta.serializedPrimaryKey], true);
        if (!entity || !pkExists) {
            throw errors_1.ValidationError.fromMergeWithoutPK(meta);
        }
    }
    validateEmptyWhere(where) {
        if (Utils_1.Utils.isEmpty(where)) {
            throw new Error(`You cannot call 'EntityManager.findOne()' with empty 'where' parameter`);
        }
    }
    getValue(o, prop) {
        if (prop.embedded && prop.embedded[0] in o) {
            return o[prop.embedded[0]][prop.embedded[1]];
        }
        return o[prop.name];
    }
    setValue(o, prop, v) {
        /* istanbul ignore next */
        if (prop.embedded && prop.embedded[0] in o) {
            return o[prop.embedded[0]][prop.embedded[1]] = v;
        }
        o[prop.name] = v;
    }
    validateCollection(entity, prop) {
        if (entity.__helper.__initialized && !entity[prop.name]) {
            throw errors_1.ValidationError.fromCollectionNotInitialized(entity, prop);
        }
    }
    fixTypes(expectedType, givenType, givenValue) {
        if (expectedType === 'date' && ['string', 'number'].includes(givenType)) {
            givenValue = this.fixDateType(givenValue);
        }
        if (expectedType === 'number' && givenType === 'string') {
            givenValue = this.fixNumberType(givenValue);
        }
        if (expectedType === 'boolean' && givenType === 'number') {
            givenValue = this.fixBooleanType(givenValue);
        }
        return givenValue;
    }
    fixDateType(givenValue) {
        let date;
        if (Utils_1.Utils.isString(givenValue) && givenValue.match(/^-?\d+(\.\d+)?$/)) {
            date = new Date(+givenValue);
        }
        else {
            date = new Date(givenValue);
        }
        return date.toString() !== 'Invalid Date' ? date : givenValue;
    }
    fixNumberType(givenValue) {
        const num = +givenValue;
        return '' + num === givenValue ? num : givenValue;
    }
    fixBooleanType(givenValue) {
        const bool = !!givenValue;
        return +bool === givenValue ? bool : givenValue;
    }
}
exports.EntityValidator = EntityValidator;
