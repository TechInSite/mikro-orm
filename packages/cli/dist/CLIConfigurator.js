"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIConfigurator = void 0;
const yargs_1 = __importDefault(require("yargs"));
const core_1 = require("@mikro-orm/core");
const ClearCacheCommand_1 = require("./commands/ClearCacheCommand");
const DatabaseSeedCommand_1 = require("./commands/DatabaseSeedCommand");
const DebugCommand_1 = require("./commands/DebugCommand");
const GenerateCacheCommand_1 = require("./commands/GenerateCacheCommand");
const GenerateEntitiesCommand_1 = require("./commands/GenerateEntitiesCommand");
const ImportCommand_1 = require("./commands/ImportCommand");
const MigrationCommandFactory_1 = require("./commands/MigrationCommandFactory");
const SchemaCommandFactory_1 = require("./commands/SchemaCommandFactory");
const CreateSeederCommand_1 = require("./commands/CreateSeederCommand");
const CreateDatabaseCommand_1 = require("./commands/CreateDatabaseCommand");
/**
 * @internal
 */
class CLIConfigurator {
    static async configure() {
        const settings = await core_1.ConfigurationLoader.getSettings();
        if (settings.useTsNode) {
            await core_1.ConfigurationLoader.registerTsNode(settings.tsConfigPath);
        }
        // noinspection HtmlDeprecatedTag
        return yargs_1.default
            .scriptName('mikro-orm')
            .version(core_1.Utils.getORMVersion())
            .usage('Usage: $0 <command> [options]')
            .example('$0 schema:update --run', 'Runs schema synchronization')
            .alias('v', 'version')
            .alias('h', 'help')
            .command(new ClearCacheCommand_1.ClearCacheCommand())
            .command(new GenerateCacheCommand_1.GenerateCacheCommand())
            .command(new GenerateEntitiesCommand_1.GenerateEntitiesCommand())
            .command(new CreateDatabaseCommand_1.CreateDatabaseCommand())
            .command(new ImportCommand_1.ImportCommand())
            .command(new DatabaseSeedCommand_1.DatabaseSeedCommand())
            .command(new CreateSeederCommand_1.CreateSeederCommand())
            .command(SchemaCommandFactory_1.SchemaCommandFactory.create('create'))
            .command(SchemaCommandFactory_1.SchemaCommandFactory.create('drop'))
            .command(SchemaCommandFactory_1.SchemaCommandFactory.create('update'))
            .command(SchemaCommandFactory_1.SchemaCommandFactory.create('fresh'))
            .command(MigrationCommandFactory_1.MigrationCommandFactory.create('create'))
            .command(MigrationCommandFactory_1.MigrationCommandFactory.create('up'))
            .command(MigrationCommandFactory_1.MigrationCommandFactory.create('down'))
            .command(MigrationCommandFactory_1.MigrationCommandFactory.create('list'))
            .command(MigrationCommandFactory_1.MigrationCommandFactory.create('pending'))
            .command(MigrationCommandFactory_1.MigrationCommandFactory.create('fresh'))
            .command(new DebugCommand_1.DebugCommand())
            .recommendCommands()
            .strict();
    }
}
exports.CLIConfigurator = CLIConfigurator;
