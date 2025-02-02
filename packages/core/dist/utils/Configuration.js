"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
const util_1 = require("util");
const cache_1 = require("../cache");
const hydration_1 = require("../hydration");
const NullHighlighter_1 = require("../utils/NullHighlighter");
const Logger_1 = require("../utils/Logger");
const Utils_1 = require("../utils/Utils");
const MetadataStorage_1 = require("../metadata/MetadataStorage");
const ReflectMetadataProvider_1 = require("../metadata/ReflectMetadataProvider");
const errors_1 = require("../errors");
const RequestContext_1 = require("./RequestContext");
const enums_1 = require("../enums");
const MemoryCacheAdapter_1 = require("../cache/MemoryCacheAdapter");
class Configuration {
    constructor(options, validate = true) {
        this.cache = {};
        this.options = Utils_1.Utils.merge({}, Configuration.DEFAULTS, options);
        this.options.baseDir = Utils_1.Utils.absolutePath(this.options.baseDir);
        if (validate) {
            this.validateOptions();
        }
        this.logger = new Logger_1.Logger(this.options.logger, this.options.debug);
        this.driver = this.initDriver();
        this.platform = this.driver.getPlatform();
        this.platform.setConfig(this);
        this.init();
    }
    /**
     * Gets specific configuration option. Falls back to specified `defaultValue` if provided.
     */
    get(key, defaultValue) {
        return (Utils_1.Utils.isDefined(this.options[key]) ? this.options[key] : defaultValue);
    }
    getAll() {
        return this.options;
    }
    /**
     * Overrides specified configuration value.
     */
    set(key, value) {
        this.options[key] = value;
    }
    /**
     * Resets the configuration to its default value
     */
    reset(key) {
        this.options[key] = Configuration.DEFAULTS[key];
    }
    /**
     * Gets Logger instance.
     */
    getLogger() {
        return this.logger;
    }
    /**
     * Gets current client URL (connection string).
     */
    getClientUrl(hidePassword = false) {
        if (hidePassword) {
            return this.options.clientUrl.replace(/\/\/([^:]+):(.+)@/, '//$1:*****@');
        }
        return this.options.clientUrl;
    }
    /**
     * Gets current database driver instance.
     */
    getDriver() {
        return this.driver;
    }
    /**
     * Gets instance of NamingStrategy. (cached)
     */
    getNamingStrategy() {
        return this.cached(this.options.namingStrategy || this.platform.getNamingStrategy());
    }
    /**
     * Gets instance of Hydrator.
     */
    getHydrator(metadata) {
        return this.cached(this.options.hydrator, metadata, this.platform, this);
    }
    /**
     * Gets instance of MetadataProvider. (cached)
     */
    getMetadataProvider() {
        return this.cached(this.options.metadataProvider, this);
    }
    /**
     * Gets instance of CacheAdapter. (cached)
     */
    getCacheAdapter() {
        return this.cached(this.options.cache.adapter, this.options.cache.options, this.options.baseDir, this.options.cache.pretty);
    }
    /**
     * Gets instance of CacheAdapter for result cache. (cached)
     */
    getResultCacheAdapter() {
        return this.cached(this.options.resultCache.adapter, Object.assign({ expiration: this.options.resultCache.expiration }, this.options.resultCache.options));
    }
    /**
     * Gets EntityRepository class to be instantiated.
     */
    getRepositoryClass(customRepository) {
        if (customRepository) {
            return customRepository();
        }
        if (this.options.entityRepository) {
            return this.options.entityRepository;
        }
        return this.platform.getRepositoryClass();
    }
    init() {
        if (!this.getMetadataProvider().useCache()) {
            this.options.cache.adapter = cache_1.NullCacheAdapter;
        }
        if (!('enabled' in this.options.cache)) {
            this.options.cache.enabled = this.getMetadataProvider().useCache();
        }
        if (!this.options.clientUrl) {
            this.options.clientUrl = this.driver.getConnection().getDefaultClientUrl();
        }
        if (!('implicitTransactions' in this.options)) {
            this.set('implicitTransactions', this.platform.usesImplicitTransactions());
        }
        const url = this.getClientUrl().match(/:\/\/.+\/([^?]+)/);
        if (url) {
            this.options.dbName = this.get('dbName', url[1]);
        }
        if (!this.options.charset) {
            this.options.charset = this.platform.getDefaultCharset();
        }
        Object.keys(this.options.filters).forEach(key => {
            var _a;
            this.options.filters[key].default = (_a = this.options.filters[key].default) !== null && _a !== void 0 ? _a : true;
        });
        const subscribers = Object.values(MetadataStorage_1.MetadataStorage.getSubscriberMetadata());
        this.options.subscribers = [...new Set([...this.options.subscribers, ...subscribers])];
    }
    validateOptions() {
        if (!this.options.type && !this.options.driver) {
            throw new Error('No platform type specified, please fill in `type` or provide custom driver class in `driver` option. Available platforms types: ' + util_1.inspect(Object.keys(Configuration.PLATFORMS)));
        }
        if (this.options.type && !(this.options.type in Configuration.PLATFORMS)) {
            throw new Error(`Invalid platform type specified: '${this.options.type}', please fill in valid \`type\` or provide custom driver class in \`driver\` option. Available platforms types: ${util_1.inspect(Object.keys(Configuration.PLATFORMS))}`);
        }
        if (!this.options.dbName && !this.options.clientUrl) {
            throw new Error('No database specified, please fill in `dbName` or `clientUrl` option');
        }
        if (this.options.entities.length === 0 && this.options.discovery.warnWhenNoEntities) {
            throw new Error('No entities found, please use `entities` option');
        }
    }
    initDriver() {
        if (!this.options.driver) {
            const { className, module } = Configuration.PLATFORMS[this.options.type];
            this.options.driver = module()[className];
        }
        return new this.options.driver(this);
    }
    cached(cls, ...args) {
        if (!this.cache[cls.name]) {
            const Class = cls;
            this.cache[cls.name] = new Class(...args);
        }
        return this.cache[cls.name];
    }
}
exports.Configuration = Configuration;
Configuration.DEFAULTS = {
    pool: {},
    entities: [],
    entitiesTs: [],
    subscribers: [],
    filters: {},
    discovery: {
        warnWhenNoEntities: true,
        requireEntitiesArray: false,
        alwaysAnalyseProperties: true,
        disableDynamicFileAccess: false,
    },
    strict: false,
    validate: false,
    context: (name) => RequestContext_1.RequestContext.getEntityManager(name),
    contextName: 'default',
    // eslint-disable-next-line no-console
    logger: console.log.bind(console),
    findOneOrFailHandler: (entityName, where) => errors_1.NotFoundError.findOneFailed(entityName, where),
    baseDir: process.cwd(),
    hydrator: hydration_1.ObjectHydrator,
    loadStrategy: enums_1.LoadStrategy.SELECT_IN,
    autoJoinOneToOneOwner: true,
    propagateToOneOwner: true,
    populateAfterFlush: false,
    forceEntityConstructor: false,
    forceUndefined: false,
    forceUtcTimezone: false,
    ensureIndexes: false,
    batchSize: 300,
    debug: false,
    verbose: false,
    driverOptions: {},
    migrations: {
        tableName: 'mikro_orm_migrations',
        path: './migrations',
        pattern: /^[\w-]+\d+\.ts$/,
        transactional: true,
        disableForeignKeys: true,
        allOrNothing: true,
        dropTables: true,
        safe: false,
        snapshot: true,
        emit: 'ts',
        fileName: (timestamp) => `Migration${timestamp}`,
    },
    cache: {
        pretty: false,
        adapter: cache_1.FileCacheAdapter,
        options: { cacheDir: process.cwd() + '/temp' },
    },
    resultCache: {
        adapter: MemoryCacheAdapter_1.MemoryCacheAdapter,
        expiration: 1000,
        options: {},
    },
    metadataProvider: ReflectMetadataProvider_1.ReflectMetadataProvider,
    highlighter: new NullHighlighter_1.NullHighlighter(),
    seeder: { path: './database/seeder', defaultSeeder: 'DatabaseSeeder' },
};
Configuration.PLATFORMS = {
    mongo: { className: 'MongoDriver', module: () => require('@mikro-orm/mongodb') },
    mysql: { className: 'MySqlDriver', module: () => require('@mikro-orm/mysql') },
    mariadb: { className: 'MariaDbDriver', module: () => require('@mikro-orm/mariadb') },
    postgresql: { className: 'PostgreSqlDriver', module: () => require('@mikro-orm/postgresql') },
    sqlite: { className: 'SqliteDriver', module: () => require('@mikro-orm/sqlite') },
};
