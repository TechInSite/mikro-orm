import { Arguments, CommandModule } from 'yargs';
export declare class GenerateCacheCommand implements CommandModule {
    command: string;
    describe: string;
    /**
     * @inheritDoc
     */
    handler(args: Arguments): Promise<void>;
}
