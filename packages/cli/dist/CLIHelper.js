"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIHelper = void 0;
const fs_extra_1 = require("fs-extra");
const cli_table3_1 = __importDefault(require("cli-table3"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const core_1 = require("@mikro-orm/core");
/**
 * @internal
 */
class CLIHelper {
    static async getConfiguration(validate = true, options = {}) {
        return core_1.ConfigurationLoader.getConfiguration(validate, options);
    }
    static async getORM(warnWhenNoEntities, opts = {}) {
        const options = await CLIHelper.getConfiguration(warnWhenNoEntities, opts);
        const settings = await core_1.ConfigurationLoader.getSettings();
        options.getLogger().setDebugMode(false);
        if (settings.useTsNode) {
            options.set('tsNode', true);
        }
        if (core_1.Utils.isDefined(warnWhenNoEntities)) {
            options.get('discovery').warnWhenNoEntities = warnWhenNoEntities;
        }
        return core_1.MikroORM.init(options);
    }
    static getNodeVersion() {
        return process.versions.node;
    }
    static async getDriverDependencies() {
        try {
            const config = await CLIHelper.getConfiguration();
            return config.getDriver().getDependencies();
        }
        catch (_a) {
            return [];
        }
    }
    static dump(text, config) {
        if (config === null || config === void 0 ? void 0 : config.get('highlighter')) {
            text = config.get('highlighter').highlight(text);
        }
        // eslint-disable-next-line no-console
        console.log(text);
    }
    static async getConfigPaths() {
        return core_1.ConfigurationLoader.getConfigPaths();
    }
    static async dumpDependencies() {
        CLIHelper.dump(' - dependencies:');
        CLIHelper.dump(`   - mikro-orm ${ansi_colors_1.default.green(core_1.Utils.getORMVersion())}`);
        CLIHelper.dump(`   - node ${ansi_colors_1.default.green(CLIHelper.getNodeVersion())}`);
        if (await fs_extra_1.pathExists(process.cwd() + '/package.json')) {
            const drivers = await CLIHelper.getDriverDependencies();
            for (const driver of drivers) {
                CLIHelper.dump(`   - ${driver} ${await CLIHelper.getModuleVersion(driver)}`);
            }
            CLIHelper.dump(`   - typescript ${await CLIHelper.getModuleVersion('typescript')}`);
            CLIHelper.dump(' - package.json ' + ansi_colors_1.default.green('found'));
        }
        else {
            CLIHelper.dump(' - package.json ' + ansi_colors_1.default.red('not found'));
        }
    }
    static async getModuleVersion(name) {
        try {
            const pkg = core_1.Utils.requireFrom(`${name}/package.json`, process.cwd());
            return ansi_colors_1.default.green(pkg.version);
        }
        catch (_a) {
            return ansi_colors_1.default.red('not-found');
        }
    }
    static dumpTable(options) {
        if (options.rows.length === 0) {
            return CLIHelper.dump(options.empty);
        }
        const table = new cli_table3_1.default({ head: options.columns, style: { compact: true } });
        table.push(...options.rows);
        CLIHelper.dump(table.toString());
    }
}
exports.CLIHelper = CLIHelper;
