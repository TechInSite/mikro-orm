"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractNamingStrategy = void 0;
class AbstractNamingStrategy {
    getClassName(file, separator = '-') {
        const name = file.split('.')[0];
        const ret = name.replace(new RegExp(`${separator}+(\\w)`, 'g'), m => m[1].toUpperCase());
        return ret.charAt(0).toUpperCase() + ret.slice(1);
    }
    classToMigrationName(timestamp) {
        return `Migration${timestamp}`;
    }
    indexName(tableName, columns, type) {
        if (tableName.includes('.')) {
            tableName = tableName.substr(tableName.indexOf('.') + 1);
        }
        if (type === 'primary') {
            return `${tableName}_pkey`;
        }
        if (type === 'sequence') {
            return `${tableName}_${columns.join('_')}_seq`;
        }
        return `${tableName}_${columns.join('_')}_${type}`;
    }
    columnNameToProperty(columnName) {
        return columnName.replace(/[_ ](\w)/g, m => m[1].toUpperCase()).replace(/_+/g, '');
    }
}
exports.AbstractNamingStrategy = AbstractNamingStrategy;
