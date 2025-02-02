import { IDatabaseDriver } from '../drivers';
import { Configuration, Options } from './Configuration';
import { Dictionary } from '../typings';
/**
 * @internal
 */
export declare class ConfigurationLoader {
    static getConfiguration<D extends IDatabaseDriver = IDatabaseDriver>(validate?: boolean, options?: Partial<Options>): Promise<Configuration<D>>;
    static getPackageConfig(): Promise<Dictionary>;
    static getSettings(): Promise<Settings>;
    static getConfigPaths(): Promise<string[]>;
    static registerTsNode(configPath?: string): Promise<void>;
    static loadEnvironmentVars<D extends IDatabaseDriver>(options?: Options<D> | Configuration<D>): Partial<Options<D>>;
}
export interface Settings {
    useTsNode?: boolean;
    tsConfigPath?: string;
    configPaths?: string[];
}
