"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityComparator = void 0;
const clone_1 = __importDefault(require("clone"));
const enums_1 = require("../enums");
const Utils_1 = require("./Utils");
class EntityComparator {
    constructor(metadata, platform) {
        this.metadata = metadata;
        this.platform = platform;
        this.comparators = new Map();
        this.mappers = new Map();
        this.snapshotGenerators = new Map();
        this.pkGetters = new Map();
        this.pkGettersConverted = new Map();
        this.pkSerializers = new Map();
        this.tmpIndex = 0;
    }
    /**
     * Computes difference between two entities.
     */
    diffEntities(entityName, a, b) {
        const comparator = this.getEntityComparator(entityName);
        return Utils_1.Utils.callCompiledFunction(comparator, a, b);
    }
    /**
     * Removes ORM specific code from entities and prepares it for serializing. Used before change set computation.
     * References will be mapped to primary keys, collections to arrays of primary keys.
     */
    prepareEntity(entity) {
        const generator = this.getSnapshotGenerator(entity.constructor.name);
        return Utils_1.Utils.callCompiledFunction(generator, entity);
    }
    /**
     * Maps database columns to properties.
     */
    mapResult(entityName, result) {
        const mapper = this.getResultMapper(entityName);
        return Utils_1.Utils.callCompiledFunction(mapper, result);
    }
    /**
     * @internal Highly performance-sensitive method.
     */
    getPkGetter(meta) {
        const exists = this.pkGetters.get(meta.className);
        /* istanbul ignore next */
        if (exists) {
            return exists;
        }
        const lines = [];
        const context = new Map();
        if (meta.primaryKeys.length > 1) {
            lines.push(`  const cond = {`);
            meta.primaryKeys.forEach(pk => {
                if (meta.properties[pk].reference !== enums_1.ReferenceType.SCALAR) {
                    lines.push(`    ${pk}: (entity.${pk} != null && (entity.${pk}.__entity || entity.${pk}.__reference)) ? entity.${pk}.__helper.getPrimaryKey() : entity.${pk},`);
                }
                else {
                    lines.push(`    ${pk}: entity.${pk},`);
                }
            });
            lines.push(`  };`);
            lines.push(`  if (${meta.primaryKeys.map(pk => `cond.${pk} == null`).join(' || ')}) return null;`);
            lines.push(`  return cond;`);
        }
        else {
            const pk = meta.primaryKeys[0];
            if (meta.properties[pk].reference !== enums_1.ReferenceType.SCALAR) {
                lines.push(`  if (entity.${pk} != null && (entity.${pk}.__entity || entity.${pk}.__reference)) return entity.${pk}.__helper.getPrimaryKey();`);
            }
            lines.push(`  return entity.${pk};`);
        }
        const code = `return function(entity) {\n${lines.join('\n')}\n}`;
        const pkSerializer = Utils_1.Utils.createFunction(context, code);
        this.pkGetters.set(meta.className, pkSerializer);
        return pkSerializer;
    }
    /**
     * @internal Highly performance-sensitive method.
     */
    getPkGetterConverted(meta) {
        const exists = this.pkGettersConverted.get(meta.className);
        /* istanbul ignore next */
        if (exists) {
            return exists;
        }
        const lines = [];
        const context = new Map();
        if (meta.primaryKeys.length > 1) {
            lines.push(`  const cond = {`);
            meta.primaryKeys.forEach(pk => {
                if (meta.properties[pk].reference !== enums_1.ReferenceType.SCALAR) {
                    lines.push(`    ${pk}: (entity.${pk} != null && (entity.${pk}.__entity || entity.${pk}.__reference)) ? entity.${pk}.__helper.getPrimaryKey(true) : entity.${pk},`);
                }
                else {
                    lines.push(`    ${pk}: entity.${pk},`);
                }
            });
            lines.push(`  };`);
            lines.push(`  if (${meta.primaryKeys.map(pk => `cond.${pk} == null`).join(' || ')}) return null;`);
            lines.push(`  return cond;`);
        }
        else {
            const pk = meta.primaryKeys[0];
            if (meta.properties[pk].reference !== enums_1.ReferenceType.SCALAR) {
                lines.push(`  if (entity.${pk} != null && (entity.${pk}.__entity || entity.${pk}.__reference)) return entity.${pk}.__helper.getPrimaryKey(true);`);
            }
            if (meta.properties[pk].customType) {
                context.set(`convertToDatabaseValue_${pk}`, (val) => meta.properties[pk].customType.convertToDatabaseValue(val, this.platform));
                lines.push(`  return convertToDatabaseValue_${pk}(entity.${pk});`);
            }
            else {
                lines.push(`  return entity.${pk};`);
            }
        }
        const code = `return function(entity) {\n${lines.join('\n')}\n}`;
        const pkSerializer = Utils_1.Utils.createFunction(context, code);
        this.pkGettersConverted.set(meta.className, pkSerializer);
        return pkSerializer;
    }
    /**
     * @internal Highly performance-sensitive method.
     */
    getPkSerializer(meta) {
        const exists = this.pkSerializers.get(meta.className);
        /* istanbul ignore next */
        if (exists) {
            return exists;
        }
        const lines = [];
        const context = new Map();
        if (meta.primaryKeys.length > 1) {
            lines.push(`  const pks = [`);
            meta.primaryKeys.forEach(pk => {
                if (meta.properties[pk].reference !== enums_1.ReferenceType.SCALAR) {
                    lines.push(`    (entity.${pk} != null && (entity.${pk}.__entity || entity.${pk}.__reference)) ? entity.${pk}.__helper.getSerializedPrimaryKey() : entity.${pk},`);
                }
                else {
                    lines.push(`    entity.${pk},`);
                }
            });
            lines.push(`  ];`);
            lines.push(`  return pks.join('${Utils_1.Utils.PK_SEPARATOR}');`);
        }
        else {
            const pk = meta.primaryKeys[0];
            if (meta.properties[pk].reference !== enums_1.ReferenceType.SCALAR) {
                lines.push(`  if (entity.${pk} != null && (entity.${pk}.__entity || entity.${pk}.__reference)) return entity.${pk}.__helper.getSerializedPrimaryKey();`);
            }
            lines.push(`  return '' + entity.${meta.serializedPrimaryKey};`);
        }
        const code = `return function(entity) {\n${lines.join('\n')}\n}`;
        const pkSerializer = Utils_1.Utils.createFunction(context, code);
        this.pkSerializers.set(meta.className, pkSerializer);
        return pkSerializer;
    }
    /**
     * @internal Highly performance-sensitive method.
     */
    getSnapshotGenerator(entityName) {
        const exists = this.snapshotGenerators.get(entityName);
        if (exists) {
            return exists;
        }
        const meta = this.metadata.find(entityName);
        const lines = [];
        const context = new Map();
        context.set('clone', clone_1.default);
        context.set('cloneEmbeddable', (o) => this.platform.cloneEmbeddable(o)); // do not clone prototypes
        if (meta.discriminatorValue) {
            lines.push(`  ret.${meta.root.discriminatorColumn} = '${meta.discriminatorValue}'`);
        }
        const getRootProperty = (prop) => prop.embedded ? getRootProperty(meta.properties[prop.embedded[0]]) : prop;
        // copy all comparable props, ignore collections and references, process custom types
        meta.comparableProps
            .filter(prop => {
            const root = getRootProperty(prop);
            return prop === root || root.reference !== enums_1.ReferenceType.EMBEDDED;
        })
            .forEach(prop => lines.push(this.getPropertySnapshot(meta, prop, context, prop.name, prop.name, [prop.name])));
        const code = `return function(entity) {\n  const ret = {};\n${lines.join('\n')}\n  return ret;\n}`;
        const snapshotGenerator = Utils_1.Utils.createFunction(context, code);
        this.snapshotGenerators.set(entityName, snapshotGenerator);
        return snapshotGenerator;
    }
    /**
     * @internal Highly performance-sensitive method.
     */
    getResultMapper(entityName) {
        const exists = this.mappers.get(entityName);
        if (exists) {
            return exists;
        }
        const meta = this.metadata.get(entityName);
        const lines = [];
        const context = new Map();
        const propName = (name, parent = 'result') => parent + (name.includes(' ') ? `['${name}']` : `.${name}`);
        lines.push(`  const mapped = {};`);
        meta.props.forEach(prop => {
            if (prop.fieldNames) {
                if (prop.fieldNames.length > 1) {
                    lines.push(`  if (${prop.fieldNames.map(field => `${propName(field)} != null`).join(' && ')}) {\n    ret.${prop.name} = [${prop.fieldNames.map(field => `${propName(field)}`).join(', ')}];`);
                    lines.push(...prop.fieldNames.map(field => `    ${propName(field, 'mapped')} = true;`));
                    lines.push(`  } else if (${prop.fieldNames.map(field => `${propName(field)} == null`).join(' && ')}) {\n    ret.${prop.name} = null;`);
                    lines.push(...prop.fieldNames.map(field => `    ${propName(field, 'mapped')} = true;`), '  }');
                }
                else {
                    if (prop.type === 'boolean') {
                        lines.push(`  if ('${prop.fieldNames[0]}' in result) { ret.${prop.name} = ${propName(prop.fieldNames[0])} == null ? ${propName(prop.fieldNames[0])} : !!${propName(prop.fieldNames[0])}; mapped.${prop.fieldNames[0]} = true; }`);
                    }
                    else {
                        lines.push(`  if ('${prop.fieldNames[0]}' in result) { ret.${prop.name} = ${propName(prop.fieldNames[0])}; ${propName(prop.fieldNames[0], 'mapped')} = true; }`);
                    }
                }
            }
        });
        lines.push(`  for (let k in result) { if (result.hasOwnProperty(k) && !mapped[k]) ret[k] = result[k]; }`);
        const code = `return function(result) {\n  const ret = {};\n${lines.join('\n')}\n  return ret;\n}`;
        const snapshotGenerator = Utils_1.Utils.createFunction(context, code);
        this.mappers.set(entityName, snapshotGenerator);
        return snapshotGenerator;
    }
    getPropertyCondition(prop, entityKey) {
        const parts = entityKey.split('.');
        if (parts.length > 1) {
            parts.pop();
        }
        let tail = '';
        let ret = parts.map(k => {
            const mapped = `'${k.replace(/\[idx_\d+]/g, '')}' in entity${tail ? '.' + tail : ''}`;
            tail += tail ? ('.' + k) : k;
            return mapped;
        }).join(' && ');
        const isRef = [enums_1.ReferenceType.ONE_TO_ONE, enums_1.ReferenceType.MANY_TO_ONE].includes(prop.reference) && !prop.mapToPk;
        const isSetter = isRef && !!(prop.inversedBy || prop.mappedBy);
        if (prop.primary || isSetter) {
            ret += ` && entity.${entityKey} != null`;
        }
        if (isRef) {
            ret += ` && (entity.${entityKey} == null || entity.${entityKey}.__helper.hasPrimaryKey())`;
        }
        return ret;
    }
    getEmbeddedArrayPropertySnapshot(meta, prop, context, level, path, dataKey) {
        const entityKey = path.join('.');
        const ret = [];
        const padding = ' '.repeat(level * 2);
        const idx = this.tmpIndex++;
        ret.push(`${padding}if (Array.isArray(entity.${entityKey})) {`);
        ret.push(`${padding}  ret.${dataKey} = [];`);
        ret.push(`${padding}  entity.${entityKey}.forEach((_, idx_${idx}) => {`);
        const last = path.pop();
        ret.push(this.getEmbeddedPropertySnapshot(meta, prop, context, level + 2, [...path, `${last}[idx_${idx}]`], `${dataKey}[idx_${idx}]`, true));
        ret.push(`${padding}  });`);
        if (this.shouldSerialize(prop, dataKey)) {
            ret.push(`${padding}  ret.${dataKey} = cloneEmbeddable(ret.${dataKey});`);
        }
        ret.push(`${padding}}`);
        return ret.join('\n');
    }
    /**
     * we need to serialize only object embeddables, and only the top level ones, so root object embeddable
     * properties and first child nested object embeddables with inlined parent
     */
    shouldSerialize(prop, dataKey) {
        const contains = (str, re) => (str.match(re) || []).length > 0;
        const a = contains(dataKey, /\./g);
        const b = contains(dataKey, /\[/g);
        return !!prop.object && !(a || b);
    }
    getEmbeddedPropertySnapshot(meta, prop, context, level, path, dataKey, object = prop.object) {
        const padding = ' '.repeat(level * 2);
        const cond = `entity.${path.join('.')} != null`;
        let ret = `${level === 1 ? '' : '\n'}${padding}if (${cond}) {\n`;
        if (object) {
            ret += `${padding}  ret.${dataKey} = {};\n`;
        }
        ret += meta.props.filter(p => { var _a; return ((_a = p.embedded) === null || _a === void 0 ? void 0 : _a[0]) === prop.name; }).map(childProp => {
            const childDataKey = prop.object ? dataKey + '.' + childProp.embedded[1] : childProp.name;
            const childEntityKey = `${path.join('.')}.${childProp.embedded[1]}`;
            if (childProp.reference === enums_1.ReferenceType.EMBEDDED) {
                return this.getPropertySnapshot(meta, childProp, context, childDataKey, childEntityKey, [...path, childProp.embedded[1]], level + 1, prop.object);
            }
            if (childProp.reference !== enums_1.ReferenceType.SCALAR) {
                return this.getPropertySnapshot(meta, childProp, context, childDataKey, childEntityKey, [...path, childProp.embedded[1]], level, prop.object)
                    .split('\n').map(l => padding + l).join('\n');
            }
            if (childProp.customType) {
                context.set(`convertToDatabaseValue_${childProp.name}`, (val) => childProp.customType.convertToDatabaseValue(val, this.platform));
                /* istanbul ignore next */
                if (['number', 'string', 'boolean'].includes(childProp.customType.compareAsType().toLowerCase())) {
                    return `${padding}  ret.${childDataKey} = convertToDatabaseValue_${childProp.name}(entity.${childEntityKey});`;
                }
                return `${padding}  ret.${childDataKey} = clone(convertToDatabaseValue_${childProp.name}(entity.${childEntityKey}));`;
            }
            return `${padding}  ret.${childDataKey} = clone(entity.${childEntityKey});`;
        }).join('\n') + `\n`;
        if (this.shouldSerialize(prop, dataKey)) {
            return `${ret + padding}  ret.${dataKey} = cloneEmbeddable(ret.${dataKey});\n${padding}}`;
        }
        return `${ret}${padding}}`;
    }
    getPropertySnapshot(meta, prop, context, dataKey, entityKey, path, level = 1, object) {
        let ret = `  if (${this.getPropertyCondition(prop, entityKey)}) {\n`;
        if (['number', 'string', 'boolean'].includes(prop.type.toLowerCase())) {
            return ret + `    ret.${dataKey} = entity.${entityKey};\n  }\n`;
        }
        if (prop.reference === enums_1.ReferenceType.EMBEDDED) {
            if (prop.array) {
                return this.getEmbeddedArrayPropertySnapshot(meta, prop, context, level, path, dataKey) + '\n';
            }
            return this.getEmbeddedPropertySnapshot(meta, prop, context, level, path, dataKey, object) + '\n';
        }
        if (prop.reference === enums_1.ReferenceType.ONE_TO_ONE || prop.reference === enums_1.ReferenceType.MANY_TO_ONE) {
            if (prop.mapToPk) {
                ret += `    ret.${dataKey} = entity.${entityKey};\n`;
            }
            else {
                context.set(`getPrimaryKeyValues_${prop.name}`, (val) => val && Utils_1.Utils.getPrimaryKeyValues(val, this.metadata.find(prop.type).primaryKeys, true));
                ret += `    ret.${dataKey} = getPrimaryKeyValues_${prop.name}(entity.${entityKey});\n`;
            }
            if (prop.customType) {
                context.set(`convertToDatabaseValue_${prop.name}`, (val) => prop.customType.convertToDatabaseValue(val, this.platform));
                /* istanbul ignore next */
                if (['number', 'string', 'boolean'].includes(prop.customType.compareAsType().toLowerCase())) {
                    return ret + `    ret.${dataKey} = convertToDatabaseValue_${prop.name}(ret.${dataKey});\n  }\n`;
                }
                return ret + `    ret.${dataKey} = clone(convertToDatabaseValue_${prop.name}(ret.${dataKey}));\n  }\n`;
            }
            return ret + '  }\n';
        }
        if (prop.customType) {
            context.set(`convertToDatabaseValue_${prop.name}`, (val) => prop.customType.convertToDatabaseValue(val, this.platform));
            if (['number', 'string', 'boolean'].includes(prop.customType.compareAsType().toLowerCase())) {
                return ret + `    ret.${dataKey} = convertToDatabaseValue_${prop.name}(entity.${entityKey});\n  }\n`;
            }
            return ret + `    ret.${dataKey} = clone(convertToDatabaseValue_${prop.name}(entity.${entityKey}));\n  }\n`;
        }
        if (prop.type.toLowerCase() === 'date') {
            context.set('processDateProperty', this.platform.processDateProperty.bind(this.platform));
            return ret + `    ret.${dataKey} = clone(processDateProperty(entity.${entityKey}));\n  }\n`;
        }
        return ret + `    ret.${dataKey} = clone(entity.${entityKey});\n  }\n`;
    }
    /**
     * @internal Highly performance-sensitive method.
     */
    getEntityComparator(entityName) {
        const exists = this.comparators.get(entityName);
        if (exists) {
            return exists;
        }
        const meta = this.metadata.find(entityName);
        const lines = [];
        const context = new Map();
        context.set('compareArrays', Utils_1.compareArrays);
        context.set('compareBuffers', Utils_1.compareBuffers);
        context.set('compareObjects', Utils_1.compareObjects);
        context.set('equals', Utils_1.equals);
        meta.comparableProps.forEach(prop => {
            lines.push(this.getPropertyComparator(prop));
        });
        const code = `return function(last, current) {\n  const diff = {};\n${lines.join('\n')}\n  return diff;\n}`;
        const comparator = Utils_1.Utils.createFunction(context, code);
        this.comparators.set(entityName, comparator);
        return comparator;
    }
    getGenericComparator(prop, cond) {
        return `  if (current.${prop} == null && last.${prop} == null) {\n\n` +
            `  } else if ((current.${prop} && last.${prop} == null) || (current.${prop} == null && last.${prop})) {\n` +
            `    diff.${prop} = current.${prop};\n` +
            `  } else if (${cond}) {\n` +
            `    diff.${prop} = current.${prop};\n` +
            `  }\n`;
    }
    getPropertyComparator(prop) {
        let type = prop.type.toLowerCase();
        if (prop.reference !== enums_1.ReferenceType.SCALAR && prop.reference !== enums_1.ReferenceType.EMBEDDED) {
            const meta2 = this.metadata.find(prop.type);
            if (meta2.primaryKeys.length > 1) {
                type = 'array';
            }
            else {
                type = meta2.properties[meta2.primaryKeys[0]].type.toLowerCase();
            }
        }
        if (prop.customType) {
            type = prop.customType.compareAsType().toLowerCase();
        }
        if (type.endsWith('[]')) {
            type = 'array';
        }
        if (['string', 'number', 'boolean'].includes(type)) {
            return this.getGenericComparator(prop.name, `last.${prop.name} !== current.${prop.name}`);
        }
        if (['array'].includes(type) || type.endsWith('[]')) {
            return this.getGenericComparator(prop.name, `!compareArrays(last.${prop.name}, current.${prop.name})`);
        }
        if (['buffer', 'uint8array'].includes(type)) {
            return this.getGenericComparator(prop.name, `!compareBuffers(last.${prop.name}, current.${prop.name})`);
        }
        if (['date'].includes(type)) {
            return this.getGenericComparator(prop.name, `last.${prop.name}.valueOf() !== current.${prop.name}.valueOf()`);
        }
        if (['objectid'].includes(type)) {
            const cond = `last.${prop.name}.toHexString() !== current.${prop.name}.toHexString()`;
            return this.getGenericComparator(prop.name, cond);
        }
        return `  if (!equals(last.${prop.name}, current.${prop.name})) diff.${prop.name} = current.${prop.name};`;
    }
    /**
     * perf: used to generate list of comparable properties during discovery, so we speed up the runtime comparison
     */
    static isComparable(prop, root) {
        const virtual = prop.persist === false;
        const inverse = prop.reference === enums_1.ReferenceType.ONE_TO_ONE && !prop.owner;
        const discriminator = prop.name === root.discriminatorColumn;
        const collection = prop.reference === enums_1.ReferenceType.ONE_TO_MANY || prop.reference === enums_1.ReferenceType.MANY_TO_MANY;
        return !virtual && !collection && !inverse && !discriminator && !prop.version;
    }
}
exports.EntityComparator = EntityComparator;
