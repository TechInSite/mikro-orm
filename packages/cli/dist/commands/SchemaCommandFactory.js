"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaCommandFactory = void 0;
const yargs_1 = __importDefault(require("yargs"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const knex_1 = require("@mikro-orm/knex");
const CLIHelper_1 = require("../CLIHelper");
class SchemaCommandFactory {
    static create(command) {
        const successMessage = SchemaCommandFactory.SUCCESS_MESSAGES[command];
        return {
            command: `schema:${command}`,
            describe: SchemaCommandFactory.DESCRIPTIONS[command],
            builder: (args) => SchemaCommandFactory.configureSchemaCommand(args, command),
            handler: (args) => SchemaCommandFactory.handleSchemaCommand(args, command, successMessage),
        };
    }
    static configureSchemaCommand(args, command) {
        args.option('r', {
            alias: 'run',
            type: 'boolean',
            desc: 'Runs queries',
        });
        if (command !== 'fresh') {
            args.option('d', {
                alias: 'dump',
                type: 'boolean',
                desc: 'Dumps all queries to console',
            });
            args.option('fk-checks', {
                type: 'boolean',
                desc: 'Do not skip foreign key checks',
            });
        }
        if (command === 'create' || command === 'fresh') {
            args.option('seed', {
                type: 'string',
                desc: 'Allows to seed the database on create or drop and recreate',
            });
        }
        if (command === 'update') {
            args.option('safe', {
                type: 'boolean',
                desc: 'Allows to disable table and column dropping',
                default: false,
            });
            args.option('drop-tables', {
                type: 'boolean',
                desc: 'Allows to disable table dropping',
                default: true,
            });
        }
        if (command === 'drop') {
            args.option('drop-migrations-table', {
                type: 'boolean',
                desc: 'Drop also migrations table',
            });
            args.option('drop-db', {
                type: 'boolean',
                desc: 'Drop the whole database',
            });
        }
        return args;
    }
    static async handleSchemaCommand(args, method, successMessage) {
        if (!args.run && !args.dump) {
            yargs_1.default.showHelp();
            return;
        }
        const orm = await CLIHelper_1.CLIHelper.getORM();
        const generator = new knex_1.SchemaGenerator(orm.em);
        const params = SchemaCommandFactory.getOrderedParams(args, method);
        if (args.dump) {
            const m = `get${method.substr(0, 1).toUpperCase()}${method.substr(1)}SchemaSQL`;
            const dump = await generator[m](params);
            CLIHelper_1.CLIHelper.dump(dump, orm.config);
        }
        else if (method === 'fresh') {
            await generator.dropSchema(SchemaCommandFactory.getOrderedParams(args, 'drop'));
            await generator.createSchema(SchemaCommandFactory.getOrderedParams(args, 'create'));
        }
        else {
            const m = method + 'Schema';
            await generator[m](params);
        }
        if (args.seed !== undefined) {
            const seeder = orm.getSeeder();
            await seeder.seedString(args.seed || orm.config.get('seeder').defaultSeeder);
        }
        CLIHelper_1.CLIHelper.dump(ansi_colors_1.default.green(successMessage));
        await orm.close(true);
    }
    static getOrderedParams(args, method) {
        const ret = { wrap: !args.fkChecks };
        if (method === 'update') {
            ret.safe = args.safe;
            ret.dropTables = args.dropTables;
        }
        if (method === 'drop') {
            ret.dropMigrationsTable = args.dropMigrationsTable;
            if (!args.dump) {
                ret.dropDb = args.dropDb;
            }
        }
        return ret;
    }
}
exports.SchemaCommandFactory = SchemaCommandFactory;
SchemaCommandFactory.DESCRIPTIONS = {
    create: 'Create database schema based on current metadata',
    update: 'Update database schema based on current metadata',
    drop: 'Drop database schema based on current metadata',
    fresh: 'Drop and recreate database schema based on current metadata',
};
SchemaCommandFactory.SUCCESS_MESSAGES = {
    create: 'Schema successfully created',
    update: 'Schema successfully updated',
    drop: 'Schema successfully dropped',
    fresh: 'Schema successfully dropped and recreated',
};
