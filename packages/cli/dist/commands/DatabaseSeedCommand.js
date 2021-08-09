"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeedCommand = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const CLIHelper_1 = require("../CLIHelper");
class DatabaseSeedCommand {
    constructor() {
        this.command = 'seeder:run';
        this.describe = 'Seed the database using the seeder class';
        this.builder = (args) => {
            args.option('c', {
                alias: 'class',
                type: 'string',
                desc: 'Seeder class to run',
            });
            return args;
        };
    }
    /**
     * @inheritdoc
     */
    async handler(args) {
        const orm = await CLIHelper_1.CLIHelper.getORM(undefined);
        const seeder = orm.getSeeder();
        const seederClass = args.class || orm.config.get('seeder').defaultSeeder;
        await seeder.seedString(seederClass);
        CLIHelper_1.CLIHelper.dump(ansi_colors_1.default.green(`Seeder ${seederClass} successfully seeded`));
        await orm.close(true);
    }
}
exports.DatabaseSeedCommand = DatabaseSeedCommand;
