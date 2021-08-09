"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlitePlatform = void 0;
// @ts-ignore
const sqlstring_sqlite_1 = require("sqlstring-sqlite");
const core_1 = require("@mikro-orm/core");
const knex_1 = require("@mikro-orm/knex");
const SqliteSchemaHelper_1 = require("./SqliteSchemaHelper");
const SqliteExceptionConverter_1 = require("./SqliteExceptionConverter");
class SqlitePlatform extends knex_1.AbstractSqlPlatform {
    constructor() {
        super(...arguments);
        this.schemaHelper = new SqliteSchemaHelper_1.SqliteSchemaHelper(this);
        this.exceptionConverter = new SqliteExceptionConverter_1.SqliteExceptionConverter();
    }
    usesDefaultKeyword() {
        return false;
    }
    getCurrentTimestampSQL(length) {
        return super.getCurrentTimestampSQL(0);
    }
    getDateTimeTypeDeclarationSQL(column) {
        return super.getDateTimeTypeDeclarationSQL({ length: 0 });
    }
    getEnumTypeDeclarationSQL(column) {
        var _a;
        /* istanbul ignore next */
        if ((_a = column.items) === null || _a === void 0 ? void 0 : _a.every(item => core_1.Utils.isString(item))) {
            return `text check (${this.quoteIdentifier(column.fieldNames[0])} in ('${column.items.join("', '")}')`;
        }
        return this.getTinyIntTypeDeclarationSQL(column);
    }
    getTinyIntTypeDeclarationSQL(column) {
        return this.getIntegerTypeDeclarationSQL(column);
    }
    getSmallIntTypeDeclarationSQL(column) {
        return this.getIntegerTypeDeclarationSQL(column);
    }
    getIntegerTypeDeclarationSQL(column) {
        return 'integer';
    }
    getFloatDeclarationSQL() {
        return 'real';
    }
    getBooleanTypeDeclarationSQL() {
        return 'integer';
    }
    getVarcharTypeDeclarationSQL(column) {
        return 'text';
    }
    convertsJsonAutomatically() {
        return false;
    }
    allowsComparingTuples() {
        return false;
    }
    /**
     * This is used to narrow the value of Date properties as they will be stored as timestamps in sqlite.
     * We use this method to convert Dates to timestamps when computing the changeset, so we have the right
     * data type in the payload as well as in original entity data. Without that, we would end up with diffs
     * including all Date properties, as we would be comparing Date object with timestamp.
     */
    processDateProperty(value) {
        if (value instanceof Date) {
            return +value;
        }
        return value;
    }
    quoteVersionValue(value, prop) {
        if (prop.type.toLowerCase() === 'date') {
            return sqlstring_sqlite_1.escape(value, true, this.timezone).replace(/^'|\.\d{3}'$/g, '');
        }
        return value;
    }
    requiresValuesKeyword() {
        return true;
    }
    quoteValue(value) {
        /* istanbul ignore if */
        if (core_1.Utils.isPlainObject(value) || (value === null || value === void 0 ? void 0 : value[core_1.JsonProperty])) {
            return sqlstring_sqlite_1.escape(JSON.stringify(value), true, this.timezone);
        }
        if (value instanceof Date) {
            return '' + +value;
        }
        return sqlstring_sqlite_1.escape(value, true, this.timezone);
    }
    getSearchJsonPropertyKey(path, type) {
        const [a, ...b] = path;
        return `json_extract(${this.quoteIdentifier(a)}, '$.${b.join('.')}')`;
    }
    getDefaultIntegrityRule() {
        return 'no action';
    }
    getIndexName(tableName, columns, type) {
        if (type === 'primary') {
            return 'primary';
        }
        return super.getIndexName(tableName, columns, type);
    }
}
exports.SqlitePlatform = SqlitePlatform;
