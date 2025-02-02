"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsMorphMetadataProvider = void 0;
const ts_morph_1 = require("ts-morph");
const core_1 = require("@mikro-orm/core");
class TsMorphMetadataProvider extends core_1.MetadataProvider {
    constructor() {
        super(...arguments);
        this.project = new ts_morph_1.Project({
            compilerOptions: {
                strictNullChecks: true,
            },
        });
    }
    useCache() {
        var _a;
        return (_a = this.config.get('cache').enabled) !== null && _a !== void 0 ? _a : true;
    }
    async loadEntityMetadata(meta, name) {
        if (!meta.path) {
            return;
        }
        await this.initProperties(meta);
    }
    async getExistingSourceFile(path, ext, validate = true) {
        if (!ext) {
            return await this.getExistingSourceFile(path, '.d.ts', false) || await this.getExistingSourceFile(path, '.ts');
        }
        const tsPath = path.match(/.*\/[^/]+$/)[0].replace(/\.js$/, ext);
        return (await this.getSourceFile(tsPath, validate));
    }
    /**
     * Re-hydrates missing attributes like `customType` (functions/instances are lost when caching to JSON)
     */
    loadFromCache(meta, cache) {
        Object.values(cache.properties).forEach(prop => {
            if (prop.customType) {
                prop.customType = meta.properties[prop.name].customType;
            }
        });
        core_1.Utils.merge(meta, cache);
    }
    async initProperties(meta) {
        // load types and column names
        for (const prop of Object.values(meta.properties)) {
            const type = this.extractType(prop);
            if (!type || this.config.get('discovery').alwaysAnalyseProperties) {
                await this.initPropertyType(meta, prop);
            }
            prop.type = type || prop.type;
        }
    }
    extractType(prop) {
        if (core_1.Utils.isString(prop.entity)) {
            return prop.entity;
        }
        if (prop.entity) {
            return core_1.Utils.className(prop.entity());
        }
        return prop.type;
    }
    async initPropertyType(meta, prop) {
        const { type, optional } = await this.readTypeFromSource(meta, prop);
        prop.type = type;
        if (optional) {
            prop.nullable = true;
        }
        this.processWrapper(prop, 'IdentifiedReference');
        this.processWrapper(prop, 'Reference');
        this.processWrapper(prop, 'Collection');
    }
    async readTypeFromSource(meta, prop) {
        var _a;
        const source = await this.getExistingSourceFile(meta.path);
        const cls = source.getClass(meta.className);
        /* istanbul ignore next */
        if (!cls) {
            throw new core_1.MetadataError(`Source class for entity ${meta.className} not found. Verify you have 'compilerOptions.declaration' enabled in your 'tsconfig.json'. If you are using webpack, see https://bit.ly/35pPDNn`);
        }
        const properties = cls.getInstanceProperties();
        const property = properties.find(v => v.getName() === prop.name);
        /* istanbul ignore next */
        if (!property) {
            return { type: prop.type, optional: prop.nullable };
        }
        const tsType = property.getType();
        if (tsType.isEnum()) {
            prop.enum = true;
        }
        const typeName = tsType.getText(property);
        if (tsType.isEnum()) {
            prop.items = tsType.getUnionTypes().map(t => t.getLiteralValueOrThrow());
        }
        if (tsType.isArray()) {
            prop.array = true;
            /* istanbul ignore else */
            if (tsType.getArrayElementType().isEnum()) {
                prop.items = tsType.getArrayElementType().getUnionTypes().map(t => t.getLiteralValueOrThrow());
            }
        }
        if (prop.array && prop.enum) {
            prop.enum = false;
        }
        let type = typeName;
        const union = type.split(' | ');
        /* istanbul ignore next */
        const optional = ((_a = property.hasQuestionToken) === null || _a === void 0 ? void 0 : _a.call(property)) || union.includes('null') || union.includes('undefined');
        type = union.filter(t => !['null', 'undefined'].includes(t)).join(' | ');
        return { type, optional };
    }
    async getSourceFile(tsPath, validate) {
        if (!this.sources) {
            await this.initSourceFiles();
        }
        const source = this.sources.find(s => s.getFilePath().endsWith(tsPath.replace(/^\./, '')));
        if (!source && validate) {
            throw new core_1.MetadataError(`Source file '${tsPath}' not found. Check your 'entitiesTs' option and verify you have 'compilerOptions.declaration' enabled in your 'tsconfig.json'. If you are using webpack, see https://bit.ly/35pPDNn`);
        }
        return source;
    }
    processWrapper(prop, wrapper) {
        // type can be sometimes in form of:
        // `'({ object?: Entity | undefined; } & import("...").Reference<Entity>)'`
        // `{ object?: import("...").Entity | undefined; } & import("...").Reference<Entity>`
        // `{ node?: ({ id?: number | undefined; } & import("...").Reference<import("...").Entity>) | undefined; } & import("...").Reference<Entity>`
        // the regexp is looking for the `wrapper`, possible prefixed with `.` or wrapped in parens.
        const type = prop.type.replace(/import\(.*\)\./g, '');
        const m = type.match(new RegExp(`(?:^|[.( ])${wrapper}<(\\w+),?.*>(?:$|[) ])`));
        if (!m) {
            return;
        }
        prop.type = m[1];
        if (['Reference', 'IdentifiedReference'].includes(wrapper)) {
            prop.wrappedReference = true;
        }
    }
    async initSourceFiles() {
        // All entity files are first required during the discovery, before we reach here, so it is safe to get the parts from the global
        // metadata storage. We know the path thanks the the decorators being executed. In case we are running via ts-node, the extension
        // will be already `.ts`, so no change needed. `.js` files will get renamed to `.d.ts` files as they will be used as a source for
        // the ts-morph reflection.
        const paths = Object.values(core_1.MetadataStorage.getMetadata()).map(m => m.path.replace(/\.js$/, '.d.ts'));
        this.sources = this.project.addSourceFilesAtPaths(paths);
    }
}
exports.TsMorphMetadataProvider = TsMorphMetadataProvider;
