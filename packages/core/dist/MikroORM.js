"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikroORM = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const metadata_1 = require("./metadata");
const utils_1 = require("./utils");
const cache_1 = require("./cache");
/**
 * Helper class for bootstrapping the MikroORM.
 */
class MikroORM {
    constructor(options) {
        if (options instanceof utils_1.Configuration) {
            this.config = options;
        }
        else {
            this.config = new utils_1.Configuration(options);
        }
        if (this.config.get('discovery').disableDynamicFileAccess) {
            this.config.set('metadataProvider', metadata_1.ReflectMetadataProvider);
            this.config.set('cache', { adapter: cache_1.NullCacheAdapter });
            this.config.set('discovery', { disableDynamicFileAccess: true, requireEntitiesArray: true, alwaysAnalyseProperties: false });
        }
        this.driver = this.config.getDriver();
        this.logger = this.config.getLogger();
        this.discovery = new metadata_1.MetadataDiscovery(new metadata_1.MetadataStorage(), this.driver.getPlatform(), this.config);
    }
    /**
     * Initialize the ORM, load entity metadata, create EntityManager and connect to the database.
     * If you omit the `options` parameter, your CLI config will be used.
     */
    static async init(options, connect = true) {
        const env = utils_1.ConfigurationLoader.loadEnvironmentVars(options);
        if (!options) {
            options = await utils_1.ConfigurationLoader.getConfiguration();
        }
        options = options instanceof utils_1.Configuration ? options.getAll() : options;
        const orm = new MikroORM(utils_1.Utils.merge(options, env));
        await orm.discoverEntities();
        if (connect) {
            await orm.connect();
            if (orm.config.get('ensureIndexes')) {
                await orm.driver.ensureIndexes();
            }
        }
        return orm;
    }
    /**
     * Connects to the database.
     */
    async connect() {
        const connection = await this.driver.connect();
        const clientUrl = connection.getClientUrl();
        const dbName = this.config.get('dbName');
        const db = dbName + (clientUrl ? ' on ' + clientUrl : '');
        if (await this.isConnected()) {
            this.logger.log('info', `MikroORM successfully connected to database ${ansi_colors_1.default.green(db)}`);
        }
        else {
            this.logger.log('info', ansi_colors_1.default.red(`MikroORM failed to connect to database ${db}`));
        }
        return this.driver;
    }
    /**
     * Checks whether the database connection is active.
     */
    async isConnected() {
        return this.driver.getConnection().isConnected();
    }
    /**
     * Closes the database connection.
     */
    async close(force = false) {
        return this.driver.close(force);
    }
    /**
     * Gets the MetadataStorage.
     */
    getMetadata() {
        return this.metadata;
    }
    async discoverEntities() {
        this.metadata = await this.discovery.discover(this.config.get('tsNode'));
        this.driver.setMetadata(this.metadata);
        this.em = this.driver.createEntityManager();
        this.metadata.decorate(this.em);
        this.driver.setMetadata(this.metadata);
    }
    /**
     * Allows dynamically discovering new entity by reference, handy for testing schema diffing.
     */
    async discoverEntity(entities) {
        entities = utils_1.Utils.asArray(entities);
        const tmp = await this.discovery.discoverReferences(entities);
        new metadata_1.MetadataValidator().validateDiscovered([...Object.values(this.metadata.getAll()), ...tmp], this.config.get('discovery').warnWhenNoEntities);
        const metadata = this.discovery.processDiscoveredEntities(tmp);
        metadata.forEach(meta => this.metadata.set(meta.className, meta));
        this.metadata.decorate(this.em);
    }
    /**
     * Gets the SchemaGenerator.
     */
    getSchemaGenerator() {
        return this.driver.getPlatform().getSchemaGenerator(this.em);
    }
    /**
     * Gets the EntityGenerator.
     */
    getEntityGenerator() {
        return this.driver.getPlatform().getEntityGenerator(this.em);
    }
    /**
     * Gets the Migrator.
     */
    getMigrator() {
        return this.driver.getPlatform().getMigrator(this.em);
    }
    getSeeder() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { SeedManager } = require('@mikro-orm/seeder');
        return new SeedManager(this);
    }
}
exports.MikroORM = MikroORM;
