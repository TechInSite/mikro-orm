"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterDelete = exports.BeforeDelete = exports.OnInit = exports.AfterUpdate = exports.BeforeUpdate = exports.AfterCreate = exports.BeforeCreate = void 0;
const metadata_1 = require("../metadata");
const enums_1 = require("../enums");
function hook(type) {
    return function (target, method) {
        const meta = metadata_1.MetadataStorage.getMetadataFromDecorator(target.constructor);
        if (!meta.hooks[type]) {
            meta.hooks[type] = [];
        }
        meta.hooks[type].push(method);
    };
}
function BeforeCreate() {
    return hook(enums_1.EventType.beforeCreate);
}
exports.BeforeCreate = BeforeCreate;
function AfterCreate() {
    return hook(enums_1.EventType.afterCreate);
}
exports.AfterCreate = AfterCreate;
function BeforeUpdate() {
    return hook(enums_1.EventType.beforeUpdate);
}
exports.BeforeUpdate = BeforeUpdate;
function AfterUpdate() {
    return hook(enums_1.EventType.afterUpdate);
}
exports.AfterUpdate = AfterUpdate;
function OnInit() {
    return hook(enums_1.EventType.onInit);
}
exports.OnInit = OnInit;
/**
 * Called before deleting entity, but only when providing initialized entity to EM#remove()
 */
function BeforeDelete() {
    return hook(enums_1.EventType.beforeDelete);
}
exports.BeforeDelete = BeforeDelete;
/**
 * Called after deleting entity, but only when providing initialized entity to EM#remove()
 */
function AfterDelete() {
    return hook(enums_1.EventType.afterDelete);
}
exports.AfterDelete = AfterDelete;
