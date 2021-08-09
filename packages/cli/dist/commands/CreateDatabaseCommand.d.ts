import { Arguments, CommandModule } from 'yargs';
export declare class CreateDatabaseCommand implements CommandModule {
    command: string;
    describe: string;
    /**
     * @inheritdoc
     */
    handler(args: Arguments): Promise<void>;
}
