"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSeederCommand = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const CLIHelper_1 = require("../CLIHelper");
class CreateSeederCommand {
    constructor() {
        this.command = 'seeder:create <seeder>';
        this.describe = 'Create a new seeder class';
        this.builder = (args) => {
            args.positional('seeder', {
                describe: 'Seeder class to create (use PascalCase and end with `Seeder` e.g. DatabaseSeeder)',
            });
            args.demandOption('seeder');
            return args;
        };
    }
    /**
     * @inheritdoc
     */
    async handler(args) {
        const orm = await CLIHelper_1.CLIHelper.getORM(undefined);
        const seeder = orm.getSeeder();
        const path = await seeder.createSeeder(args.seeder);
        CLIHelper_1.CLIHelper.dump(ansi_colors_1.default.green(`Seeder ${args.seeder} successfully created at ${path}`));
        await orm.close(true);
    }
}
exports.CreateSeederCommand = CreateSeederCommand;
