"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectHydrator = void 0;
const Hydrator_1 = require("./Hydrator");
const Collection_1 = require("../entity/Collection");
const Reference_1 = require("../entity/Reference");
const Utils_1 = require("../utils/Utils");
const enums_1 = require("../enums");
class ObjectHydrator extends Hydrator_1.Hydrator {
    constructor() {
        super(...arguments);
        this.hydrators = {
            full: new Map(),
            reference: new Map(),
            returning: new Map(),
        };
        this.tmpIndex = 0;
    }
    /**
     * @inheritDoc
     */
    hydrate(entity, meta, data, factory, type, newEntity = false, convertCustomTypes = false) {
        const hydrate = this.getEntityHydrator(meta, type);
        Utils_1.Utils.callCompiledFunction(hydrate, entity, data, factory, newEntity, convertCustomTypes);
    }
    /**
     * @inheritDoc
     */
    hydrateReference(entity, meta, data, factory, convertCustomTypes = false) {
        const hydrate = this.getEntityHydrator(meta, 'reference');
        Utils_1.Utils.callCompiledFunction(hydrate, entity, data, factory, false, convertCustomTypes);
    }
    /**
     * @internal Highly performance-sensitive method.
     */
    getEntityHydrator(meta, type) {
        const exists = this.hydrators[type].get(meta.className);
        if (exists) {
            return exists;
        }
        const lines = [];
        const context = new Map();
        const props = this.getProperties(meta, type);
        context.set('isPrimaryKey', Utils_1.Utils.isPrimaryKey);
        context.set('Collection', Collection_1.Collection);
        context.set('Reference', Reference_1.Reference);
        const preCondition = (dataKey) => {
            const path = dataKey.split('.');
            path.pop();
            if (path.length === 0) {
                return '';
            }
            let ret = '';
            let prev = '';
            for (const p of path) {
                const key = prev ? prev + '.' + p : p;
                ret += `data.${key} && `;
                prev = key;
            }
            return ret;
        };
        const hydrateScalar = (prop, object, path, dataKey) => {
            const entityKey = path.join('.');
            const preCond = preCondition(dataKey);
            const convertorKey = path.join('_').replace(/\[idx_\d+]/g, '');
            const ret = [];
            if (prop.type.toLowerCase() === 'date') {
                ret.push(`  if (${preCond}data.${dataKey}) entity.${entityKey} = new Date(data.${dataKey});`, `  else if (${preCond}data.${dataKey} === null) entity.${entityKey} = null;`);
            }
            else if (prop.customType) {
                context.set(`convertToJSValue_${convertorKey}`, (val) => prop.customType.convertToJSValue(val, this.platform));
                context.set(`convertToDatabaseValue_${convertorKey}`, (val) => prop.customType.convertToDatabaseValue(val, this.platform));
                ret.push(`  if (${preCond}typeof data.${dataKey} !== 'undefined') {`, `    if (convertCustomTypes) {`, `      const value = convertToJSValue_${convertorKey}(data.${dataKey});`, `      data.${dataKey} = convertToDatabaseValue_${convertorKey}(value);`, // make sure the value is comparable
                `      entity.${entityKey} = value;`, `    } else {`, `      entity.${entityKey} = data.${dataKey};`, `    }`, `  }`);
            }
            else if (prop.type.toLowerCase() === 'boolean') {
                ret.push(`  if (${preCond}typeof data.${dataKey} !== 'undefined') entity.${entityKey} = data.${dataKey} === null ? null : !!data.${dataKey};`);
            }
            else {
                ret.push(`  if (${preCond}typeof data.${dataKey} !== 'undefined') entity.${entityKey} = data.${dataKey};`);
            }
            return ret;
        };
        /* istanbul ignore next */
        const propName = (name, property = 'data') => property + (name.match(/[ -]/) ? `['${name}']` : `.${name}`);
        const hydrateToOne = (prop, dataKey, entityKey) => {
            const ret = [];
            ret.push(`  if (${propName(dataKey)} === null) {\n    entity.${entityKey} = null;`);
            ret.push(`  } else if (typeof ${propName(dataKey)} !== 'undefined') {`);
            ret.push(`    if (isPrimaryKey(${propName(dataKey)}, true)) {`);
            if (prop.mapToPk) {
                ret.push(`      entity.${entityKey} = ${propName(dataKey)};`);
            }
            else if (prop.wrappedReference) {
                ret.push(`      entity.${entityKey} = new Reference(factory.createReference('${prop.type}', ${propName(dataKey)}, { merge: true, convertCustomTypes }));`);
            }
            else {
                ret.push(`      entity.${entityKey} = factory.createReference('${prop.type}', ${propName(dataKey)}, { merge: true, convertCustomTypes });`);
            }
            ret.push(`    } else if (${propName(dataKey)} && typeof ${propName(dataKey)} === 'object') {`);
            if (prop.mapToPk) {
                ret.push(`      entity.${entityKey} = ${propName(dataKey)};`);
            }
            else if (prop.wrappedReference) {
                ret.push(`      entity.${entityKey} = new Reference(factory.create('${prop.type}', ${propName(dataKey)}, { initialized: true, merge: true, newEntity, convertCustomTypes }));`);
            }
            else {
                ret.push(`      entity.${entityKey} = factory.create('${prop.type}', ${propName(dataKey)}, { initialized: true, merge: true, newEntity, convertCustomTypes });`);
            }
            ret.push(`    }`);
            ret.push(`  }`);
            if (prop.reference === enums_1.ReferenceType.ONE_TO_ONE && !prop.mapToPk) {
                const meta2 = this.metadata.get(prop.type);
                const prop2 = meta2.properties[prop.inversedBy || prop.mappedBy];
                if (prop2) {
                    ret.push(`  if (entity.${entityKey} && !entity.${entityKey}.${prop2.name}) {`);
                    ret.push(`    entity.${entityKey}.${prop.wrappedReference ? 'unwrap().' : ''}${prop2.name} = ${prop2.wrappedReference ? 'new Reference(entity)' : 'entity'};`);
                    ret.push(`  }`);
                }
            }
            if (prop.customType) {
                context.set(`convertToDatabaseValue_${prop.name}`, (val) => prop.customType.convertToDatabaseValue(val, this.platform));
                ret.push(`  if (${propName(dataKey)} != null && convertCustomTypes) {`);
                ret.push(`    ${propName(dataKey)} = convertToDatabaseValue_${prop.name}(entity.${entityKey}.__helper.getPrimaryKey());`); // make sure the value is comparable
                ret.push(`  }`);
            }
            return ret;
        };
        const hydrateToMany = (prop, dataKey, entityKey) => {
            const ret = [];
            ret.push(...this.createCollectionItemMapper(prop));
            ret.push(`  if (${propName(dataKey)} && !Array.isArray(${propName(dataKey)}) && typeof ${propName(dataKey)} === 'object') {`);
            ret.push(`    ${propName(dataKey)} = [${propName(dataKey)}];`);
            ret.push(`  }`);
            ret.push(`  if (Array.isArray(${propName(dataKey)})) {`);
            ret.push(`     const items = ${propName(dataKey)}.map(value => createCollectionItem_${prop.name}(value));`);
            ret.push(`     const coll = Collection.create(entity, '${prop.name}', items, newEntity);`);
            ret.push(`     if (newEntity) {`);
            ret.push(`       coll.setDirty();`);
            ret.push(`     } else {`);
            ret.push(`       coll.takeSnapshot();`);
            ret.push(`     }`);
            ret.push(`  } else if (!entity.${entityKey} && ${propName(dataKey)} instanceof Collection) {`);
            ret.push(`     entity.${entityKey} = ${propName(dataKey)};`);
            ret.push(`  } else if (!entity.${entityKey}) {`);
            const items = this.platform.usesPivotTable() || !prop.owner ? 'undefined' : '[]';
            ret.push(`    const coll = Collection.create(entity, '${prop.name}', ${items}, !!${propName(dataKey)} || newEntity);`);
            ret.push(`    coll.setDirty(false);`);
            ret.push(`  }`);
            return ret;
        };
        const hydrateEmbedded = (prop, path, dataKey) => {
            const entityKey = path.join('.');
            const convertorKey = path.join('_').replace(/\[idx_\d+]/g, '');
            const ret = [];
            const conds = [];
            context.set(`prototype_${convertorKey}`, prop.embeddable.prototype);
            if (prop.object) {
                conds.push(`data.${dataKey} != null`);
            }
            else {
                meta.props
                    .filter(p => { var _a; return ((_a = p.embedded) === null || _a === void 0 ? void 0 : _a[0]) === prop.name; })
                    .forEach(p => conds.push(`data.${p.name} != null`));
            }
            ret.push(`  if (${conds.join(' || ')}) {`);
            ret.push(`    entity.${entityKey} = Object.create(prototype_${convertorKey});`);
            meta.props
                .filter(p => { var _a; return ((_a = p.embedded) === null || _a === void 0 ? void 0 : _a[0]) === prop.name; })
                .forEach(childProp => {
                const childDataKey = prop.object ? dataKey + '.' + childProp.embedded[1] : childProp.name;
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                ret.push(...hydrateProperty(childProp, prop.object, [...path, childProp.embedded[1]], childDataKey).map(l => '  ' + l));
            });
            ret.push(`  }`);
            return ret;
        };
        const hydrateEmbeddedArray = (prop, path, dataKey) => {
            const entityKey = path.join('.');
            const convertorKey = path.join('_').replace(/\[idx_\d+]/g, '');
            const ret = [];
            const idx = this.tmpIndex++;
            context.set(`prototype_${convertorKey}`, prop.embeddable.prototype);
            ret.push(`  if (Array.isArray(data.${dataKey})) {`);
            ret.push(`    entity.${entityKey} = [];`);
            ret.push(`    data.${dataKey}.forEach((_, idx_${idx}) => {`);
            const last = path.pop();
            ret.push(...hydrateEmbedded(prop, [...path, `${last}[idx_${idx}]`], `${dataKey}[idx_${idx}]`).map(l => '    ' + l));
            ret.push(`    });`);
            ret.push(`  }`);
            return ret;
        };
        const hydrateProperty = (prop, object = prop.object, path = [prop.name], dataKey) => {
            const entityKey = path.join('.');
            dataKey = dataKey !== null && dataKey !== void 0 ? dataKey : (object ? entityKey : prop.name);
            const ret = [];
            if (prop.reference === enums_1.ReferenceType.MANY_TO_ONE || prop.reference === enums_1.ReferenceType.ONE_TO_ONE) {
                ret.push(...hydrateToOne(prop, dataKey, entityKey));
            }
            else if (prop.reference === enums_1.ReferenceType.ONE_TO_MANY || prop.reference === enums_1.ReferenceType.MANY_TO_MANY) {
                ret.push(...hydrateToMany(prop, dataKey, entityKey));
            }
            else if (prop.reference === enums_1.ReferenceType.EMBEDDED) {
                if (prop.array) {
                    ret.push(...hydrateEmbeddedArray(prop, path, dataKey));
                }
                else {
                    ret.push(...hydrateEmbedded(prop, path, dataKey));
                    if (!prop.object) {
                        ret.push(...hydrateEmbedded(Object.assign(Object.assign({}, prop), { object: true }), path, dataKey));
                    }
                }
            }
            else { // ReferenceType.SCALAR
                ret.push(...hydrateScalar(prop, object, path, dataKey));
            }
            if (this.config.get('forceUndefined')) {
                ret.push(`  if (data.${dataKey} === null) entity.${entityKey} = undefined;`);
            }
            return ret;
        };
        for (const prop of props) {
            lines.push(...hydrateProperty(prop));
        }
        const code = `return function(entity, data, factory, newEntity, convertCustomTypes) {\n${lines.join('\n')}\n}`;
        const hydrator = Utils_1.Utils.createFunction(context, code);
        this.hydrators[type].set(meta.className, hydrator);
        return hydrator;
    }
    createCollectionItemMapper(prop) {
        const meta = this.metadata.find(prop.type);
        const lines = [];
        lines.push(`  const createCollectionItem_${prop.name} = value => {`);
        lines.push(`    if (isPrimaryKey(value, ${meta.compositePK})) return factory.createReference('${prop.type}', value, { convertCustomTypes, merge: true });`);
        lines.push(`    if (value && value.__entity) return value;`);
        lines.push(`    return factory.create('${prop.type}', value, { newEntity, convertCustomTypes, merge: true });`);
        lines.push(`  }`);
        return lines;
    }
}
exports.ObjectHydrator = ObjectHydrator;
