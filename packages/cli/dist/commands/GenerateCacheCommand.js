"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCacheCommand = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const core_1 = require("@mikro-orm/core");
const CLIHelper_1 = require("../CLIHelper");
class GenerateCacheCommand {
    constructor() {
        this.command = 'cache:generate';
        this.describe = 'Generate metadata cache for production';
    }
    /**
     * @inheritDoc
     */
    async handler(args) {
        const config = await CLIHelper_1.CLIHelper.getConfiguration(false);
        if (!config.get('cache').enabled) {
            return CLIHelper_1.CLIHelper.dump(ansi_colors_1.default.red('Metadata cache is disabled in your configuration. Set cache.enabled to true to use this command.'));
        }
        config.set('logger', CLIHelper_1.CLIHelper.dump.bind(null));
        config.set('debug', true);
        const discovery = new core_1.MetadataDiscovery(core_1.MetadataStorage.init(), config.getDriver().getPlatform(), config);
        await discovery.discover(false);
        CLIHelper_1.CLIHelper.dump(ansi_colors_1.default.green('Metadata cache was successfully generated'));
    }
}
exports.GenerateCacheCommand = GenerateCacheCommand;
