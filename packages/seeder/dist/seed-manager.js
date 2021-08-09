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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedManager = void 0;
const core_1 = require("@mikro-orm/core");
const fs_extra_1 = require("fs-extra");
class SeedManager {
    constructor(orm) {
        this.orm = orm;
    }
    async refreshDatabase() {
        const generator = this.orm.getSchemaGenerator();
        await generator.dropSchema();
        await generator.createSchema();
    }
    async seed(...seederClasses) {
        for (const seederClass of seederClasses) {
            const seeder = new seederClass();
            await seeder.run(this.orm.em);
            await this.orm.em.flush();
            this.orm.em.clear();
        }
    }
    async seedString(...seederClasses) {
        for (const seederClass of seederClasses) {
            const seeder = await Promise.resolve().then(() => __importStar(require(`${process.cwd()}/${this.orm.config.get('seeder').path}/${this.getFileName(seederClass)}`)));
            await this.seed(seeder[seederClass]);
        }
    }
    async createSeeder(seederClass) {
        await this.ensureMigrationsDirExists();
        return this.generate(seederClass);
    }
    getFileName(seederClass) {
        const split = seederClass.split(/(?=[A-Z])/);
        const parts = split.reduce((previousValue, currentValue, index) => {
            if (index === split.length - 1) {
                return previousValue;
            }
            previousValue.push(currentValue.toLowerCase());
            return previousValue;
        }, []);
        return `${parts.join('-')}.seeder.ts`;
    }
    async ensureMigrationsDirExists() {
        await fs_extra_1.ensureDir(core_1.Utils.normalizePath(this.orm.config.get('seeder').path));
    }
    async generate(seederClass) {
        const path = core_1.Utils.normalizePath(this.orm.config.get('seeder').path);
        const fileName = this.getFileName(seederClass);
        const ret = `import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
export class ${seederClass} extends Seeder {

  run(em: EntityManager): Promise<void> {
  }

}`;
        await fs_extra_1.writeFile(path + '/' + fileName, ret);
        return path + '/' + fileName;
    }
}
exports.SeedManager = SeedManager;
