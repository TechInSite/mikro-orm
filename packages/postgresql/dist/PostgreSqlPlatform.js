"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSqlPlatform = void 0;
const pg_1 = require("pg");
const core_1 = require("@mikro-orm/core");
const knex_1 = require("@mikro-orm/knex");
const PostgreSqlSchemaHelper_1 = require("./PostgreSqlSchemaHelper");
const PostgreSqlExceptionConverter_1 = require("./PostgreSqlExceptionConverter");
class PostgreSqlPlatform extends knex_1.AbstractSqlPlatform {
    constructor() {
        super(...arguments);
        this.schemaHelper = new PostgreSqlSchemaHelper_1.PostgreSqlSchemaHelper(this);
        this.exceptionConverter = new PostgreSqlExceptionConverter_1.PostgreSqlExceptionConverter();
    }
    usesReturningStatement() {
        return true;
    }
    usesCascadeStatement() {
        return true;
    }
    /**
     * Postgres will complain if we try to batch update uniquely constrained property (moving the value from one entity to another).
     * This flag will result in postponing 1:1 updates (removing them from the batched query).
     * @see https://stackoverflow.com/questions/5403437/atomic-multi-row-update-with-a-unique-constraint
     */
    allowsUniqueBatchUpdates() {
        return false;
    }
    getCurrentTimestampSQL(length) {
        return `current_timestamp(${length})`;
    }
    getDateTimeTypeDeclarationSQL(column) {
        return 'timestamptz' + (column.length != null ? `(${column.length})` : '');
    }
    getTimeTypeDeclarationSQL() {
        return 'time(0)';
    }
    getIntegerTypeDeclarationSQL(column) {
        if (column.autoincrement) {
            return `serial`;
        }
        return `int`;
    }
    getBigIntTypeDeclarationSQL(column) {
        /* istanbul ignore next */
        if (column.autoincrement) {
            return `bigserial`;
        }
        return 'bigint';
    }
    getTinyIntTypeDeclarationSQL(column) {
        return 'smallint';
    }
    getUuidTypeDeclarationSQL(column) {
        return `uuid`;
    }
    getRegExpOperator() {
        return '~';
    }
    isBigIntProperty(prop) {
        return super.isBigIntProperty(prop) || (prop.columnTypes && prop.columnTypes[0] === 'bigserial');
    }
    getArrayDeclarationSQL() {
        return 'text[]';
    }
    getFloatDeclarationSQL() {
        return 'real';
    }
    getDoubleDeclarationSQL() {
        return 'double precision';
    }
    getEnumTypeDeclarationSQL(column) {
        var _a;
        if ((_a = column.items) === null || _a === void 0 ? void 0 : _a.every(item => core_1.Utils.isString(item))) {
            return `text check (${this.quoteIdentifier(column.fieldNames[0])} in ('${column.items.join("', '")}'))`;
        }
        return `smallint`;
    }
    marshallArray(values) {
        return `{${values.join(',')}}`;
    }
    getBlobDeclarationSQL() {
        return 'bytea';
    }
    getJsonDeclarationSQL() {
        return 'jsonb';
    }
    getSearchJsonPropertyKey(path, type) {
        const first = path.shift();
        const last = path.pop();
        const root = this.quoteIdentifier(first);
        const types = {
            number: 'float8',
            boolean: 'bool',
        };
        const cast = (key) => type in types ? `(${key})::${types[type]}` : key;
        if (path.length === 0) {
            return cast(`${root}->>'${last}'`);
        }
        return cast(`${root}->${path.map(a => this.quoteValue(a)).join('->')}->>'${last}'`);
    }
    quoteIdentifier(id, quote = '"') {
        return `${quote}${id.replace('.', `${quote}.${quote}`)}${quote}`;
    }
    quoteValue(value) {
        /* istanbul ignore if */
        if (core_1.Utils.isPlainObject(value) || (value === null || value === void 0 ? void 0 : value[core_1.JsonProperty])) {
            value = JSON.stringify(value);
        }
        if (typeof value === 'string') {
            return pg_1.Client.prototype.escapeLiteral(value);
        }
        if (value instanceof Date) {
            return `'${value.toISOString()}'`;
        }
        if (ArrayBuffer.isView(value)) {
            return `E'\\\\x${value.toString('hex')}'`;
        }
        return super.quoteValue(value);
    }
    getDefaultIntegrityRule() {
        return 'no action';
    }
    indexForeignKeys() {
        return false;
    }
    getMappedType(type) {
        var _a;
        const normalizedType = this.extractSimpleType(type);
        const map = {
            'int2': 'smallint',
            'smallserial': 'smallint',
            'int': 'integer',
            'int4': 'integer',
            'serial': 'integer',
            'serial4': 'integer',
            'int8': 'bigint',
            'bigserial': 'bigint',
            'serial8': 'bigint',
            'numeric': 'decimal',
            'bool': 'boolean',
            'real': 'float',
            'float4': 'float',
            'float8': 'double',
            'timestamp': 'datetime',
            'timestamptz': 'datetime',
            'bytea': 'blob',
            'jsonb': 'json',
            'character varying': 'varchar',
        };
        return super.getMappedType((_a = map[normalizedType]) !== null && _a !== void 0 ? _a : type);
    }
    supportsSchemas() {
        return true;
    }
    /**
     * Returns the default name of index for the given columns
     * cannot go past 64 character length for identifiers in MySQL
     */
    getIndexName(tableName, columns, type) {
        let indexName = super.getIndexName(tableName, columns, type);
        if (indexName.length > 64) {
            indexName = `${indexName.substr(0, 57 - type.length)}_${core_1.Utils.hash(indexName).substr(0, 5)}_${type}`;
        }
        return indexName;
    }
}
exports.PostgreSqlPlatform = PostgreSqlPlatform;
