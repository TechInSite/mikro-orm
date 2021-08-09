"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeSetComputer = void 0;
const utils_1 = require("../utils");
const ChangeSet_1 = require("./ChangeSet");
const enums_1 = require("../enums");
const EntityComparator_1 = require("../utils/EntityComparator");
class ChangeSetComputer {
    constructor(validator, collectionUpdates, removeStack, metadata, platform, config) {
        this.validator = validator;
        this.collectionUpdates = collectionUpdates;
        this.removeStack = removeStack;
        this.metadata = metadata;
        this.platform = platform;
        this.config = config;
        this.comparator = new EntityComparator_1.EntityComparator(this.metadata, this.platform);
    }
    computeChangeSet(entity) {
        const meta = this.metadata.find(entity.constructor.name);
        if (meta.readonly) {
            return null;
        }
        const type = entity.__helper.__originalEntityData ? ChangeSet_1.ChangeSetType.UPDATE : ChangeSet_1.ChangeSetType.CREATE;
        const changeSet = new ChangeSet_1.ChangeSet(entity, type, this.computePayload(entity), meta);
        if (changeSet.type === ChangeSet_1.ChangeSetType.UPDATE) {
            changeSet.originalEntity = entity.__helper.__originalEntityData;
        }
        if (this.config.get('validate')) {
            this.validator.validate(changeSet.entity, changeSet.payload, meta);
        }
        for (const prop of meta.relations) {
            this.processProperty(changeSet, prop);
        }
        if (changeSet.type === ChangeSet_1.ChangeSetType.UPDATE && !utils_1.Utils.hasObjectKeys(changeSet.payload)) {
            return null;
        }
        return changeSet;
    }
    computePayload(entity) {
        const data = this.comparator.prepareEntity(entity);
        const entityName = entity.__meta.root.className;
        const originalEntityData = entity.__helper.__originalEntityData;
        if (originalEntityData) {
            const comparator = this.comparator.getEntityComparator(entityName);
            return comparator(originalEntityData, data);
        }
        return data;
    }
    processProperty(changeSet, prop, target) {
        if (!target) {
            const targets = utils_1.Utils.unwrapProperty(changeSet.entity, changeSet.entity.__meta, prop);
            targets.forEach(([t]) => this.processProperty(changeSet, prop, t));
            return;
        }
        if (utils_1.Utils.isCollection(target)) { // m:n or 1:m
            this.processToMany(prop, changeSet);
        }
        if ([enums_1.ReferenceType.MANY_TO_ONE, enums_1.ReferenceType.ONE_TO_ONE].includes(prop.reference)) {
            this.processToOne(prop, changeSet);
        }
    }
    processToOne(prop, changeSet) {
        const isToOneOwner = prop.reference === enums_1.ReferenceType.MANY_TO_ONE || (prop.reference === enums_1.ReferenceType.ONE_TO_ONE && prop.owner);
        if (!isToOneOwner || prop.mapToPk) {
            return;
        }
        const targets = utils_1.Utils.unwrapProperty(changeSet.entity, changeSet.entity.__meta, prop);
        targets.forEach(([target, idx]) => {
            if (!target.__helper.hasPrimaryKey()) {
                utils_1.Utils.setPayloadProperty(changeSet.payload, this.metadata.find(changeSet.name), prop, target.__helper.__identifier, idx);
            }
        });
    }
    processToMany(prop, changeSet) {
        const target = changeSet.entity[prop.name];
        // remove items from collection based on removeStack
        if (target.isInitialized() && this.removeStack.size > 0) {
            target.getItems(false)
                .filter(item => this.removeStack.has(item))
                .forEach(item => target.remove(item));
        }
        if (!target.isDirty()) {
            return;
        }
        if (prop.owner || target.getItems(false).filter(item => !item.__helper.__initialized).length > 0) {
            this.collectionUpdates.add(target);
        }
        else {
            target.setDirty(false); // inverse side with only populated items, nothing to persist
        }
    }
}
exports.ChangeSetComputer = ChangeSetComputer;
