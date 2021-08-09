"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = exports.JsonProperty = void 0;
const entity_1 = require("../entity");
const naming_strategy_1 = require("../naming-strategy");
const ExceptionConverter_1 = require("./ExceptionConverter");
const types_1 = require("../types");
const Utils_1 = require("../utils/Utils");
const clone_1 = __importDefault(require("clone"));
exports.JsonProperty = Symbol('JsonProperty');
class Platform {
    constructor() {
        this.exceptionConverter = new ExceptionConverter_1.ExceptionConverter();
    }
    usesPivotTable() {
        return false;
    }
    supportsTransactions() {
        return true;
    }
    usesImplicitTransactions() {
        return true;
    }
    getNamingStrategy() {
        return naming_strategy_1.UnderscoreNamingStrategy;
    }
    usesReturningStatement() {
        return false;
    }
    usesCascadeStatement() {
        return false;
    }
    getSchemaHelper() {
        return undefined;
    }
    indexForeignKeys() {
        return false;
    }
    allowsMultiInsert() {
        return true;
    }
    /**
     * Whether or not the driver supports retuning list of created PKs back when multi-inserting
     */
    usesBatchInserts() {
        return true;
    }
    /**
     * Whether or not the driver supports updating many records at once
     */
    usesBatchUpdates() {
        return true;
    }
    usesDefaultKeyword() {
        return true;
    }
    /**
     * Normalizes primary key wrapper to scalar value (e.g. mongodb's ObjectId to string)
     */
    normalizePrimaryKey(data) {
        return data;
    }
    /**
     * Converts scalar primary key representation to native driver wrapper (e.g. string to mongodb's ObjectId)
     */
    denormalizePrimaryKey(data) {
        return data;
    }
    /**
     * Used when serializing via toObject and toJSON methods, allows to use different PK field name (like `id` instead of `_id`)
     */
    getSerializedPrimaryKeyField(field) {
        return field;
    }
    usesDifferentSerializedPrimaryKey() {
        return false;
    }
    /**
     * Returns the SQL specific for the platform to get the current timestamp
     */
    getCurrentTimestampSQL(length) {
        return 'current_timestamp' + (length ? `(${length})` : '');
    }
    getDateTimeTypeDeclarationSQL(column) {
        return 'datetime' + (column.length ? `(${column.length})` : '');
    }
    getDateTypeDeclarationSQL(length) {
        return 'date' + (length ? `(${length})` : '');
    }
    getTimeTypeDeclarationSQL(length) {
        return 'time' + (length ? `(${length})` : '');
    }
    getRegExpOperator() {
        return 'regexp';
    }
    quoteVersionValue(value, prop) {
        return value;
    }
    getDefaultVersionLength() {
        return 3;
    }
    requiresValuesKeyword() {
        return false;
    }
    allowsComparingTuples() {
        return true;
    }
    allowsUniqueBatchUpdates() {
        return true;
    }
    isBigIntProperty(prop) {
        return prop.columnTypes && prop.columnTypes[0] === 'bigint';
    }
    isRaw(value) {
        return typeof value === 'object' && value !== null && '__raw' in value;
    }
    getBooleanTypeDeclarationSQL() {
        return 'boolean';
    }
    getIntegerTypeDeclarationSQL(column) {
        return 'int';
    }
    getSmallIntTypeDeclarationSQL(column) {
        return 'smallint';
    }
    getTinyIntTypeDeclarationSQL(column) {
        return 'tinyint';
    }
    getBigIntTypeDeclarationSQL(column) {
        return 'bigint';
    }
    getVarcharTypeDeclarationSQL(column) {
        var _a;
        return `varchar(${(_a = column.length) !== null && _a !== void 0 ? _a : 255})`;
    }
    getTextTypeDeclarationSQL(_column) {
        return `text`;
    }
    getEnumTypeDeclarationSQL(column) {
        var _a;
        if ((_a = column.items) === null || _a === void 0 ? void 0 : _a.every(item => Utils_1.Utils.isString(item))) {
            return `enum('${column.items.join("', '")}')`;
        }
        return this.getTinyIntTypeDeclarationSQL(column);
    }
    getFloatDeclarationSQL() {
        return 'float';
    }
    getDoubleDeclarationSQL() {
        return 'double';
    }
    getDecimalTypeDeclarationSQL(column) {
        var _a, _b;
        const precision = (_a = column.precision) !== null && _a !== void 0 ? _a : 10;
        const scale = (_b = column.scale) !== null && _b !== void 0 ? _b : 0;
        return `numeric(${precision},${scale})`;
    }
    getUuidTypeDeclarationSQL(column) {
        var _a;
        column.length = (_a = column.length) !== null && _a !== void 0 ? _a : 36;
        return this.getVarcharTypeDeclarationSQL(column);
    }
    extractSimpleType(type) {
        return type.toLowerCase().match(/[^(), ]+/)[0];
    }
    getMappedType(type) {
        if (type.endsWith('[]')) {
            return types_1.Type.getType(types_1.ArrayType);
        }
        switch (this.extractSimpleType(type)) {
            case 'string': return types_1.Type.getType(types_1.StringType);
            case 'varchar': return types_1.Type.getType(types_1.StringType);
            case 'text': return types_1.Type.getType(types_1.TextType);
            case 'number': return types_1.Type.getType(types_1.IntegerType);
            case 'bigint': return types_1.Type.getType(types_1.BigIntType);
            case 'smallint': return types_1.Type.getType(types_1.SmallIntType);
            case 'tinyint': return types_1.Type.getType(types_1.TinyIntType);
            case 'float': return types_1.Type.getType(types_1.FloatType);
            case 'double': return types_1.Type.getType(types_1.DoubleType);
            case 'integer': return types_1.Type.getType(types_1.IntegerType);
            case 'decimal':
            case 'numeric': return types_1.Type.getType(types_1.DecimalType);
            case 'boolean': return types_1.Type.getType(types_1.BooleanType);
            case 'blob':
            case 'buffer': return types_1.Type.getType(types_1.BlobType);
            case 'uuid': return types_1.Type.getType(types_1.UuidType);
            case 'date': return types_1.Type.getType(types_1.DateType);
            case 'datetime': return types_1.Type.getType(types_1.DateTimeType);
            case 'time': return types_1.Type.getType(types_1.TimeType);
            case 'object':
            case 'json': return types_1.Type.getType(types_1.JsonType);
            case 'enum': return types_1.Type.getType(types_1.EnumType);
            default: return types_1.Type.getType(types_1.UnknownType);
        }
    }
    getArrayDeclarationSQL() {
        return 'text';
    }
    getDefaultIntegrityRule() {
        return 'restrict';
    }
    marshallArray(values) {
        return values.join(',');
    }
    unmarshallArray(value) {
        if (value === '') {
            return [];
        }
        return value.split(',');
    }
    getBlobDeclarationSQL() {
        return 'blob';
    }
    getJsonDeclarationSQL() {
        return 'json';
    }
    getSearchJsonPropertySQL(path, type) {
        return path;
    }
    getSearchJsonPropertyKey(path, type) {
        return path.join('.');
    }
    convertsJsonAutomatically(marshall = false) {
        return !marshall;
    }
    getRepositoryClass() {
        return entity_1.EntityRepository;
    }
    getDefaultCharset() {
        return 'utf8';
    }
    getExceptionConverter() {
        return this.exceptionConverter;
    }
    getSchemaGenerator(em) {
        throw new Error(`${this.constructor.name} does not support SchemaGenerator`);
    }
    getEntityGenerator(em) {
        throw new Error(`${this.constructor.name} does not support EntityGenerator`);
    }
    getMigrator(em) {
        throw new Error(`${this.constructor.name} does not support Migrator`);
    }
    processDateProperty(value) {
        return value;
    }
    quoteIdentifier(id, quote = '`') {
        return `${quote}${id.replace('.', `${quote}.${quote}`)}${quote}`;
    }
    quoteValue(value) {
        return value;
    }
    cloneEmbeddable(data) {
        const copy = clone_1.default(data);
        // tag the copy so we know it should be stringified when quoting (so we know how to treat JSON arrays)
        Object.defineProperty(copy, exports.JsonProperty, { enumerable: false, value: true });
        return copy;
    }
    setConfig(config) {
        this.config = config;
        this.namingStrategy = config.getNamingStrategy();
        if (this.config.get('forceUtcTimezone')) {
            this.timezone = 'Z';
        }
        else {
            this.timezone = this.config.get('timezone');
        }
    }
    isNumericColumn(mappedType) {
        return [types_1.IntegerType, types_1.SmallIntType, types_1.BigIntType].some(t => mappedType instanceof t);
    }
    supportsUnsigned() {
        return false;
    }
    /**
     * Returns the default name of index for the given columns
     */
    getIndexName(tableName, columns, type) {
        return this.namingStrategy.indexName(tableName, columns, type);
    }
}
exports.Platform = Platform;
