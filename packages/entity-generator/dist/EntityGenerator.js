"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGenerator = void 0;
const fs_extra_1 = require("fs-extra");
const core_1 = require("@mikro-orm/core");
const knex_1 = require("@mikro-orm/knex");
const SourceFile_1 = require("./SourceFile");
class EntityGenerator {
    constructor(em) {
        this.em = em;
        this.config = this.em.config;
        this.driver = this.em.getDriver();
        this.platform = this.driver.getPlatform();
        this.helper = this.platform.getSchemaHelper();
        this.connection = this.driver.getConnection();
        this.namingStrategy = this.config.getNamingStrategy();
        this.sources = [];
    }
    async generate(options = {}) {
        const baseDir = core_1.Utils.normalizePath(options.baseDir || this.config.get('baseDir') + '/generated-entities');
        const schema = await knex_1.DatabaseSchema.create(this.connection, this.platform, this.config);
        schema.getTables().forEach(table => this.createEntity(table));
        if (options.save) {
            await fs_extra_1.ensureDir(baseDir);
            await Promise.all(this.sources.map(file => fs_extra_1.writeFile(baseDir + '/' + file.getBaseName(), file.generate())));
        }
        return this.sources.map(file => file.generate());
    }
    createEntity(table) {
        const meta = table.getEntityDeclaration(this.namingStrategy, this.helper);
        this.sources.push(new SourceFile_1.SourceFile(meta, this.namingStrategy, this.platform, this.helper));
    }
}
exports.EntityGenerator = EntityGenerator;
