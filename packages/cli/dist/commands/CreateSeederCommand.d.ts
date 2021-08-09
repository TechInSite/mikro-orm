import { Arguments, Argv, CommandModule } from 'yargs';
export declare class CreateSeederCommand<T> implements CommandModule<T, {
    seeder: string;
}> {
    command: string;
    describe: string;
    builder: (args: Argv) => Argv<{
        seeder: string;
    }>;
    /**
     * @inheritdoc
     */
    handler(args: Arguments<{
        seeder: string;
    }>): Promise<void>;
}
