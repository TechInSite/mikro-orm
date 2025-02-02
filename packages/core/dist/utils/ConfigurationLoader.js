"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationLoader = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const Configuration_1 = require("./Configuration");
const Utils_1 = require("./Utils");
/**
 * @internal
 */
class ConfigurationLoader {
    static async getConfiguration(validate = true, options) {
        const paths = await ConfigurationLoader.getConfigPaths();
        const env = ConfigurationLoader.loadEnvironmentVars(options);
        for (let path of paths) {
            path = Utils_1.Utils.absolutePath(path);
            path = Utils_1.Utils.normalizePath(path);
            if (await fs_extra_1.pathExists(path)) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const config = require(path);
                return new Configuration_1.Configuration(Object.assign(Object.assign(Object.assign({}, (await (config.default || config))), options), env), validate);
            }
        }
        if (Utils_1.Utils.hasObjectKeys(env)) {
            return new Configuration_1.Configuration(Object.assign(Object.assign({}, options), env), validate);
        }
        throw new Error(`MikroORM config file not found in ['${paths.join(`', '`)}']`);
    }
    static async getPackageConfig() {
        if (await fs_extra_1.pathExists(process.cwd() + '/package.json')) {
            return require(process.cwd() + '/package.json');
        }
        return {};
    }
    static async getSettings() {
        const config = await ConfigurationLoader.getPackageConfig();
        return config['mikro-orm'] || {};
    }
    static async getConfigPaths() {
        const paths = [];
        const settings = await ConfigurationLoader.getSettings();
        if (process.env.MIKRO_ORM_CLI) {
            paths.push(process.env.MIKRO_ORM_CLI);
        }
        paths.push(...(settings.configPaths || []));
        if (settings.useTsNode) {
            paths.push('./mikro-orm.config.ts');
        }
        paths.push('./mikro-orm.config.js');
        const tsNode = Utils_1.Utils.detectTsNode();
        return paths.filter(p => p.endsWith('.js') || tsNode);
    }
    static async registerTsNode(configPath = 'tsconfig.json') {
        var _a;
        const tsConfigPath = path_1.isAbsolute(configPath) ? configPath : path_1.join(process.cwd(), configPath);
        const tsNode = Utils_1.Utils.tryRequire({
            module: 'ts-node',
            from: tsConfigPath,
            warning: 'ts-node not installed, support for working with TS files might not work',
        });
        /* istanbul ignore next */
        if (!tsNode) {
            return;
        }
        const { options } = tsNode.register({
            project: tsConfigPath,
            transpileOnly: true,
        }).config;
        if (Object.entries((_a = options === null || options === void 0 ? void 0 : options.paths) !== null && _a !== void 0 ? _a : {}).length > 0) {
            Utils_1.Utils.requireFrom('tsconfig-paths', tsConfigPath).register({
                baseUrl: options.baseUrl,
                paths: options.paths,
            });
        }
    }
    static loadEnvironmentVars(options) {
        var _a;
        const baseDir = options instanceof Configuration_1.Configuration ? options.get('baseDir') : options === null || options === void 0 ? void 0 : options.baseDir;
        const path = (_a = process.env.MIKRO_ORM_ENV) !== null && _a !== void 0 ? _a : ((baseDir !== null && baseDir !== void 0 ? baseDir : process.cwd()) + '/.env');
        dotenv_1.default.config({ path });
        const ret = {};
        const array = (v) => v.split(',').map(vv => vv.trim());
        const bool = (v) => ['true', 't', '1'].includes(v.toLowerCase());
        const re = (v) => new RegExp(v);
        const num = (v) => +v;
        const read = (o, envKey, key, mapper = v => v) => {
            if (!(envKey in process.env)) {
                return;
            }
            const val = process.env[envKey];
            o[key] = mapper(val);
        };
        const cleanup = (o, k) => Utils_1.Utils.hasObjectKeys(o[k]) ? {} : delete o[k];
        read(ret, 'MIKRO_ORM_BASE_DIR', 'baseDir');
        read(ret, 'MIKRO_ORM_TYPE', 'type');
        read(ret, 'MIKRO_ORM_ENTITIES', 'entities', array);
        read(ret, 'MIKRO_ORM_ENTITIES_TS', 'entitiesTs', array);
        read(ret, 'MIKRO_ORM_CLIENT_URL', 'clientUrl');
        read(ret, 'MIKRO_ORM_HOST', 'host');
        read(ret, 'MIKRO_ORM_PORT', 'port', num);
        read(ret, 'MIKRO_ORM_USER', 'user');
        read(ret, 'MIKRO_ORM_PASSWORD', 'password');
        read(ret, 'MIKRO_ORM_DB_NAME', 'dbName');
        read(ret, 'MIKRO_ORM_LOAD_STRATEGY', 'loadStrategy');
        read(ret, 'MIKRO_ORM_BATCH_SIZE', 'batchSize', num);
        read(ret, 'MIKRO_ORM_USE_BATCH_INSERTS', 'useBatchInserts', bool);
        read(ret, 'MIKRO_ORM_USE_BATCH_UPDATES', 'useBatchUpdates', bool);
        read(ret, 'MIKRO_ORM_STRICT', 'strict', bool);
        read(ret, 'MIKRO_ORM_VALIDATE', 'validate', bool);
        read(ret, 'MIKRO_ORM_AUTO_JOIN_ONE_TO_ONE_OWNER', 'autoJoinOneToOneOwner', bool);
        read(ret, 'MIKRO_ORM_PROPAGATE_TO_ONE_OWNER', 'propagateToOneOwner', bool);
        read(ret, 'MIKRO_ORM_POPULATE_AFTER_FLUSH', 'populateAfterFlush', bool);
        read(ret, 'MIKRO_ORM_FORCE_ENTITY_CONSTRUCTOR', 'forceEntityConstructor', bool);
        read(ret, 'MIKRO_ORM_FORCE_UNDEFINED', 'forceUndefined', bool);
        read(ret, 'MIKRO_ORM_FORCE_UTC_TIMEZONE', 'forceUtcTimezone', bool);
        read(ret, 'MIKRO_ORM_TIMEZONE', 'timezone');
        read(ret, 'MIKRO_ORM_ENSURE_INDEXES', 'ensureIndexes', bool);
        read(ret, 'MIKRO_ORM_IMPLICIT_TRANSACTIONS', 'implicitTransactions', bool);
        read(ret, 'MIKRO_ORM_DEBUG', 'debug', bool);
        read(ret, 'MIKRO_ORM_VERBOSE', 'verbose', bool);
        ret.discovery = {};
        read(ret.discovery, 'MIKRO_ORM_DISCOVERY_WARN_WHEN_NO_ENTITIES', 'warnWhenNoEntities', bool);
        read(ret.discovery, 'MIKRO_ORM_DISCOVERY_REQUIRE_ENTITIES_ARRAY', 'requireEntitiesArray', bool);
        read(ret.discovery, 'MIKRO_ORM_DISCOVERY_ALWAYS_ANALYSE_PROPERTIES', 'alwaysAnalyseProperties', bool);
        read(ret.discovery, 'MIKRO_ORM_DISCOVERY_DISABLE_DYNAMIC_FILE_ACCESS', 'disableDynamicFileAccess', bool);
        cleanup(ret, 'discovery');
        ret.migrations = {};
        read(ret.migrations, 'MIKRO_ORM_MIGRATIONS_TABLE_NAME', 'tableName');
        read(ret.migrations, 'MIKRO_ORM_MIGRATIONS_PATH', 'path');
        read(ret.migrations, 'MIKRO_ORM_MIGRATIONS_PATTERN', 'pattern', re);
        read(ret.migrations, 'MIKRO_ORM_MIGRATIONS_TRANSACTIONAL', 'transactional', bool);
        read(ret.migrations, 'MIKRO_ORM_MIGRATIONS_DISABLE_FOREIGN_KEYS', 'disableForeignKeys', bool);
        read(ret.migrations, 'MIKRO_ORM_MIGRATIONS_ALL_OR_NOTHING', 'allOrNothing', bool);
        read(ret.migrations, 'MIKRO_ORM_MIGRATIONS_DROP_TABLES', 'dropTables', bool);
        read(ret.migrations, 'MIKRO_ORM_MIGRATIONS_SAFE', 'safe', bool);
        read(ret.migrations, 'MIKRO_ORM_MIGRATIONS_EMIT', 'emit');
        cleanup(ret, 'migrations');
        return ret;
    }
}
exports.ConfigurationLoader = ConfigurationLoader;
