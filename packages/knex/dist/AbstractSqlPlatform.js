"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSqlPlatform = void 0;
const sqlstring_1 = require("sqlstring");
const core_1 = require("@mikro-orm/core");
const SqlEntityRepository_1 = require("./SqlEntityRepository");
const schema_1 = require("./schema");
class AbstractSqlPlatform extends core_1.Platform {
    usesPivotTable() {
        return true;
    }
    indexForeignKeys() {
        return true;
    }
    getRepositoryClass() {
        return SqlEntityRepository_1.SqlEntityRepository;
    }
    getSchemaHelper() {
        return this.schemaHelper;
    }
    getSchemaGenerator(em) {
        return new schema_1.SchemaGenerator(em); // cast as `any` to get around circular dependencies
    }
    getEntityGenerator(em) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { EntityGenerator } = require('@mikro-orm/entity-generator');
        return new EntityGenerator(em);
    }
    getMigrator(em) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { Migrator } = require('@mikro-orm/migrations');
        return new Migrator(em);
    }
    quoteValue(value) {
        /* istanbul ignore if */
        if (core_1.Utils.isPlainObject(value) || (value === null || value === void 0 ? void 0 : value[core_1.JsonProperty])) {
            return sqlstring_1.escape(JSON.stringify(value));
        }
        // @ts-ignore
        return sqlstring_1.escape(value, true, this.timezone);
    }
    formatQuery(sql, params) {
        if (params.length === 0) {
            return sql;
        }
        // fast string replace without regexps
        let j = 0;
        let pos = 0;
        let ret = '';
        while (pos < sql.length) {
            const idx = sql.indexOf('?', pos + 1);
            if (idx === -1) {
                ret += sql.substring(pos, sql.length);
                break;
            }
            if (sql.substr(idx - 1, 2) === '\\?') {
                ret += sql.substr(pos, idx - pos - 1) + '?';
                pos = idx + 1;
            }
            else if (sql.substr(idx, 2) === '??') {
                ret += sql.substr(pos, idx - pos) + this.quoteIdentifier(params[j++]);
                pos = idx + 2;
            }
            else {
                ret += sql.substr(pos, idx - pos) + this.quoteValue(params[j++]);
                pos = idx + 1;
            }
        }
        return ret;
    }
    getSearchJsonPropertySQL(path, type) {
        return this.getSearchJsonPropertyKey(path.split('->'), type);
    }
    isRaw(value) {
        return super.isRaw(value) || (typeof value === 'object' && value !== null && value.client && value.ref && value.constructor.name === 'Ref');
    }
    supportsSchemas() {
        return false;
    }
}
exports.AbstractSqlPlatform = AbstractSqlPlatform;
