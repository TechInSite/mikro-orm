"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrator = void 0;
const umzug_1 = __importStar(require("umzug"));
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const core_1 = require("@mikro-orm/core");
const knex_1 = require("@mikro-orm/knex");
const MigrationRunner_1 = require("./MigrationRunner");
const MigrationGenerator_1 = require("./MigrationGenerator");
const MigrationStorage_1 = require("./MigrationStorage");
class Migrator {
    constructor(em) {
        this.em = em;
        this.driver = this.em.getDriver();
        this.schemaGenerator = new knex_1.SchemaGenerator(this.em);
        this.config = this.em.config;
        this.options = this.config.get('migrations');
        this.runner = new MigrationRunner_1.MigrationRunner(this.driver, this.options, this.config);
        this.generator = new MigrationGenerator_1.MigrationGenerator(this.driver, this.config.getNamingStrategy(), this.options);
        this.storage = new MigrationStorage_1.MigrationStorage(this.driver, this.options);
        this.absolutePath = core_1.Utils.absolutePath(this.options.path, this.config.get('baseDir'));
        this.snapshotPath = path_1.join(this.absolutePath, `.snapshot-${this.config.get('dbName')}.json`);
        let migrations = {
            path: this.absolutePath,
            pattern: this.options.pattern,
            customResolver: (file) => this.resolve(file),
        };
        if (this.options.migrationsList) {
            const list = this.options.migrationsList.map(migration => this.initialize(migration.class, migration.name));
            migrations = umzug_1.migrationsList(list);
        }
        this.umzug = new umzug_1.default({
            storage: this.storage,
            logging: this.config.get('logger'),
            migrations,
        });
    }
    async createMigration(path, blank = false, initial = false) {
        if (initial) {
            return this.createInitialMigration(path);
        }
        await this.ensureMigrationsDirExists();
        const diff = await this.getSchemaDiff(blank, initial);
        if (diff.length === 0) {
            return { fileName: '', code: '', diff };
        }
        await this.storeCurrentSchema();
        const migration = await this.generator.generate(diff, path);
        return {
            fileName: migration[1],
            code: migration[0],
            diff,
        };
    }
    async createInitialMigration(path) {
        await this.ensureMigrationsDirExists();
        const schemaExists = await this.validateInitialMigration();
        const diff = await this.getSchemaDiff(false, true);
        const migration = await this.generator.generate(diff, path);
        if (schemaExists) {
            await this.storage.logMigration(migration[1]);
        }
        return {
            fileName: migration[1],
            code: migration[0],
            diff,
        };
    }
    /**
     * Initial migration can be created only if:
     * 1. no previous migrations were generated or executed
     * 2. existing schema do not contain any of the tables defined by metadata
     *
     * If existing schema contains all of the tables already, we return true, based on that we mark the migration as already executed.
     * If only some of the tables are present, exception is thrown.
     */
    async validateInitialMigration() {
        const executed = await this.getExecutedMigrations();
        const pending = await this.getPendingMigrations();
        if (executed.length > 0 || pending.length > 0) {
            throw new Error('Initial migration cannot be created, as some migrations already exist');
        }
        const schema = await knex_1.DatabaseSchema.create(this.em.getConnection(), this.em.getPlatform(), this.config);
        const exists = new Set();
        const expected = new Set();
        Object.values(this.em.getMetadata().getAll())
            .filter(meta => meta.collection)
            .forEach(meta => expected.add(meta.collection));
        schema.getTables().forEach(table => {
            /* istanbul ignore next */
            const tableName = table.schema ? `${table.schema}.${table.name}` : table.name;
            if (expected.has(tableName)) {
                exists.add(tableName);
            }
        });
        if (expected.size === 0) {
            throw new Error('No entities found');
        }
        if (exists.size > 0 && expected.size !== exists.size) {
            throw new Error(`Some tables already exist in your schema, remove them first to create the initial migration: ${[...exists].join(', ')}`);
        }
        return expected.size === exists.size;
    }
    async getExecutedMigrations() {
        await this.ensureMigrationsDirExists();
        await this.storage.ensureTable();
        return this.storage.getExecutedMigrations();
    }
    async getPendingMigrations() {
        await this.ensureMigrationsDirExists();
        await this.storage.ensureTable();
        return this.umzug.pending();
    }
    async up(options) {
        return this.runMigrations('up', options);
    }
    async down(options) {
        return this.runMigrations('down', options);
    }
    getStorage() {
        return this.storage;
    }
    resolve(file) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const migration = require(file);
        const MigrationClass = Object.values(migration)[0];
        return this.initialize(MigrationClass);
    }
    async getCurrentSchema() {
        if (!this.options.snapshot || !await fs_extra_1.pathExists(this.snapshotPath)) {
            return knex_1.DatabaseSchema.create(this.driver.getConnection(), this.driver.getPlatform(), this.config);
        }
        const data = await Promise.resolve().then(() => __importStar(require(this.snapshotPath)));
        const schema = new knex_1.DatabaseSchema(this.driver.getPlatform(), this.config.get('schema'));
        const { tables } = data, rest = __rest(data, ["tables"]);
        const tableInstances = tables.map((tbl) => {
            const table = new knex_1.DatabaseTable(this.driver.getPlatform(), tbl.name);
            const { columns } = tbl, restTable = __rest(tbl, ["columns"]);
            Object.assign(table, restTable);
            Object.keys(columns).forEach(col => {
                const column = Object.assign({}, columns[col]);
                column.mappedType = core_1.Type.getType(core_1.t[columns[col].mappedType]);
                table.addColumn(column);
            });
            return table;
        });
        Object.assign(schema, Object.assign({ tables: tableInstances }, rest));
        return schema;
    }
    async storeCurrentSchema() {
        if (!this.options.snapshot) {
            return;
        }
        const schema = this.schemaGenerator.getTargetSchema();
        await fs_extra_1.writeJSON(this.snapshotPath, schema, { spaces: 2 });
    }
    initialize(MigrationClass, name) {
        const instance = new MigrationClass(this.driver, this.config);
        return {
            name,
            up: () => this.runner.run(instance, 'up'),
            down: () => this.runner.run(instance, 'down'),
        };
    }
    async getSchemaDiff(blank, initial) {
        const lines = [];
        if (blank) {
            lines.push('select 1');
        }
        else if (initial) {
            const dump = await this.schemaGenerator.getCreateSchemaSQL({ wrap: false });
            lines.push(...dump.split('\n'));
        }
        else {
            const dump = await this.schemaGenerator.getUpdateSchemaSQL({
                wrap: false,
                safe: this.options.safe,
                dropTables: this.options.dropTables,
                fromSchema: await this.getCurrentSchema(),
            });
            lines.push(...dump.split('\n'));
        }
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i]) {
                break;
            }
            lines.splice(i, 1);
        }
        return lines;
    }
    prefix(options) {
        if (core_1.Utils.isString(options) || Array.isArray(options)) {
            return core_1.Utils.asArray(options).map(m => {
                const name = m.replace(/\.[jt]s$/, '');
                return name.match(/^\d{14}$/) ? this.options.fileName(name) : m;
            });
        }
        if (!core_1.Utils.isObject(options)) {
            return options;
        }
        if (options.migrations) {
            options.migrations = options.migrations.map(m => this.prefix(m));
        }
        if (options.transaction) {
            delete options.transaction;
        }
        ['from', 'to'].filter(k => options[k]).forEach(k => options[k] = this.prefix(options[k]));
        return options;
    }
    async runMigrations(method, options) {
        await this.ensureMigrationsDirExists();
        await this.storage.ensureTable();
        if (!this.options.transactional || !this.options.allOrNothing) {
            return this.umzug[method](this.prefix(options));
        }
        if (core_1.Utils.isObject(options) && options.transaction) {
            return this.runInTransaction(options.transaction, method, options);
        }
        return this.driver.getConnection().transactional(trx => this.runInTransaction(trx, method, options));
    }
    async runInTransaction(trx, method, options) {
        this.runner.setMasterMigration(trx);
        this.storage.setMasterMigration(trx);
        const ret = await this.umzug[method](this.prefix(options));
        this.runner.unsetMasterMigration();
        this.storage.unsetMasterMigration();
        return ret;
    }
    async ensureMigrationsDirExists() {
        if (!this.options.migrationsList) {
            await fs_extra_1.ensureDir(core_1.Utils.normalizePath(this.options.path));
        }
    }
}
exports.Migrator = Migrator;
