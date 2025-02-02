"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceFile = void 0;
const core_1 = require("@mikro-orm/core");
class SourceFile {
    constructor(meta, namingStrategy, platform, helper) {
        this.meta = meta;
        this.namingStrategy = namingStrategy;
        this.platform = platform;
        this.helper = helper;
        this.coreImports = new Set();
        this.entityImports = new Set();
    }
    generate() {
        this.coreImports.add('Entity');
        let ret = `@Entity(${this.getCollectionDecl()})\n`;
        this.meta.indexes.forEach(index => {
            this.coreImports.add('Index');
            const properties = core_1.Utils.asArray(index.properties).map(prop => `'${prop}'`);
            ret += `@Index({ name: '${index.name}', properties: [${properties.join(', ')}] })\n`;
        });
        this.meta.uniques.forEach(index => {
            this.coreImports.add('Unique');
            const properties = core_1.Utils.asArray(index.properties).map(prop => `'${prop}'`);
            ret += `@Unique({ name: '${index.name}', properties: [${properties.join(', ')}] })\n`;
        });
        ret += `export class ${this.meta.className} {\n`;
        Object.values(this.meta.properties).forEach(prop => {
            const decorator = this.getPropertyDecorator(prop, 2);
            const definition = this.getPropertyDefinition(prop, 2);
            if (!ret.endsWith('\n\n')) {
                ret += '\n';
            }
            ret += decorator;
            ret += definition;
            ret += '\n';
        });
        ret += '}\n';
        const imports = [`import { ${([...this.coreImports].sort().join(', '))} } from '@mikro-orm/core';`];
        const entityImports = [...this.entityImports].filter(e => e !== this.meta.className);
        entityImports.sort().forEach(entity => {
            imports.push(`import { ${entity} } from './${entity}';`);
        });
        return `${imports.join('\n')}\n\n${ret}`;
    }
    getBaseName() {
        return this.meta.className + '.ts';
    }
    getCollectionDecl() {
        const needsCollection = this.meta.collection !== this.namingStrategy.classToTableName(this.meta.className);
        return needsCollection ? `{ collection: '${this.meta.collection}' }` : '';
    }
    getPropertyDefinition(prop, padLeft) {
        // string defaults are usually things like SQL functions
        const useDefault = prop.default != null && typeof prop.default !== 'string';
        const optional = prop.nullable ? '?' : (useDefault ? '' : '!');
        const ret = `${prop.name}${optional}: ${prop.type}`;
        const padding = ' '.repeat(padLeft);
        if (!useDefault) {
            return `${padding + ret};\n`;
        }
        return `${padding}${ret} = ${prop.default};\n`;
    }
    getPropertyDecorator(prop, padLeft) {
        const padding = ' '.repeat(padLeft);
        const options = {};
        let decorator = this.getDecoratorType(prop);
        this.coreImports.add(decorator.substr(1));
        if (prop.reference !== core_1.ReferenceType.SCALAR) {
            this.getForeignKeyDecoratorOptions(options, prop);
        }
        else {
            this.getScalarPropertyDecoratorOptions(options, prop);
        }
        this.getCommonDecoratorOptions(options, prop);
        const indexes = this.getPropertyIndexes(prop, options);
        decorator = [...indexes.sort(), decorator].map(d => padding + d).join('\n');
        if (!core_1.Utils.hasObjectKeys(options)) {
            return `${decorator}()\n`;
        }
        return `${decorator}({ ${Object.entries(options).map(([opt, val]) => `${opt}: ${val}`).join(', ')} })\n`;
    }
    getPropertyIndexes(prop, options) {
        if (prop.reference === core_1.ReferenceType.SCALAR) {
            const ret = [];
            if (prop.index) {
                this.coreImports.add('Index');
                ret.push(`@Index({ name: '${prop.index}' })`);
            }
            if (prop.unique) {
                this.coreImports.add('Unique');
                ret.push(`@Unique({ name: '${prop.unique}' })`);
            }
            return ret;
        }
        const processIndex = (type) => {
            if (!prop[type]) {
                return;
            }
            const defaultName = this.platform.getIndexName(this.meta.collection, prop.fieldNames, type);
            options[type] = defaultName === prop[type] ? 'true' : `'${prop[type]}'`;
            const expected = {
                index: this.platform.indexForeignKeys(),
                unique: prop.reference === core_1.ReferenceType.ONE_TO_ONE,
            };
            if (expected[type] && options[type] === 'true') {
                delete options[type];
            }
        };
        processIndex('index');
        processIndex('unique');
        return [];
    }
    getCommonDecoratorOptions(options, prop) {
        if (prop.nullable) {
            options.nullable = true;
        }
        if (prop.default && typeof prop.default === 'string') {
            if ([`''`, ''].includes(prop.default)) {
                options.default = `''`;
            }
            else if (prop.default.match(/^'.*'$/)) {
                options.default = prop.default;
            }
            else {
                options.defaultRaw = `\`${prop.default}\``;
            }
        }
    }
    getScalarPropertyDecoratorOptions(options, prop) {
        let t = prop.type.toLowerCase();
        if (t === 'date') {
            t = 'datetime';
        }
        const mappedType1 = this.platform.getMappedType(t);
        const mappedType2 = this.platform.getMappedType(prop.columnTypes[0]);
        const columnType1 = mappedType1.getColumnType(Object.assign(Object.assign({}, prop), { autoincrement: false }), this.platform);
        const columnType2 = mappedType2.getColumnType(Object.assign(Object.assign({}, prop), { autoincrement: false }), this.platform);
        if (columnType1 !== columnType2 || [mappedType1, mappedType2].some(t => t instanceof core_1.UnknownType)) {
            options.columnType = this.quote(prop.columnTypes[0]);
        }
        if (prop.fieldNames[0] !== this.namingStrategy.propertyToColumnName(prop.name)) {
            options.fieldName = `'${prop.fieldNames[0]}'`;
        }
        if (prop.length && prop.columnTypes[0] !== 'enum') {
            options.length = prop.length;
        }
    }
    getForeignKeyDecoratorOptions(options, prop) {
        const className = this.namingStrategy.getClassName(prop.referencedTableName, '_');
        this.entityImports.add(className);
        options.entity = `() => ${className}`;
        if (prop.fieldNames[0] !== this.namingStrategy.joinKeyColumnName(prop.name, prop.referencedColumnNames[0])) {
            options.fieldName = `'${prop.fieldNames[0]}'`;
        }
        if (!['no action', 'restrict'].includes(prop.onUpdateIntegrity.toLowerCase())) {
            options.onUpdateIntegrity = `'${prop.onUpdateIntegrity}'`;
        }
        if (!['no action', 'restrict'].includes(prop.onDelete.toLowerCase())) {
            options.onDelete = `'${prop.onDelete}'`;
        }
        if (prop.primary) {
            options.primary = true;
        }
    }
    quote(val) {
        return val.includes(`'`) ? `\`${val}\`` : `'${val}'`;
    }
    getDecoratorType(prop) {
        if (prop.reference === core_1.ReferenceType.ONE_TO_ONE) {
            return '@OneToOne';
        }
        if (prop.reference === core_1.ReferenceType.MANY_TO_ONE) {
            return '@ManyToOne';
        }
        if (prop.primary) {
            return '@PrimaryKey';
        }
        return '@Property';
    }
}
exports.SourceFile = SourceFile;
