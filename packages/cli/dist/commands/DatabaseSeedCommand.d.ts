import { Arguments, Argv, CommandModule } from 'yargs';
export declare class DatabaseSeedCommand<T> implements CommandModule<T, {
    class: string;
}> {
    command: string;
    describe: string;
    builder: (args: Argv) => Argv<{
        class: string;
    }>;
    /**
     * @inheritdoc
     */
    handler(args: Arguments<{
        class?: string;
    }>): Promise<void>;
}
