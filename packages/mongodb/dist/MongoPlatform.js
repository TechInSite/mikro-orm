"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoPlatform = void 0;
const mongodb_1 = require("mongodb");
const core_1 = require("@mikro-orm/core");
const MongoExceptionConverter_1 = require("./MongoExceptionConverter");
const MongoEntityRepository_1 = require("./MongoEntityRepository");
class MongoPlatform extends core_1.Platform {
    constructor() {
        super(...arguments);
        this.exceptionConverter = new MongoExceptionConverter_1.MongoExceptionConverter();
    }
    getNamingStrategy() {
        return core_1.MongoNamingStrategy;
    }
    getRepositoryClass() {
        return MongoEntityRepository_1.MongoEntityRepository;
    }
    normalizePrimaryKey(data) {
        if (data instanceof mongodb_1.ObjectId) {
            return data.toHexString();
        }
        return data;
    }
    denormalizePrimaryKey(data) {
        return new mongodb_1.ObjectId(data);
    }
    getSerializedPrimaryKeyField(field) {
        return 'id';
    }
    usesDifferentSerializedPrimaryKey() {
        return true;
    }
    usesImplicitTransactions() {
        return false;
    }
    convertsJsonAutomatically(marshall = false) {
        return true;
    }
    marshallArray(values) {
        return values;
    }
    cloneEmbeddable(data) {
        const ret = super.cloneEmbeddable(data);
        core_1.Utils.dropUndefinedProperties(ret);
        return ret;
    }
}
exports.MongoPlatform = MongoPlatform;
