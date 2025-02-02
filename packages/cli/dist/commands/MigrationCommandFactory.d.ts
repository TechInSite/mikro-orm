import { Arguments, Argv, CommandModule } from 'yargs';
export declare class MigrationCommandFactory {
    static readonly DESCRIPTIONS: {
        create: string;
        up: string;
        down: string;
        list: string;
        pending: string;
        fresh: string;
    };
    static create<U extends Options = Options>(command: MigratorMethod): CommandModule<unknown, U> & {
        builder: (args: Argv) => Argv<U>;
        handler: (args: Arguments<U>) => Promise<void>;
    };
    static configureMigrationCommand(args: Argv, method: MigratorMethod): Argv<{}>;
    private static configureUpDownCommand;
    private static configureCreateCommand;
    static handleMigrationCommand(args: Arguments<Options>, method: MigratorMethod): Promise<void>;
    private static configureFreshCommand;
    private static handleUpDownCommand;
    private static handlePendingCommand;
    private static handleListCommand;
    private static handleCreateCommand;
    private static handleFreshCommand;
    private static getUpDownOptions;
    private static getUpDownSuccessMessage;
}
declare type MigratorMethod = 'create' | 'up' | 'down' | 'list' | 'pending' | 'fresh';
declare type CliUpDownOptions = {
    to?: string | number;
    from?: string | number;
    only?: string;
};
declare type GenerateOptions = {
    dump?: boolean;
    blank?: boolean;
    initial?: boolean;
    path?: string;
    disableFkChecks?: boolean;
    seed: string;
};
declare type Options = GenerateOptions & CliUpDownOptions;
export {};
