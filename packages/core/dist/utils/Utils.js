"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = exports.equals = exports.compareBuffers = exports.compareArrays = exports.compareObjects = exports.ObjectBindingPattern = void 0;
const module_1 = require("module");
const clone_1 = __importDefault(require("clone"));
const globby_1 = __importDefault(require("globby"));
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const crypto_1 = require("crypto");
const escaya_1 = require("escaya");
const typings_1 = require("../typings");
const enums_1 = require("../enums");
exports.ObjectBindingPattern = Symbol('ObjectBindingPattern');
function compareObjects(a, b) {
    // eslint-disable-next-line eqeqeq
    if (a === b || (a == null && b == null)) {
        return true;
    }
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || a.constructor !== b.constructor) {
        return false;
    }
    if (a.valueOf !== Object.prototype.valueOf) {
        return a.valueOf() === b.valueOf();
    }
    if (a.toString !== Object.prototype.toString) {
        return a.toString() === b.toString();
    }
    const keys = Object.keys(a);
    const length = keys.length;
    if (length !== Object.keys(b).length) {
        return false;
    }
    for (let i = length; i-- !== 0;) {
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) {
            return false;
        }
    }
    for (let i = length; i-- !== 0;) {
        const key = keys[i];
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (!equals(a[key], b[key])) {
            return false;
        }
    }
    return true;
}
exports.compareObjects = compareObjects;
function compareArrays(a, b) {
    const length = a.length;
    if (length !== b.length) {
        return false;
    }
    for (let i = length; i-- !== 0;) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (!equals(a[i], b[i])) {
            return false;
        }
    }
    return true;
}
exports.compareArrays = compareArrays;
function compareBuffers(a, b) {
    const length = a.length;
    if (length !== b.length) {
        return false;
    }
    for (let i = length; i-- !== 0;) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
exports.compareBuffers = compareBuffers;
/**
 * Checks if arguments are deeply (but not strictly) equal.
 */
function equals(a, b) {
    if (a === b) {
        return true;
    }
    if (a && b && typeof a === 'object' && typeof b === 'object') {
        if (Array.isArray(a)) {
            return compareArrays(a, b);
        }
        if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
            return compareBuffers(a, b);
        }
        return compareObjects(a, b);
    }
    return false;
}
exports.equals = equals;
const equalsFn = equals;
class Utils {
    /**
     * Checks if the argument is not undefined
     */
    static isDefined(data, considerNullUndefined = false) {
        return typeof data !== 'undefined' && !(considerNullUndefined && data === null);
    }
    /**
     * Checks if the argument is instance of `Object`. Returns false for arrays.
     */
    static isObject(o) {
        return !!o && typeof o === 'object' && !Array.isArray(o);
    }
    /**
     * Checks if the argument is instance of `Object`, but not one of the blacklisted types. Returns false for arrays.
     */
    static isNotObject(o, not) {
        return this.isObject(o) && !not.some(cls => o instanceof cls);
    }
    /**
     * Removes `undefined` properties (recursively) so they are not saved as nulls
     */
    static dropUndefinedProperties(o) {
        if (Array.isArray(o)) {
            return o.forEach((item) => Utils.dropUndefinedProperties(item));
        }
        if (!Utils.isObject(o)) {
            return;
        }
        Object.keys(o).forEach(key => {
            if (o[key] === undefined) {
                delete o[key];
                return;
            }
            Utils.dropUndefinedProperties(o[key]);
        });
    }
    /**
     * Returns the number of properties on `obj`. This is 20x faster than Object.keys(obj).length.
     * @see https://github.com/deepkit/deepkit-framework/blob/master/packages/core/src/core.ts
     */
    static getObjectKeysSize(object) {
        let size = 0;
        for (const key in object) {
            /* istanbul ignore else */ // eslint-disable-next-line no-prototype-builtins
            if (object.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    }
    /**
     * Returns true if `obj` has at least one property. This is 20x faster than Object.keys(obj).length.
     * @see https://github.com/deepkit/deepkit-framework/blob/master/packages/core/src/core.ts
     */
    static hasObjectKeys(object) {
        for (const key in object) {
            /* istanbul ignore else */ // eslint-disable-next-line no-prototype-builtins
            if (object.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Checks if the argument is string
     */
    static isString(s) {
        return typeof s === 'string';
    }
    /**
     * Checks if the argument is number
     */
    static isNumber(s) {
        return typeof s === 'number';
    }
    /**
     * Checks if arguments are deeply (but not strictly) equal.
     */
    static equals(a, b) {
        return equalsFn(a, b);
    }
    /**
     * Gets array without duplicates.
     */
    static unique(items) {
        return [...new Set(items)];
    }
    /**
     * Merges all sources into the target recursively.
     */
    static merge(target, ...sources) {
        if (!sources.length) {
            return target;
        }
        const source = sources.shift();
        if (Utils.isObject(target) && Utils.isPlainObject(source)) {
            Object.entries(source).forEach(([key, value]) => {
                if (Utils.isPlainObject(value)) {
                    if (!(key in target)) {
                        Object.assign(target, { [key]: {} });
                    }
                    Utils.merge(target[key], value);
                }
                else {
                    Object.assign(target, { [key]: value });
                }
            });
        }
        return Utils.merge(target, ...sources);
    }
    static getRootEntity(metadata, meta) {
        const base = meta.extends && metadata.find(meta.extends);
        if (!base || base === meta) { // make sure we do not fall into infinite loop
            return meta;
        }
        const root = Utils.getRootEntity(metadata, base);
        if (root.discriminatorColumn) {
            return root;
        }
        return meta;
    }
    /**
     * Computes difference between two objects, ignoring items missing in `b`.
     */
    static diff(a, b) {
        const ret = {};
        Object.keys(b).forEach(k => {
            if (Utils.equals(a[k], b[k])) {
                return;
            }
            ret[k] = b[k];
        });
        return ret;
    }
    /**
     * Creates deep copy of given object.
     */
    static copy(entity) {
        return clone_1.default(entity);
    }
    /**
     * Normalize the argument to always be an array.
     */
    static asArray(data, strict = false) {
        if (typeof data === 'undefined' && !strict) {
            return [];
        }
        if (data instanceof Set) {
            return Array.from(data);
        }
        return Array.isArray(data) ? data : [data];
    }
    /**
     * Renames object key, keeps order of properties.
     */
    static renameKey(payload, from, to) {
        if (Utils.isObject(payload) && from in payload && !(to in payload)) {
            Object.keys(payload).forEach(key => {
                const value = payload[key];
                delete payload[key];
                payload[from === key ? to : key] = value;
            }, payload);
        }
    }
    /**
     * Returns array of functions argument names. Uses `escaya` for source code analysis.
     */
    static getParamNames(func, methodName) {
        const ret = [];
        const parsed = escaya_1.recovery(func.toString(), 'entity.js', { next: true, module: true });
        const checkNode = (node) => {
            var _a, _b;
            /* istanbul ignore next */
            if (methodName && ((_a = node.name) === null || _a === void 0 ? void 0 : _a.name) !== methodName) {
                return;
            }
            const params = (_b = node.uniqueFormalParameters) !== null && _b !== void 0 ? _b : node.params;
            ret.push(...params.map((p) => {
                switch (p.type) {
                    case 'BindingElement':
                        if (p.left.type === 'ObjectBindingPattern') {
                            return exports.ObjectBindingPattern;
                        }
                        return p.left.name;
                    case 'BindingRestElement':
                        return '...' + p.argument.name;
                    default:
                        return p.name;
                }
            }));
        };
        Utils.walkNode(parsed, checkNode);
        return ret;
    }
    static walkNode(node, checkNode) {
        if (['MethodDefinition', 'FunctionDeclaration'].includes(node.type)) {
            checkNode(node);
        }
        if (Array.isArray(node.leafs)) {
            node.leafs.forEach((row) => Utils.walkNode(row, checkNode));
        }
        if (Array.isArray(node.elements)) {
            node.elements.forEach(element => Utils.walkNode(element, checkNode));
        }
        if (node.method) {
            Utils.walkNode(node.method, checkNode);
        }
    }
    /**
     * Checks whether the argument looks like primary key (string, number or ObjectId).
     */
    static isPrimaryKey(key, allowComposite = false) {
        if (allowComposite && Array.isArray(key) && key.every((v, i) => Utils.isPrimaryKey(v, true))) {
            return true;
        }
        if (Utils.isObject(key) && !Utils.isPlainObject(key) && !Utils.isEntity(key, true)) {
            return true;
        }
        return ['string', 'number', 'bigint'].includes(typeof key) || Utils.isObjectID(key) || key instanceof Date || key instanceof Buffer;
    }
    /**
     * Extracts primary key from `data`. Accepts objects or primary keys directly.
     */
    static extractPK(data, meta, strict = false) {
        if (Utils.isPrimaryKey(data)) {
            return data;
        }
        if (Utils.isEntity(data, true)) {
            return data.__helper.getPrimaryKey();
        }
        if (strict && meta && Utils.getObjectKeysSize(data) !== meta.primaryKeys.length) {
            return null;
        }
        if (Utils.isPlainObject(data) && meta) {
            if (meta.compositePK) {
                return Utils.getCompositeKeyHash(data, meta);
            }
            return data[meta.primaryKeys[0]] || data[meta.serializedPrimaryKey] || null;
        }
        return null;
    }
    static getCompositeKeyHash(entity, meta) {
        const pks = meta.primaryKeys.map(pk => {
            const value = entity[pk];
            const prop = meta.properties[pk];
            /* istanbul ignore next */
            if (Utils.isEntity(value, true)) {
                return value.__helper.getSerializedPrimaryKey();
            }
            if (prop.targetMeta && Utils.isPlainObject(value)) {
                return this.getCompositeKeyHash(value, prop.targetMeta);
            }
            return value;
        });
        return Utils.getPrimaryKeyHash(pks);
    }
    static getPrimaryKeyHash(pks) {
        return pks.join(this.PK_SEPARATOR);
    }
    static splitPrimaryKeys(key) {
        return key.split(this.PK_SEPARATOR);
    }
    static getPrimaryKeyValues(entity, primaryKeys, allowScalar = false, convertCustomTypes = false) {
        if (allowScalar && primaryKeys.length === 1) {
            if (Utils.isEntity(entity[primaryKeys[0]], true)) {
                return entity[primaryKeys[0]].__helper.getPrimaryKey(convertCustomTypes);
            }
            return entity[primaryKeys[0]];
        }
        return primaryKeys.reduce((ret, pk) => {
            if (Utils.isEntity(entity[pk], true)) {
                const childPk = entity[pk].__helper.getPrimaryKey(convertCustomTypes);
                if (entity[pk].__meta.compositePK) {
                    ret.push(...Object.values(childPk));
                }
                else {
                    ret.push(childPk);
                }
            }
            else {
                ret.push(entity[pk]);
            }
            return ret;
        }, []);
    }
    static getPrimaryKeyCond(entity, primaryKeys) {
        const cond = primaryKeys.reduce((o, pk) => {
            o[pk] = Utils.extractPK(entity[pk]);
            return o;
        }, {});
        if (Object.values(cond).some(v => v === null)) {
            return null;
        }
        return cond;
    }
    static getPrimaryKeyCondFromArray(pks, primaryKeys) {
        return primaryKeys.reduce((o, pk, idx) => {
            o[pk] = Utils.extractPK(pks[idx]);
            return o;
        }, {});
    }
    static getOrderedPrimaryKeys(id, meta, platform, convertCustomTypes) {
        const data = (Utils.isPrimaryKey(id) ? { [meta.primaryKeys[0]]: id } : id);
        return meta.primaryKeys.map((pk, idx) => {
            const prop = meta.properties[pk];
            // `data` can be a composite PK in form of array of PKs, or a DTO
            let value = Array.isArray(data) ? data[idx] : data[pk];
            if (prop.reference !== enums_1.ReferenceType.SCALAR && prop.targetMeta) {
                const value2 = this.getOrderedPrimaryKeys(value, prop.targetMeta, platform); // do not convert custom types yet
                value = value2[0];
            }
            if (prop.customType && platform && convertCustomTypes) {
                return prop.customType.convertToJSValue(value, platform);
            }
            return value;
        });
    }
    /**
     * Checks whether given object is an entity instance.
     */
    static isEntity(data, allowReference = false) {
        if (!Utils.isObject(data)) {
            return false;
        }
        if (allowReference && !!data.__reference) {
            return true;
        }
        return !!data.__entity;
    }
    /**
     * Checks whether the argument is ObjectId instance
     */
    static isObjectID(key) {
        return Utils.isObject(key) && key.constructor.name.toLowerCase() === 'objectid';
    }
    /**
     * Checks whether the argument is empty (array without items, object without keys or falsy value).
     */
    static isEmpty(data) {
        if (Array.isArray(data)) {
            return data.length === 0;
        }
        if (Utils.isObject(data)) {
            return !Utils.hasObjectKeys(data);
        }
        return !data;
    }
    /**
     * Gets string name of given class.
     */
    static className(classOrName) {
        if (Utils.isString(classOrName)) {
            return classOrName;
        }
        return classOrName.name;
    }
    /**
     * Tries to detect `ts-node` runtime.
     */
    static detectTsNode() {
        return process.argv[0].endsWith('ts-node') // running via ts-node directly
            || !!process[Symbol.for('ts-node.register.instance')] // check if internal ts-node symbol exists
            || process.argv.slice(1).some(arg => arg.includes('ts-node')) // registering ts-node runner
            || (require.extensions && !!require.extensions['.ts']) // check if the extension is registered
            || !!new Error().stack.split('\n').find(line => line.match(/\w\.ts:\d/)); // as a last resort, try to find a TS file in the stack trace
    }
    /**
     * Uses some dark magic to get source path to caller where decorator is used.
     * Analyses stack trace of error created inside the function call.
     */
    static lookupPathFromDecorator(name, stack) {
        // use some dark magic to get source path to caller
        stack = stack || new Error().stack.split('\n');
        let line = stack.findIndex(line => line.includes('__decorate'));
        if (line === -1) {
            return name;
        }
        if (Utils.normalizePath(stack[line]).includes('node_modules/tslib/tslib')) {
            line++;
        }
        try {
            const re = stack[line].match(/\(.+\)/i) ? /\((.*):\d+:\d+\)/ : /at\s*(.*):\d+:\d+$/;
            return Utils.normalizePath(stack[line].match(re)[1]);
        }
        catch (_a) {
            return name;
        }
    }
    /**
     * Gets the type of the argument.
     */
    static getObjectType(value) {
        const objectType = Object.prototype.toString.call(value);
        return objectType.match(/\[object (\w+)]/)[1].toLowerCase();
    }
    /**
     * Checks whether the value is POJO (e.g. `{ foo: 'bar' }`, and not instance of `Foo`)
     */
    static isPlainObject(value) {
        // eslint-disable-next-line no-prototype-builtins
        return (value !== null && typeof value === 'object' && typeof value.constructor === 'function' && value.constructor.prototype.hasOwnProperty('isPrototypeOf')) || value instanceof typings_1.PlainObject;
    }
    /**
     * Executes the `cb` promise serially on every element of the `items` array and returns array of resolved values.
     */
    static async runSerial(items, cb) {
        const ret = [];
        for (const item of items) {
            ret.push(await cb(item));
        }
        return ret;
    }
    static isCollection(item, prop, type) {
        if (!(item === null || item === void 0 ? void 0 : item.__collection)) {
            return false;
        }
        return !(prop && type) || prop.reference === type;
    }
    static normalizePath(...parts) {
        let path = parts.join('/').replace(/\\/g, '/').replace(/\/$/, '');
        path = path_1.normalize(path).replace(/\\/g, '/');
        return (path.match(/^[/.]|[a-zA-Z]:/) || path.startsWith('!')) ? path : './' + path;
    }
    static relativePath(path, relativeTo) {
        if (!path) {
            return path;
        }
        path = Utils.normalizePath(path);
        if (path.startsWith('.')) {
            return path;
        }
        path = path_1.relative(relativeTo, path);
        return Utils.normalizePath(path);
    }
    static absolutePath(path, baseDir = process.cwd()) {
        if (!path) {
            return Utils.normalizePath(baseDir);
        }
        if (!path_1.isAbsolute(path)) {
            path = baseDir + '/' + path;
        }
        return Utils.normalizePath(path);
    }
    static hash(data) {
        return crypto_1.createHash('md5').update(data).digest('hex');
    }
    static runIfNotEmpty(clause, data) {
        if (!Utils.isEmpty(data)) {
            clause();
        }
    }
    static defaultValue(prop, option, defaultValue) {
        prop[option] = option in prop ? prop[option] : defaultValue;
    }
    static findDuplicates(items) {
        return items.reduce((acc, v, i, arr) => {
            return arr.indexOf(v) !== i && acc.indexOf(v) === -1 ? acc.concat(v) : acc;
        }, []);
    }
    static randomInt(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }
    static async pathExists(path, options = {}) {
        if (globby_1.default.hasMagic(path)) {
            const found = await globby_1.default(path, options);
            return found.length > 0;
        }
        return fs_extra_1.pathExists(path);
    }
    /**
     * Extracts all possible values of a TS enum. Works with both string and numeric enums.
     */
    static extractEnumValues(target) {
        const keys = Object.keys(target);
        const values = Object.values(target);
        const numeric = !!values.find(v => typeof v === 'number');
        const constEnum = values.length % 2 === 0 // const enum will have even number of items
            && values.slice(0, values.length / 2).every(v => typeof v === 'string') // first half are strings
            && values.slice(values.length / 2).every(v => typeof v === 'number') // second half are numbers
            && this.equals(keys, values.slice(values.length / 2).concat(values.slice(0, values.length / 2)).map(v => '' + v)); // and when swapped, it will match the keys
        if (numeric || constEnum) {
            return values.filter(val => !keys.includes(val));
        }
        return values;
    }
    static flatten(arrays) {
        return [].concat.apply([], arrays);
    }
    static isOperator(key, includeGroupOperators = true) {
        if (!includeGroupOperators) {
            return !!enums_1.QueryOperator[key];
        }
        return !!enums_1.GroupOperator[key] || !!enums_1.QueryOperator[key];
    }
    static isGroupOperator(key) {
        return !!enums_1.GroupOperator[key];
    }
    static getGlobalStorage(namespace) {
        const key = `mikro-orm-${namespace}`;
        global[key] = global[key] || {};
        return global[key];
    }
    /**
     * Require a module from a specific location
     * @param id The module to require
     * @param from Location to start the node resolution
     */
    static requireFrom(id, from) {
        if (!path_1.extname(from)) {
            from = path_1.join(from, '__fake.js');
        }
        /* istanbul ignore next */
        return (module_1.createRequire || module_1.createRequireFromPath)(path_1.resolve(from))(id);
    }
    static getORMVersion() {
        /* istanbul ignore next */
        try {
            // this works with ts-node during development (where we have `src` folder)
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require('../../package.json').version;
        }
        catch (_a) {
            // this works with node in production build (where we do not have the `src` folder)
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            return require('../package.json').version;
        }
    }
    /* istanbul ignore next */
    static createFunction(context, code) {
        try {
            return new Function(...context.keys(), code)(...context.values());
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.error(code);
            throw e;
        }
    }
    /* istanbul ignore next */
    static callCompiledFunction(fn, ...args) {
        try {
            return fn(...args);
        }
        catch (e) {
            if ([SyntaxError, TypeError, EvalError, ReferenceError].some(t => e instanceof t)) {
                // eslint-disable-next-line no-console
                console.error(`JIT runtime error: ${e.message}\n\n${fn.toString()}`);
            }
            throw e;
        }
    }
    /**
     * @see https://github.com/mikro-orm/mikro-orm/issues/840
     */
    static propertyDecoratorReturnValue() {
        if (process.env.BABEL_DECORATORS_COMPAT) {
            return {};
        }
    }
    static unwrapProperty(entity, meta, prop, payload = false) {
        let p = prop;
        const path = [];
        function isObjectProperty(prop) {
            return prop.embedded ? prop.object || prop.array || isObjectProperty(meta.properties[prop.embedded[0]]) : prop.object || !!prop.array;
        }
        if (!isObjectProperty(prop) && !prop.embedded) {
            return entity[prop.name] != null ? [[entity[prop.name], []]] : [];
        }
        while (p.embedded) {
            const child = meta.properties[p.embedded[0]];
            if (payload && !child.object && !child.array) {
                break;
            }
            path.shift();
            path.unshift(p.embedded[0], p.embedded[1]);
            p = child;
        }
        const ret = [];
        const follow = (t, idx = 0, i = []) => {
            const k = path[idx];
            if (Array.isArray(t)) {
                return t.forEach((t, ii) => follow(t, idx, [...i, ii]));
            }
            if (t == null) {
                return;
            }
            const target = t[k];
            if (path[++idx]) {
                follow(target, idx, i);
            }
            else if (target != null) {
                ret.push([target, i]);
            }
        };
        follow(entity);
        return ret;
    }
    static setPayloadProperty(entity, meta, prop, value, idx = []) {
        function isObjectProperty(prop) {
            return prop.embedded ? prop.object || prop.array || isObjectProperty(meta.properties[prop.embedded[0]]) : prop.object || !!prop.array;
        }
        if (!isObjectProperty(prop)) {
            entity[prop.name] = value;
            return;
        }
        let target = entity;
        let p = prop;
        const path = [];
        while (p.embedded) {
            path.shift();
            path.unshift(p.embedded[0], p.embedded[1]);
            const prev = p;
            p = meta.properties[p.embedded[0]];
            if (!p.object) {
                path.shift();
                path[0] = prev.name;
                break;
            }
        }
        let j = 0;
        path.forEach((k, i) => {
            if (i === path.length - 1) {
                if (Array.isArray(target)) {
                    target[idx[j++]][k] = value;
                }
                else {
                    target[k] = value;
                }
            }
            else {
                if (Array.isArray(target)) {
                    target = target[idx[j++]][k];
                }
                else {
                    target = target[k];
                }
            }
        });
    }
    static tryRequire({ module, from, allowError, warning }) {
        allowError = allowError !== null && allowError !== void 0 ? allowError : `Cannot find module '${module}'`;
        from = from !== null && from !== void 0 ? from : process.cwd();
        try {
            return Utils.requireFrom(module, from);
        }
        catch (err) {
            if (err.message.includes(allowError)) {
                // eslint-disable-next-line no-console
                console.warn(warning);
                return undefined;
            }
            throw err;
        }
    }
}
exports.Utils = Utils;
Utils.PK_SEPARATOR = '~~~';
