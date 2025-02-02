"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityLoader = void 0;
const QueryHelper_1 = require("../utils/QueryHelper");
const Utils_1 = require("../utils/Utils");
const errors_1 = require("../errors");
const enums_1 = require("../enums");
const Reference_1 = require("./Reference");
class EntityLoader {
    constructor(em) {
        this.em = em;
        this.metadata = this.em.getMetadata();
        this.driver = this.em.getDriver();
    }
    /**
     * Loads specified relations in batch. This will execute one query for each relation, that will populate it on all of the specified entities.
     */
    async populate(entityName, entities, populate, options) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (entities.length === 0 || populate === false) {
            return;
        }
        options.where = (_a = options.where) !== null && _a !== void 0 ? _a : {};
        options.orderBy = (_b = options.orderBy) !== null && _b !== void 0 ? _b : {};
        options.filters = (_c = options.filters) !== null && _c !== void 0 ? _c : {};
        options.lookup = (_d = options.lookup) !== null && _d !== void 0 ? _d : true;
        options.validate = (_e = options.validate) !== null && _e !== void 0 ? _e : true;
        options.refresh = (_f = options.refresh) !== null && _f !== void 0 ? _f : false;
        options.convertCustomTypes = (_g = options.convertCustomTypes) !== null && _g !== void 0 ? _g : true;
        populate = this.normalizePopulate(entityName, populate, options.strategy, options.lookup);
        const invalid = populate.find(({ field }) => !this.em.canPopulate(entityName, field));
        if (options.validate && invalid) {
            throw errors_1.ValidationError.invalidPropertyName(entityName, invalid.field);
        }
        entities.forEach(e => { var _a; return e.__helper.__serializationContext.populate = (_a = e.__helper.__serializationContext.populate) !== null && _a !== void 0 ? _a : populate; });
        for (const pop of populate) {
            await this.populateField(entityName, entities, pop, options);
        }
    }
    normalizePopulate(entityName, populate, strategy, lookup = true) {
        if (populate === true || populate.some(p => p.all)) {
            populate = this.lookupAllRelationships(entityName, strategy);
        }
        else {
            populate = Utils_1.Utils.asArray(populate);
        }
        if (lookup) {
            populate = this.lookupEagerLoadedRelationships(entityName, populate, strategy);
        }
        // convert nested `field` with dot syntax to PopulateOptions with children array
        populate.forEach(p => {
            if (!p.field.includes('.')) {
                return;
            }
            const [f, ...parts] = p.field.split('.');
            p.field = f;
            p.children = p.children || [];
            const prop = this.metadata.find(entityName).properties[f];
            p.children.push(this.expandNestedPopulate(prop.type, parts, p.strategy));
        });
        // merge same fields
        return this.mergeNestedPopulate(populate);
    }
    /**
     * merge multiple populates for the same entity with different children
     */
    mergeNestedPopulate(populate) {
        const tmp = populate.reduce((ret, item) => {
            if (!ret[item.field]) {
                ret[item.field] = item;
                return ret;
            }
            if (!ret[item.field].children && item.children) {
                ret[item.field].children = item.children;
            }
            else if (ret[item.field].children && item.children) {
                ret[item.field].children.push(...item.children);
            }
            return ret;
        }, {});
        return Object.values(tmp).map(item => {
            if (item.children) {
                item.children = this.mergeNestedPopulate(item.children);
            }
            return item;
        });
    }
    /**
     * Expands `books.perex` like populate to use `children` array instead of the dot syntax
     */
    expandNestedPopulate(entityName, parts, strategy) {
        const meta = this.metadata.find(entityName);
        const field = parts.shift();
        const prop = meta.properties[field];
        const ret = { field, strategy };
        if (parts.length > 0) {
            ret.children = [this.expandNestedPopulate(prop.type, parts, strategy)];
        }
        return ret;
    }
    /**
     * preload everything in one call (this will update already existing references in IM)
     */
    async populateMany(entityName, entities, populate, options) {
        const field = populate.field;
        const meta = this.metadata.find(entityName);
        const prop = meta.properties[field];
        if ((prop.reference === enums_1.ReferenceType.SCALAR && prop.lazy) || prop.reference === enums_1.ReferenceType.EMBEDDED) {
            return [];
        }
        // set populate flag
        entities.forEach(entity => {
            const value = entity[field];
            if (Utils_1.Utils.isEntity(value, true)) {
                value.__helper.populated();
            }
            else if (Utils_1.Utils.isCollection(value)) {
                value.populated();
            }
        });
        const filtered = this.filterCollections(entities, field, options.refresh);
        const innerOrderBy = Utils_1.Utils.isObject(options.orderBy[prop.name]) ? options.orderBy[prop.name] : undefined;
        if (prop.reference === enums_1.ReferenceType.MANY_TO_MANY && this.driver.getPlatform().usesPivotTable()) {
            return this.findChildrenFromPivotTable(filtered, prop, options, innerOrderBy, populate);
        }
        const where = await this.extractChildCondition(options, prop);
        const data = await this.findChildren(entities, prop, populate, Object.assign(Object.assign({}, options), { where, orderBy: innerOrderBy }));
        this.initializeCollections(filtered, prop, field, data);
        return data;
    }
    initializeCollections(filtered, prop, field, children) {
        if (prop.reference === enums_1.ReferenceType.ONE_TO_MANY) {
            this.initializeOneToMany(filtered, children, prop, field);
        }
        if (prop.reference === enums_1.ReferenceType.MANY_TO_MANY && !prop.owner && !this.driver.getPlatform().usesPivotTable()) {
            this.initializeManyToMany(filtered, children, prop, field);
        }
    }
    initializeOneToMany(filtered, children, prop, field) {
        for (const entity of filtered) {
            const items = children.filter(child => {
                if (prop.targetMeta.properties[prop.mappedBy].mapToPk) {
                    return child[prop.mappedBy] === entity.__helper.getPrimaryKey();
                }
                return Reference_1.Reference.unwrapReference(child[prop.mappedBy]) === entity;
            });
            entity[field].hydrate(items);
        }
    }
    initializeManyToMany(filtered, children, prop, field) {
        for (const entity of filtered) {
            const items = children.filter(child => child[prop.mappedBy].contains(entity));
            entity[field].hydrate(items);
        }
    }
    async findChildren(entities, prop, populate, options) {
        const children = this.getChildReferences(entities, prop, options.refresh);
        const meta = this.metadata.find(prop.type);
        let fk = Utils_1.Utils.getPrimaryKeyHash(meta.primaryKeys);
        if (prop.reference === enums_1.ReferenceType.ONE_TO_MANY || (prop.reference === enums_1.ReferenceType.MANY_TO_MANY && !prop.owner)) {
            fk = meta.properties[prop.mappedBy].name;
        }
        if (prop.reference === enums_1.ReferenceType.ONE_TO_ONE && !prop.owner && populate.strategy !== enums_1.LoadStrategy.JOINED && !this.em.config.get('autoJoinOneToOneOwner')) {
            children.length = 0;
            children.push(...entities);
            fk = meta.properties[prop.mappedBy].name;
        }
        if (children.length === 0) {
            return [];
        }
        const ids = Utils_1.Utils.unique(children.map(e => Utils_1.Utils.getPrimaryKeyValues(e, e.__meta.primaryKeys, true)));
        const where = Object.assign(Object.assign({}, QueryHelper_1.QueryHelper.processWhere({ [fk]: { $in: ids } }, meta.name, this.metadata, this.driver.getPlatform(), !options.convertCustomTypes)), options.where);
        const fields = this.buildFields(prop, options);
        return this.em.find(prop.type, where, {
            orderBy: options.orderBy || prop.orderBy || { [fk]: enums_1.QueryOrder.ASC },
            refresh: options.refresh,
            filters: options.filters,
            convertCustomTypes: options.convertCustomTypes,
            populate: populate.children,
            fields: fields.length > 0 ? fields : undefined,
        });
    }
    async populateField(entityName, entities, populate, options) {
        if (!populate.children) {
            return void await this.populateMany(entityName, entities, populate, options);
        }
        await this.populateMany(entityName, entities, populate, options);
        const prop = this.metadata.find(entityName).properties[populate.field];
        const children = [];
        for (const entity of entities) {
            if (Utils_1.Utils.isEntity(entity[populate.field])) {
                children.push(entity[populate.field]);
            }
            else if (Reference_1.Reference.isReference(entity[populate.field])) {
                children.push(entity[populate.field].unwrap());
            }
            else if (Utils_1.Utils.isCollection(entity[populate.field])) {
                children.push(...entity[populate.field].getItems());
            }
            else if (entity[populate.field] && prop.reference === enums_1.ReferenceType.EMBEDDED) {
                children.push(...Utils_1.Utils.asArray(entity[populate.field]));
            }
        }
        const filtered = Utils_1.Utils.unique(children);
        const fields = this.buildFields(prop, options);
        await this.populate(prop.type, filtered, populate.children, {
            where: await this.extractChildCondition(options, prop, false),
            orderBy: options.orderBy[prop.name],
            refresh: options.refresh,
            fields: fields.length > 0 ? fields : undefined,
            filters: options.filters,
            validate: false,
            lookup: false,
        });
    }
    async findChildrenFromPivotTable(filtered, prop, options, orderBy, populate) {
        var _a;
        const ids = filtered.map((e) => e.__helper.__primaryKeys);
        const refresh = options.refresh;
        const where = await this.extractChildCondition(options, prop, true);
        const fields = this.buildFields(prop, options);
        const options2 = Object.assign({}, options);
        options2.fields = (fields.length > 0 ? fields : undefined);
        /* istanbul ignore next */
        options2.populate = ((_a = populate === null || populate === void 0 ? void 0 : populate.children) !== null && _a !== void 0 ? _a : []);
        if (prop.customType) {
            ids.forEach((id, idx) => ids[idx] = QueryHelper_1.QueryHelper.processCustomType(prop, id, this.driver.getPlatform()));
        }
        const map = await this.driver.loadFromPivotTable(prop, ids, where, orderBy, this.em.getTransactionContext(), options2);
        const children = [];
        for (const entity of filtered) {
            const items = map[entity.__helper.getSerializedPrimaryKey()].map(item => {
                const entity = this.em.getEntityFactory().create(prop.type, item, { refresh, merge: true, convertCustomTypes: true });
                return this.em.getUnitOfWork().registerManaged(entity, item, refresh);
            });
            entity[prop.name].hydrate(items);
            children.push(...items);
        }
        return children;
    }
    async extractChildCondition(options, prop, filters = false) {
        var _a;
        const subCond = Utils_1.Utils.isPlainObject(options.where[prop.name]) ? options.where[prop.name] : {};
        const meta2 = this.metadata.find(prop.type);
        const pk = Utils_1.Utils.getPrimaryKeyHash(meta2.primaryKeys);
        ['$and', '$or'].forEach(op => {
            if (options.where[op]) {
                const child = options.where[op]
                    .map((cond) => cond[prop.name])
                    .filter((sub) => sub != null && !(Utils_1.Utils.isPlainObject(sub) && Object.keys(sub).every(key => Utils_1.Utils.isOperator(key, false))))
                    .map((cond) => {
                    if (Utils_1.Utils.isPrimaryKey(cond)) {
                        return { [pk]: cond };
                    }
                    return cond;
                });
                if (child.length > 0) {
                    subCond[op] = child;
                }
            }
        });
        const operators = Object.keys(subCond).filter(key => Utils_1.Utils.isOperator(key, false));
        if (operators.length > 0) {
            operators.forEach(op => {
                var _a;
                /* istanbul ignore next */
                subCond[pk] = (_a = subCond[pk]) !== null && _a !== void 0 ? _a : {};
                subCond[pk][op] = subCond[op];
                delete subCond[op];
            });
        }
        if (filters) {
            /* istanbul ignore next */
            return this.em.applyFilters(prop.type, subCond, (_a = options.filters) !== null && _a !== void 0 ? _a : {}, 'read');
        }
        return subCond;
    }
    buildFields(prop, options) {
        return (options.fields || []).reduce((ret, f) => {
            if (Utils_1.Utils.isPlainObject(f)) {
                Object.keys(f)
                    .filter(ff => ff === prop.name)
                    .forEach(ff => ret.push(...f[ff]));
            }
            else if (f.toString().includes('.')) {
                const parts = f.toString().split('.');
                const propName = parts.shift();
                const childPropName = parts.join('.');
                /* istanbul ignore else */
                if (propName === prop.name) {
                    ret.push(childPropName);
                }
            }
            return ret;
        }, []);
    }
    getChildReferences(entities, prop, refresh) {
        const filtered = this.filterCollections(entities, prop.name, refresh);
        const children = [];
        if (prop.reference === enums_1.ReferenceType.ONE_TO_MANY) {
            children.push(...filtered.map(e => e[prop.name].owner));
        }
        else if (prop.reference === enums_1.ReferenceType.MANY_TO_MANY && prop.owner) {
            children.push(...filtered.reduce((a, b) => [...a, ...b[prop.name].getItems()], []));
        }
        else if (prop.reference === enums_1.ReferenceType.MANY_TO_MANY) { // inverse side
            children.push(...filtered);
        }
        else { // MANY_TO_ONE or ONE_TO_ONE
            children.push(...this.filterReferences(entities, prop.name, refresh));
        }
        return children;
    }
    filterCollections(entities, field, refresh) {
        if (refresh) {
            return entities.filter(e => e[field]);
        }
        return entities.filter(e => Utils_1.Utils.isCollection(e[field]) && !e[field].isInitialized(true));
    }
    filterReferences(entities, field, refresh) {
        const children = entities.filter(e => Utils_1.Utils.isEntity(e[field], true));
        if (refresh) {
            return children.map(e => Reference_1.Reference.unwrapReference(e[field]));
        }
        return children.filter(e => !e[field].__helper.__initialized).map(e => Reference_1.Reference.unwrapReference(e[field]));
    }
    lookupAllRelationships(entityName, strategy, prefix = '', visited = []) {
        if (visited.includes(entityName)) {
            return [];
        }
        visited.push(entityName);
        const ret = [];
        const meta = this.metadata.find(entityName);
        meta.relations.forEach(prop => {
            var _a;
            const prefixed = prefix ? `${prefix}.${prop.name}` : prop.name;
            const nested = this.lookupAllRelationships(prop.type, strategy, prefixed, visited);
            if (nested.length > 0) {
                ret.push(...nested);
            }
            else {
                ret.push({
                    field: prefixed,
                    strategy: (_a = strategy !== null && strategy !== void 0 ? strategy : prop.strategy) !== null && _a !== void 0 ? _a : this.em.config.get('loadStrategy'),
                });
            }
        });
        return ret;
    }
    lookupEagerLoadedRelationships(entityName, populate, strategy, prefix = '', visited = []) {
        if (visited.includes(entityName)) {
            return [];
        }
        visited.push(entityName);
        const meta = this.metadata.find(entityName);
        const ret = prefix === '' ? [...populate] : [];
        meta.relations
            .filter(prop => prop.eager || populate.some(p => p.field === prop.name))
            .forEach(prop => {
            var _a, _b, _c;
            const prefixed = prefix ? `${prefix}.${prop.name}` : prop.name;
            /* istanbul ignore next */
            const nestedPopulate = (_b = (_a = populate.find(p => p.field === prop.name)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
            const nested = this.lookupEagerLoadedRelationships(prop.type, nestedPopulate, strategy, prefixed, visited);
            if (nested.length > 0) {
                ret.push(...nested);
            }
            else {
                ret.push({
                    field: prefixed,
                    strategy: (_c = strategy !== null && strategy !== void 0 ? strategy : prop.strategy) !== null && _c !== void 0 ? _c : this.em.config.get('loadStrategy'),
                });
            }
        });
        return ret;
    }
}
exports.EntityLoader = EntityLoader;
