"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataDiscovery = void 0;
const path_1 = require("path");
const globby_1 = __importDefault(require("globby"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const typings_1 = require("../typings");
const Utils_1 = require("../utils/Utils");
const MetadataValidator_1 = require("./MetadataValidator");
const MetadataStorage_1 = require("./MetadataStorage");
const EntitySchema_1 = require("./EntitySchema");
const enums_1 = require("../enums");
const errors_1 = require("../errors");
const types_1 = require("../types");
class MetadataDiscovery {
    constructor(metadata, platform, config) {
        this.metadata = metadata;
        this.platform = platform;
        this.config = config;
        this.namingStrategy = this.config.getNamingStrategy();
        this.metadataProvider = this.config.getMetadataProvider();
        this.cache = this.config.getCacheAdapter();
        this.logger = this.config.getLogger();
        this.schemaHelper = this.platform.getSchemaHelper();
        this.validator = new MetadataValidator_1.MetadataValidator();
        this.discovered = [];
    }
    async discover(preferTsNode = true) {
        const startTime = Date.now();
        this.logger.log('discovery', `ORM entity discovery started, using ${ansi_colors_1.default.cyan(this.metadataProvider.constructor.name)}`);
        await this.findEntities(preferTsNode);
        this.processDiscoveredEntities(this.discovered);
        const diff = Date.now() - startTime;
        this.logger.log('discovery', `- entity discovery finished, found ${ansi_colors_1.default.green('' + this.discovered.length)} entities, took ${ansi_colors_1.default.green(`${diff} ms`)}`);
        const discovered = new MetadataStorage_1.MetadataStorage();
        this.discovered
            .filter(meta => meta.name)
            .forEach(meta => discovered.set(meta.name, meta));
        return discovered;
    }
    processDiscoveredEntities(discovered) {
        for (const meta of discovered) {
            let i = 1;
            Object.values(meta.properties).forEach(prop => meta.propertyOrder.set(prop.name, i++));
        }
        // ignore base entities (not annotated with @Entity)
        const filtered = discovered.filter(meta => meta.name);
        filtered.forEach(meta => this.initSingleTableInheritance(meta, filtered));
        filtered.forEach(meta => this.defineBaseEntityProperties(meta));
        filtered.forEach(meta => this.metadata.set(meta.className, EntitySchema_1.EntitySchema.fromMetadata(meta).init().meta));
        filtered.forEach(meta => this.initAutoincrement(meta));
        filtered.forEach(meta => Object.values(meta.properties).forEach(prop => this.initEmbeddables(meta, prop)));
        filtered.forEach(meta => Object.values(meta.properties).forEach(prop => this.initFactoryField(prop)));
        filtered.forEach(meta => Object.values(meta.properties).forEach(prop => this.initFieldName(prop)));
        filtered.forEach(meta => Object.values(meta.properties).forEach(prop => this.initVersionProperty(meta, prop)));
        filtered.forEach(meta => Object.values(meta.properties).forEach(prop => this.initCustomType(meta, prop)));
        filtered.forEach(meta => Object.values(meta.properties).forEach(prop => this.initColumnType(prop, meta.path)));
        filtered.forEach(meta => Object.values(meta.properties).forEach(prop => this.initIndexes(prop)));
        filtered.forEach(meta => this.autoWireBidirectionalProperties(meta));
        filtered.forEach(meta => discovered.push(...this.processEntity(meta)));
        discovered.forEach(meta => meta.sync(true));
        return discovered.map(meta => this.metadata.get(meta.className));
    }
    async findEntities(preferTsNode) {
        this.discovered.length = 0;
        const key = (preferTsNode && this.config.get('tsNode', Utils_1.Utils.detectTsNode()) && this.config.get('entitiesTs').length > 0) ? 'entitiesTs' : 'entities';
        const paths = this.config.get(key).filter(item => Utils_1.Utils.isString(item));
        const refs = this.config.get(key).filter(item => !Utils_1.Utils.isString(item));
        if (this.config.get('discovery').requireEntitiesArray && paths.length > 0) {
            throw new Error(`[requireEntitiesArray] Explicit list of entities is required, please use the 'entities' option.`);
        }
        await this.discoverDirectories(paths);
        await this.discoverReferences(refs);
        this.validator.validateDiscovered(this.discovered, this.config.get('discovery').warnWhenNoEntities);
        return this.discovered;
    }
    async discoverDirectories(paths) {
        if (paths.length === 0) {
            return;
        }
        paths = paths.map(path => Utils_1.Utils.normalizePath(path));
        const files = await globby_1.default(paths, { cwd: Utils_1.Utils.normalizePath(this.config.get('baseDir')) });
        this.logger.log('discovery', `- processing ${ansi_colors_1.default.cyan('' + files.length)} files`);
        const found = [];
        for (const filepath of files) {
            const filename = path_1.basename(filepath);
            if (!filename.match(/\.[jt]s$/) ||
                filename.endsWith('.js.map') ||
                filename.endsWith('.d.ts') ||
                filename.startsWith('.') ||
                filename.match(/index\.[jt]s$/)) {
                this.logger.log('discovery', `- ignoring file ${filename}`);
                continue;
            }
            const name = this.namingStrategy.getClassName(filename);
            const path = Utils_1.Utils.normalizePath(...(path_1.isAbsolute(filepath) ? [filepath] : [this.config.get('baseDir'), filepath]));
            const targets = this.getEntityClassOrSchema(path, name);
            for (const target of targets) {
                if (!(target instanceof Function) && !(target instanceof EntitySchema_1.EntitySchema)) {
                    this.logger.log('discovery', `- ignoring file ${filename}`);
                    continue;
                }
                this.metadata.set(name, Utils_1.Utils.copy(MetadataStorage_1.MetadataStorage.getMetadata(name, path)));
                const entity = this.prepare(target);
                const schema = this.getSchema(entity);
                const meta = schema.init().meta;
                this.metadata.set(meta.className, meta);
                found.push([entity, path]);
            }
        }
        for (const [entity, path] of found) {
            await this.discoverEntity(entity, path);
        }
    }
    async discoverReferences(refs) {
        const found = [];
        for (const entity of refs) {
            const schema = this.getSchema(this.prepare(entity));
            const meta = schema.init().meta;
            this.metadata.set(meta.className, meta);
            found.push(entity);
        }
        for (const entity of found) {
            await this.discoverEntity(entity);
        }
        // discover parents (base entities) automatically
        for (const meta of Object.values(this.metadata.getAll())) {
            if (!meta.class) {
                continue;
            }
            const parent = Object.getPrototypeOf(meta.class);
            if (parent.name !== '' && !this.metadata.has(parent.name)) {
                await this.discoverReferences([parent]);
            }
        }
        return this.discovered.filter(meta => found.find(m => m.name === meta.className));
    }
    prepare(entity) {
        if ('schema' in entity && entity.schema instanceof EntitySchema_1.EntitySchema) {
            return entity.schema;
        }
        // save path to entity from schema
        if ('entity' in entity && 'schema' in entity) {
            const meta = this.metadata.get(entity.entity.name, true);
            meta.path = entity.schema.path;
            return entity.entity;
        }
        return entity;
    }
    getSchema(entity) {
        var _a;
        if (entity instanceof EntitySchema_1.EntitySchema) {
            return entity;
        }
        const path = entity.__path;
        if (path) {
            const meta = Utils_1.Utils.copy(MetadataStorage_1.MetadataStorage.getMetadata(entity.name, path));
            meta.path = Utils_1.Utils.relativePath(path, this.config.get('baseDir'));
            this.metadata.set(entity.name, meta);
        }
        const exists = this.metadata.has(entity.name);
        const meta = this.metadata.get(entity.name, true);
        meta.abstract = (_a = meta.abstract) !== null && _a !== void 0 ? _a : !(exists && meta.name);
        const schema = EntitySchema_1.EntitySchema.fromMetadata(meta);
        schema.setClass(entity);
        schema.meta.useCache = this.metadataProvider.useCache();
        return schema;
    }
    async discoverEntity(entity, path) {
        entity = this.prepare(entity);
        this.logger.log('discovery', `- processing entity ${ansi_colors_1.default.cyan(entity.name)}${ansi_colors_1.default.grey(path ? ` (${path})` : '')}`);
        const schema = this.getSchema(entity);
        const meta = schema.init().meta;
        const root = Utils_1.Utils.getRootEntity(this.metadata, meta);
        this.metadata.set(meta.className, meta);
        schema.meta.path = Utils_1.Utils.relativePath(path || meta.path, this.config.get('baseDir'));
        const cache = meta.useCache && meta.path && await this.cache.get(meta.className + path_1.extname(meta.path));
        if (cache) {
            this.logger.log('discovery', `- using cached metadata for entity ${ansi_colors_1.default.cyan(meta.className)}`);
            this.metadataProvider.loadFromCache(meta, cache);
            meta.root = root;
            this.discovered.push(meta);
            return;
        }
        if (!(entity instanceof EntitySchema_1.EntitySchema)) {
            await this.metadataProvider.loadEntityMetadata(meta, meta.className);
        }
        if (!meta.collection && meta.name) {
            const entityName = root.discriminatorColumn ? root.name : meta.name;
            meta.collection = this.namingStrategy.classToTableName(entityName);
        }
        delete meta.root; // to allow caching (as root can contain cycles)
        await this.saveToCache(meta);
        meta.root = root;
        this.discovered.push(meta);
    }
    async saveToCache(meta) {
        if (!meta.useCache) {
            return;
        }
        const copy = Object.assign({}, meta);
        delete copy.prototype;
        // base entity without properties might not have path, but nothing to cache there
        if (meta.path) {
            await this.cache.set(meta.className + path_1.extname(meta.path), copy, meta.path);
        }
    }
    applyNamingStrategy(meta, prop) {
        if (!prop.fieldNames) {
            this.initFieldName(prop);
        }
        if (prop.reference === enums_1.ReferenceType.MANY_TO_MANY) {
            this.initManyToManyFields(meta, prop);
        }
        if ([enums_1.ReferenceType.MANY_TO_ONE, enums_1.ReferenceType.ONE_TO_ONE].includes(prop.reference)) {
            this.initManyToOneFields(prop);
        }
        if (prop.reference === enums_1.ReferenceType.ONE_TO_MANY) {
            this.initOneToManyFields(prop);
        }
    }
    initFieldName(prop) {
        if (prop.fieldNames && prop.fieldNames.length > 0) {
            return;
        }
        if (prop.reference === enums_1.ReferenceType.SCALAR || (prop.reference === enums_1.ReferenceType.EMBEDDED && prop.object)) {
            prop.fieldNames = [this.namingStrategy.propertyToColumnName(prop.name)];
        }
        else if ([enums_1.ReferenceType.MANY_TO_ONE, enums_1.ReferenceType.ONE_TO_ONE].includes(prop.reference)) {
            prop.fieldNames = this.initManyToOneFieldName(prop, prop.name);
        }
        else if (prop.reference === enums_1.ReferenceType.MANY_TO_MANY && prop.owner) {
            prop.fieldNames = this.initManyToManyFieldName(prop, prop.name);
        }
    }
    initManyToOneFieldName(prop, name) {
        const meta2 = this.metadata.get(prop.type);
        const ret = [];
        for (const primaryKey of meta2.primaryKeys) {
            this.initFieldName(meta2.properties[primaryKey]);
            for (const fieldName of meta2.properties[primaryKey].fieldNames) {
                ret.push(this.namingStrategy.joinKeyColumnName(name, fieldName, meta2.compositePK));
            }
        }
        return ret;
    }
    initManyToManyFieldName(prop, name) {
        const meta2 = this.metadata.get(prop.type);
        return meta2.primaryKeys.map(() => this.namingStrategy.propertyToColumnName(name));
    }
    initManyToManyFields(meta, prop) {
        const meta2 = this.metadata.get(prop.type);
        Utils_1.Utils.defaultValue(prop, 'fixedOrder', !!prop.fixedOrderColumn);
        if (!prop.pivotTable && prop.owner && this.platform.usesPivotTable()) {
            prop.pivotTable = this.namingStrategy.joinTableName(meta.collection, meta2.collection, prop.name);
        }
        if (prop.mappedBy) {
            const prop2 = meta2.properties[prop.mappedBy];
            this.initManyToManyFields(meta2, prop2);
            prop.pivotTable = prop2.pivotTable;
            prop.fixedOrder = prop2.fixedOrder;
            prop.fixedOrderColumn = prop2.fixedOrderColumn;
            prop.joinColumns = prop2.inverseJoinColumns;
            prop.inverseJoinColumns = prop2.joinColumns;
        }
        if (!prop.referencedColumnNames) {
            prop.referencedColumnNames = Utils_1.Utils.flatten(meta.primaryKeys.map(primaryKey => meta.properties[primaryKey].fieldNames));
        }
        if (!prop.joinColumns) {
            prop.joinColumns = prop.referencedColumnNames.map(referencedColumnName => this.namingStrategy.joinKeyColumnName(meta.root.className, referencedColumnName, meta.compositePK));
        }
        if (!prop.inverseJoinColumns) {
            const meta2 = this.metadata.get(prop.type);
            prop.inverseJoinColumns = this.initManyToOneFieldName(prop, meta2.root.className);
        }
    }
    initManyToOneFields(prop) {
        const meta2 = this.metadata.get(prop.type);
        const fieldNames = Utils_1.Utils.flatten(meta2.primaryKeys.map(primaryKey => meta2.properties[primaryKey].fieldNames));
        Utils_1.Utils.defaultValue(prop, 'referencedTableName', meta2.collection);
        if (!prop.joinColumns) {
            prop.joinColumns = fieldNames.map(fieldName => this.namingStrategy.joinKeyColumnName(prop.name, fieldName, fieldNames.length > 1));
        }
        if (!prop.referencedColumnNames) {
            prop.referencedColumnNames = fieldNames;
        }
    }
    initOneToManyFields(prop) {
        const meta2 = this.metadata.get(prop.type);
        if (!prop.joinColumns) {
            prop.joinColumns = [this.namingStrategy.joinColumnName(prop.name)];
        }
        if (!prop.referencedColumnNames) {
            meta2.getPrimaryProps().forEach(pk => this.applyNamingStrategy(meta2, pk));
            prop.referencedColumnNames = Utils_1.Utils.flatten(meta2.getPrimaryProps().map(pk => pk.fieldNames));
        }
    }
    processEntity(meta) {
        const pks = Object.values(meta.properties).filter(prop => prop.primary);
        meta.primaryKeys = pks.map(prop => prop.name);
        meta.compositePK = pks.length > 1;
        meta.forceConstructor = this.shouldForceConstructorUsage(meta);
        this.validator.validateEntityDefinition(this.metadata, meta.name);
        Object.values(meta.properties).forEach(prop => {
            this.applyNamingStrategy(meta, prop);
            this.initDefaultValue(prop);
            this.initVersionProperty(meta, prop);
            this.initCustomType(meta, prop);
            this.initColumnType(prop, meta.path);
            this.initRelation(prop);
        });
        meta.serializedPrimaryKey = this.platform.getSerializedPrimaryKeyField(meta.primaryKeys[0]);
        const serializedPKProp = meta.properties[meta.serializedPrimaryKey];
        if (serializedPKProp && meta.serializedPrimaryKey !== meta.primaryKeys[0]) {
            serializedPKProp.persist = false;
        }
        const ret = [];
        if (this.platform.usesPivotTable()) {
            Object
                .values(meta.properties)
                .filter(prop => prop.reference === enums_1.ReferenceType.MANY_TO_MANY && prop.owner && prop.pivotTable)
                .map(prop => this.definePivotTableEntity(meta, prop))
                .forEach(meta => ret.push(meta));
        }
        return ret;
    }
    initFactoryField(prop) {
        ['mappedBy', 'inversedBy'].forEach(type => {
            const value = prop[type];
            if (value instanceof Function) {
                const meta2 = this.metadata.get(prop.type);
                prop[type] = value(meta2.properties).name;
            }
        });
    }
    definePivotTableEntity(meta, prop) {
        const data = new typings_1.EntityMetadata({
            name: prop.pivotTable,
            className: prop.pivotTable,
            collection: prop.pivotTable,
            pivotTable: true,
        });
        if (prop.fixedOrder) {
            const primaryProp = this.defineFixedOrderProperty(prop);
            data.properties[primaryProp.name] = primaryProp;
            data.primaryKeys = [primaryProp.name];
        }
        else {
            data.primaryKeys = [meta.name + '_owner', prop.type + '_inverse'];
            data.compositePK = true;
        }
        // handle self-referenced m:n with same default field names
        if (meta.name === prop.type && prop.joinColumns.every((joinColumn, idx) => joinColumn === prop.inverseJoinColumns[idx])) {
            prop.joinColumns = prop.referencedColumnNames.map(name => this.namingStrategy.joinKeyColumnName(meta.root.className + '_1', name, meta.compositePK));
            prop.inverseJoinColumns = prop.referencedColumnNames.map(name => this.namingStrategy.joinKeyColumnName(meta.root.className + '_2', name, meta.compositePK));
            if (prop.inversedBy) {
                const prop2 = this.metadata.get(prop.type).properties[prop.inversedBy];
                prop2.inverseJoinColumns = prop.joinColumns;
                prop2.joinColumns = prop.inverseJoinColumns;
            }
        }
        data.properties[meta.name + '_owner'] = this.definePivotProperty(prop, meta.name + '_owner', meta.name, prop.type + '_inverse', true);
        data.properties[prop.type + '_inverse'] = this.definePivotProperty(prop, prop.type + '_inverse', prop.type, meta.name + '_owner', false);
        return this.metadata.set(prop.pivotTable, data);
    }
    defineFixedOrderProperty(prop) {
        const pk = prop.fixedOrderColumn || this.namingStrategy.referenceColumnName();
        const primaryProp = {
            name: pk,
            type: 'number',
            reference: enums_1.ReferenceType.SCALAR,
            primary: true,
            autoincrement: true,
            unsigned: this.platform.supportsUnsigned(),
        };
        this.initFieldName(primaryProp);
        this.initColumnType(primaryProp);
        prop.fixedOrderColumn = pk;
        if (prop.inversedBy) {
            const prop2 = this.metadata.get(prop.type).properties[prop.inversedBy];
            prop2.fixedOrder = true;
            prop2.fixedOrderColumn = pk;
        }
        return primaryProp;
    }
    definePivotProperty(prop, name, type, inverse, owner) {
        const ret = {
            name,
            type,
            reference: enums_1.ReferenceType.MANY_TO_ONE,
            cascade: [enums_1.Cascade.ALL],
            fixedOrder: prop.fixedOrder,
            fixedOrderColumn: prop.fixedOrderColumn,
            index: this.platform.indexForeignKeys(),
            primary: !prop.fixedOrder,
            autoincrement: false,
        };
        const meta = this.metadata.get(type);
        ret.targetMeta = meta;
        ret.joinColumns = [];
        ret.inverseJoinColumns = [];
        ret.referencedTableName = meta.collection;
        if (owner) {
            ret.owner = true;
            ret.inversedBy = inverse;
            ret.referencedColumnNames = prop.referencedColumnNames;
            ret.fieldNames = ret.joinColumns = prop.joinColumns;
            ret.inverseJoinColumns = prop.referencedColumnNames;
            meta.primaryKeys.forEach(primaryKey => {
                const prop2 = meta.properties[primaryKey];
                ret.length = prop2.length;
                ret.precision = prop2.precision;
                ret.scale = prop2.scale;
            });
        }
        else {
            ret.owner = false;
            ret.mappedBy = inverse;
            ret.fieldNames = ret.joinColumns = prop.inverseJoinColumns;
            ret.referencedColumnNames = [];
            ret.inverseJoinColumns = [];
            ret.referencedTableName = meta.collection;
            meta.primaryKeys.forEach(primaryKey => {
                const prop2 = meta.properties[primaryKey];
                ret.referencedColumnNames.push(...prop2.fieldNames);
                ret.inverseJoinColumns.push(...prop2.fieldNames);
                ret.length = prop2.length;
                ret.precision = prop2.precision;
                ret.scale = prop2.scale;
            });
        }
        this.initColumnType(ret);
        return ret;
    }
    autoWireBidirectionalProperties(meta) {
        Object.values(meta.properties)
            .filter(prop => prop.reference !== enums_1.ReferenceType.SCALAR && !prop.owner && prop.mappedBy)
            .forEach(prop => {
            const meta2 = this.metadata.get(prop.type);
            const prop2 = meta2.properties[prop.mappedBy];
            if (prop2 && !prop2.inversedBy) {
                prop2.inversedBy = prop.name;
            }
        });
    }
    defineBaseEntityProperties(meta) {
        const base = meta.extends && this.metadata.get(meta.extends);
        if (!base || base === meta) { // make sure we do not fall into infinite loop
            return 0;
        }
        let order = this.defineBaseEntityProperties(base);
        const old = Object.values(meta.properties).map(x => x.name);
        meta.properties = Object.assign(Object.assign({}, base.properties), meta.properties);
        meta.filters = Object.assign(Object.assign({}, base.filters), meta.filters);
        if (!meta.discriminatorValue) {
            Object.values(base.properties).filter(prop => !old.includes(prop.name)).forEach(prop => {
                meta.properties[prop.name] = Object.assign({}, prop);
                meta.propertyOrder.set(prop.name, (order += 0.01));
            });
        }
        meta.indexes = Utils_1.Utils.unique([...base.indexes, ...meta.indexes]);
        meta.uniques = Utils_1.Utils.unique([...base.uniques, ...meta.uniques]);
        const pks = Object.values(meta.properties).filter(p => p.primary).map(p => p.name);
        if (pks.length > 0 && meta.primaryKeys.length === 0) {
            meta.primaryKeys = pks;
        }
        Object.keys(base.hooks).forEach(type => {
            meta.hooks[type] = Utils_1.Utils.unique([...base.hooks[type], ...(meta.hooks[type] || [])]);
        });
        if (meta.constructorParams.length === 0 && base.constructorParams.length > 0) {
            meta.constructorParams = [...base.constructorParams];
        }
        if (meta.toJsonParams.length === 0 && base.toJsonParams.length > 0) {
            meta.toJsonParams = [...base.toJsonParams];
        }
        return order;
    }
    initEmbeddables(meta, embeddedProp, visited = new WeakSet()) {
        if (embeddedProp.reference !== enums_1.ReferenceType.EMBEDDED || visited.has(embeddedProp)) {
            return;
        }
        visited.add(embeddedProp);
        const embeddable = this.discovered.find(m => m.name === embeddedProp.type);
        embeddedProp.embeddable = embeddable.class;
        embeddedProp.embeddedProps = {};
        let order = meta.propertyOrder.get(embeddedProp.name);
        const getRootProperty = (prop) => prop.embedded ? getRootProperty(meta.properties[prop.embedded[0]]) : prop;
        for (const prop of Object.values(embeddable.properties)) {
            const prefix = embeddedProp.prefix === false ? '' : embeddedProp.prefix === true ? embeddedProp.name + '_' : embeddedProp.prefix;
            const name = prefix + prop.name;
            if (meta.properties[name] !== undefined && getRootProperty(meta.properties[name]).reference !== enums_1.ReferenceType.EMBEDDED) {
                throw errors_1.MetadataError.conflictingPropertyName(meta.className, name, embeddedProp.name);
            }
            meta.properties[name] = Utils_1.Utils.copy(prop);
            meta.properties[name].name = name;
            meta.properties[name].embedded = [embeddedProp.name, prop.name];
            meta.propertyOrder.set(name, (order += 0.01));
            embeddedProp.embeddedProps[prop.name] = meta.properties[name];
            if (embeddedProp.nullable) {
                meta.properties[name].nullable = true;
            }
            const isParentObject = (prop) => {
                if (prop.object) {
                    return true;
                }
                return prop.embedded ? isParentObject(meta.properties[prop.embedded[0]]) : false;
            };
            const rootProperty = getRootProperty(embeddedProp);
            if (isParentObject(embeddedProp)) {
                embeddedProp.object = true;
                this.initFieldName(embeddedProp);
                let path = [];
                let tmp = embeddedProp;
                while (tmp.embedded && tmp.object) {
                    path.unshift(tmp.embedded[1]);
                    tmp = meta.properties[tmp.embedded[0]];
                }
                if (tmp === rootProperty) {
                    path.unshift(this.namingStrategy.propertyToColumnName(rootProperty.name));
                }
                else {
                    path = [embeddedProp.fieldNames[0]];
                }
                path.push(prop.name);
                meta.properties[name].fieldNames = [path.join('.')]; // store path for ObjectHydrator
                meta.properties[name].fieldNameRaw = this.platform.getSearchJsonPropertySQL(path.join('->'), prop.type); // for querying in SQL drivers
                meta.properties[name].persist = false; // only virtual as we store the whole object
            }
            this.initEmbeddables(meta, meta.properties[name], visited);
        }
    }
    initSingleTableInheritance(meta, metadata) {
        var _a;
        if (meta.root !== meta && !meta.__processed) {
            meta.root = metadata.find(m => m.className === meta.root.className);
            meta.root.__processed = true;
        }
        else {
            delete meta.root.__processed;
        }
        if (!meta.root.discriminatorColumn) {
            return;
        }
        if (!meta.root.discriminatorMap) {
            meta.root.discriminatorMap = {};
            const children = metadata.filter(m => m.root.className === meta.root.className && !m.abstract);
            children.forEach(m => {
                const name = m.discriminatorValue || this.namingStrategy.classToTableName(m.className);
                meta.root.discriminatorMap[name] = m.className;
            });
        }
        meta.discriminatorValue = (_a = Object.entries(meta.root.discriminatorMap).find(([, className]) => className === meta.className)) === null || _a === void 0 ? void 0 : _a[0];
        if (!meta.root.properties[meta.root.discriminatorColumn]) {
            this.createDiscriminatorProperty(meta.root);
        }
        Utils_1.Utils.defaultValue(meta.root.properties[meta.root.discriminatorColumn], 'items', Object.keys(meta.root.discriminatorMap));
        Utils_1.Utils.defaultValue(meta.root.properties[meta.root.discriminatorColumn], 'index', true);
        if (meta.root === meta) {
            return;
        }
        Object.values(meta.properties).forEach(prop => {
            const exists = meta.root.properties[prop.name];
            prop = Utils_1.Utils.copy(prop);
            prop.nullable = true;
            if (!exists) {
                prop.inherited = true;
            }
            meta.root.addProperty(prop);
        });
        meta.root.indexes = Utils_1.Utils.unique([...meta.root.indexes, ...meta.indexes]);
        meta.root.uniques = Utils_1.Utils.unique([...meta.root.uniques, ...meta.uniques]);
    }
    createDiscriminatorProperty(meta) {
        meta.addProperty({
            name: meta.discriminatorColumn,
            type: 'string',
            enum: true,
            reference: enums_1.ReferenceType.SCALAR,
            userDefined: false,
        });
    }
    initAutoincrement(meta) {
        var _a;
        const pks = meta.getPrimaryProps();
        if (pks.length === 1 && this.isNumericProperty(pks[0])) {
            /* istanbul ignore next */
            pks[0].autoincrement = (_a = pks[0].autoincrement) !== null && _a !== void 0 ? _a : true;
        }
    }
    getDefaultVersionValue(prop) {
        var _a;
        if (typeof prop.defaultRaw !== 'undefined') {
            return prop.defaultRaw;
        }
        if (prop.type.toLowerCase() === 'date') {
            prop.length = (_a = prop.length) !== null && _a !== void 0 ? _a : this.platform.getDefaultVersionLength();
            return this.platform.getCurrentTimestampSQL(prop.length);
        }
        return '1';
    }
    initDefaultValue(prop) {
        if (prop.defaultRaw || !('default' in prop)) {
            return;
        }
        let val = prop.default;
        if (prop.customType instanceof types_1.ArrayType && Array.isArray(prop.default)) {
            val = prop.customType.convertToDatabaseValue(prop.default, this.platform);
        }
        prop.defaultRaw = typeof val === 'string' ? `'${val}'` : '' + val;
    }
    initVersionProperty(meta, prop) {
        if (!prop.version) {
            return;
        }
        meta.versionProperty = prop.name;
        prop.defaultRaw = this.getDefaultVersionValue(prop);
    }
    initCustomType(meta, prop) {
        var _a;
        if (!prop.customType && prop.array && prop.items) {
            prop.customType = new types_1.EnumArrayType(`${meta.className}.${prop.name}`, prop.items);
        }
        // `string[]` can be returned via ts-morph, while reflect metadata will give us just `array`
        if (!prop.customType && !prop.columnTypes && ['string[]', 'array'].includes(prop.type)) {
            prop.customType = new types_1.ArrayType();
        }
        // for number arrays we make sure to convert the items to numbers
        if (!prop.customType && !prop.columnTypes && prop.type === 'number[]') {
            prop.customType = new types_1.ArrayType(i => +i);
        }
        if (!prop.customType && !prop.columnTypes && prop.type === 'Buffer') {
            prop.customType = new types_1.BlobType();
        }
        if (!prop.customType && !prop.columnTypes && prop.type === 'json') {
            prop.customType = new types_1.JsonType();
        }
        if (prop.type instanceof types_1.Type) {
            prop.customType = prop.type;
        }
        // eslint-disable-next-line no-prototype-builtins
        if (types_1.Type.isPrototypeOf(prop.type) && !prop.customType) {
            prop.customType = types_1.Type.getType(prop.type);
        }
        if (prop.customType) {
            prop.columnTypes = (_a = prop.columnTypes) !== null && _a !== void 0 ? _a : [prop.customType.getColumnType(prop, this.platform)];
        }
        if (prop.customType instanceof types_1.Type && prop.reference === enums_1.ReferenceType.SCALAR) {
            prop.type = prop.customType.constructor.name;
        }
    }
    initRelation(prop) {
        if (prop.reference === enums_1.ReferenceType.SCALAR) {
            return;
        }
        const meta2 = this.discovered.find(m => m.className === prop.type);
        prop.referencedPKs = meta2.primaryKeys;
        prop.targetMeta = meta2;
    }
    initColumnType(prop, path) {
        var _a;
        this.initUnsigned(prop);
        (_a = this.metadata.find(prop.type)) === null || _a === void 0 ? void 0 : _a.getPrimaryProps().map(pk => {
            var _a, _b, _c;
            prop.length = (_a = prop.length) !== null && _a !== void 0 ? _a : pk.length;
            /* istanbul ignore next */
            prop.precision = (_b = prop.precision) !== null && _b !== void 0 ? _b : pk.precision;
            /* istanbul ignore next */
            prop.scale = (_c = prop.scale) !== null && _c !== void 0 ? _c : pk.scale;
        });
        if (prop.columnTypes || !this.schemaHelper) {
            return;
        }
        if (prop.enum && !prop.items && prop.type && path) {
            this.initEnumValues(prop, path);
        }
        if (prop.reference === enums_1.ReferenceType.SCALAR) {
            const mappedType = this.getMappedType(prop);
            prop.columnTypes = [mappedType.getColumnType(prop, this.platform)];
            return;
        }
        if (prop.reference === enums_1.ReferenceType.EMBEDDED && prop.object && !prop.columnTypes) {
            prop.columnTypes = [this.platform.getJsonDeclarationSQL()];
            return;
        }
        const meta = this.metadata.get(prop.type);
        prop.columnTypes = [];
        meta.getPrimaryProps().forEach(pk => {
            this.initCustomType(meta, pk);
            this.initColumnType(pk);
            const mappedType = this.getMappedType(pk);
            let columnTypes = pk.columnTypes;
            if (pk.autoincrement) {
                columnTypes = [mappedType.getColumnType(Object.assign(Object.assign({}, pk), { autoincrement: false }), this.platform)];
            }
            prop.columnTypes.push(...columnTypes);
            if (!meta.compositePK) {
                prop.customType = pk.customType;
            }
        });
    }
    getMappedType(prop) {
        var _a, _b;
        let t = prop.type.toLowerCase();
        if (prop.enum) {
            t = ((_a = prop.items) === null || _a === void 0 ? void 0 : _a.every(item => Utils_1.Utils.isString(item))) ? 'enum' : 'tinyint';
        }
        if (t === 'date') {
            t = 'datetime';
        }
        return (_b = prop.customType) !== null && _b !== void 0 ? _b : this.platform.getMappedType(t);
    }
    initEnumValues(prop, path) {
        path = Utils_1.Utils.normalizePath(this.config.get('baseDir'), path);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const exports = require(path);
        const target = exports[prop.type] || exports.default;
        if (target) {
            const items = Utils_1.Utils.extractEnumValues(target);
            Utils_1.Utils.defaultValue(prop, 'items', items);
        }
    }
    initUnsigned(prop) {
        if ([enums_1.ReferenceType.MANY_TO_ONE, enums_1.ReferenceType.ONE_TO_ONE].includes(prop.reference)) {
            const meta2 = this.metadata.get(prop.type);
            meta2.primaryKeys.forEach(primaryKey => {
                const pk = meta2.properties[primaryKey];
                prop.unsigned = this.platform.supportsUnsigned() && this.isNumericProperty(pk);
            });
            return;
        }
        prop.unsigned = (prop.primary || prop.unsigned) && this.isNumericProperty(prop) && this.platform.supportsUnsigned();
    }
    initIndexes(prop) {
        var _a;
        if ((prop.reference === enums_1.ReferenceType.MANY_TO_ONE || (prop.reference === enums_1.ReferenceType.ONE_TO_ONE && prop.owner)) && this.platform.indexForeignKeys()) {
            prop.index = (_a = prop.index) !== null && _a !== void 0 ? _a : true;
        }
    }
    isNumericProperty(prop) {
        return prop.type === 'number' || this.platform.isBigIntProperty(prop);
    }
    getEntityClassOrSchema(path, name) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const exports = require(path);
        const targets = Object.values(exports)
            .filter(item => item instanceof EntitySchema_1.EntitySchema || (item instanceof Function && MetadataStorage_1.MetadataStorage.isKnownEntity(item.name)));
        // ignore class implementations that are linked from an EntitySchema
        for (const item of targets) {
            if (item instanceof EntitySchema_1.EntitySchema) {
                targets.forEach((item2, idx) => {
                    if (item.meta.class === item2) {
                        targets.splice(idx, 1);
                    }
                });
            }
        }
        if (targets.length > 0) {
            return targets;
        }
        const target = exports.default || exports[name];
        /* istanbul ignore next */
        if (!target) {
            throw errors_1.MetadataError.entityNotFound(name, path.replace(this.config.get('baseDir'), '.'));
        }
        return [target];
    }
    shouldForceConstructorUsage(meta) {
        const forceConstructor = this.config.get('forceEntityConstructor');
        if (Array.isArray(forceConstructor)) {
            return forceConstructor.some(cls => Utils_1.Utils.className(cls) === meta.className);
        }
        return meta.forceConstructor = forceConstructor;
    }
}
exports.MetadataDiscovery = MetadataDiscovery;
