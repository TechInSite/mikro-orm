import yargs, { Arguments, Argv, CommandModule } from 'yargs';
export declare class SchemaCommandFactory {
    static readonly DESCRIPTIONS: {
        create: string;
        update: string;
        drop: string;
        fresh: string;
    };
    static readonly SUCCESS_MESSAGES: {
        create: string;
        update: string;
        drop: string;
        fresh: string;
    };
    static create<U extends Options = Options>(command: SchemaMethod): CommandModule<unknown, U> & {
        builder: (args: Argv) => Argv<U>;
        handler: (args: Arguments<U>) => Promise<void>;
    };
    static configureSchemaCommand(args: Argv, command: SchemaMethod): yargs.Argv<{}>;
    static handleSchemaCommand(args: Arguments<Options>, method: SchemaMethod, successMessage: string): Promise<void>;
    private static getOrderedParams;
}
declare type SchemaMethod = 'create' | 'update' | 'drop' | 'fresh';
export declare type Options = {
    dump: boolean;
    run: boolean;
    fkChecks: boolean;
    dropMigrationsTable: boolean;
    dropDb: boolean;
    dropTables: boolean;
    safe: boolean;
    seed: string;
};
export {};
