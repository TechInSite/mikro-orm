"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDatabaseCommand = void 0;
const CLIHelper_1 = require("../CLIHelper");
class CreateDatabaseCommand {
    constructor() {
        this.command = 'database:create';
        this.describe = 'Create your database if it does not exist';
    }
    /**
     * @inheritdoc
     */
    async handler(args) {
        const orm = await CLIHelper_1.CLIHelper.getORM();
        const schemaGenerator = orm.getSchemaGenerator();
        await schemaGenerator.ensureDatabase();
        await orm.close(true);
    }
}
exports.CreateDatabaseCommand = CreateDatabaseCommand;
