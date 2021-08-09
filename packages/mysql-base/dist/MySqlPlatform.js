"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlPlatform = void 0;
const knex_1 = require("@mikro-orm/knex");
const MySqlSchemaHelper_1 = require("./MySqlSchemaHelper");
const MySqlExceptionConverter_1 = require("./MySqlExceptionConverter");
const core_1 = require("@mikro-orm/core");
class MySqlPlatform extends knex_1.AbstractSqlPlatform {
    constructor() {
        super(...arguments);
        this.schemaHelper = new MySqlSchemaHelper_1.MySqlSchemaHelper(this);
        this.exceptionConverter = new MySqlExceptionConverter_1.MySqlExceptionConverter();
    }
    getDefaultCharset() {
        return 'utf8mb4';
    }
    getSearchJsonPropertyKey(path, type) {
        const [a, ...b] = path;
        return `${this.quoteIdentifier(a)}->'$.${b.join('.')}'`;
    }
    getBooleanTypeDeclarationSQL() {
        return 'tinyint(1)';
    }
    getMappedType(type) {
        var _a;
        if (type === 'tinyint(1)') {
            return super.getMappedType('boolean');
        }
        const normalizedType = this.extractSimpleType(type);
        const map = {
            int: 'integer',
        };
        return super.getMappedType((_a = map[normalizedType]) !== null && _a !== void 0 ? _a : type);
    }
    supportsUnsigned() {
        return true;
    }
    /**
     * Returns the default name of index for the given columns
     * cannot go past 64 character length for identifiers in MySQL
     */
    getIndexName(tableName, columns, type) {
        if (type === 'primary') {
            return 'PRIMARY'; // https://dev.mysql.com/doc/refman/8.0/en/create-table.html#create-table-indexes-keys
        }
        let indexName = super.getIndexName(tableName, columns, type);
        if (indexName.length > 64) {
            indexName = `${indexName.substr(0, 57 - type.length)}_${core_1.Utils.hash(indexName).substr(0, 5)}_${type}`;
        }
        return indexName;
    }
}
exports.MySqlPlatform = MySqlPlatform;
