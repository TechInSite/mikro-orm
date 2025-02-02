import { Configuration, IDatabaseDriver, MikroORM, Options } from '@mikro-orm/core';
/**
 * @internal
 */
export declare class CLIHelper {
    static getConfiguration<D extends IDatabaseDriver = IDatabaseDriver>(validate?: boolean, options?: Partial<Options>): Promise<Configuration<D>>;
    static getORM(warnWhenNoEntities?: boolean, opts?: Partial<Options>): Promise<MikroORM>;
    static getNodeVersion(): string;
    static getDriverDependencies(): Promise<string[]>;
    static dump(text: string, config?: Configuration): void;
    static getConfigPaths(): Promise<string[]>;
    static dumpDependencies(): Promise<void>;
    static getModuleVersion(name: string): Promise<string>;
    static dumpTable(options: {
        columns: string[];
        rows: string[][];
        empty: string;
    }): void;
}
