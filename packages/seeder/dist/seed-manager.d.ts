import { MikroORM } from '@mikro-orm/core';
import { Seeder } from './seeder';
export declare class SeedManager {
    private orm;
    constructor(orm: MikroORM);
    refreshDatabase(): Promise<void>;
    seed(...seederClasses: {
        new (): Seeder;
    }[]): Promise<void>;
    seedString(...seederClasses: string[]): Promise<void>;
    createSeeder(seederClass: string): Promise<string>;
    private getFileName;
    private ensureMigrationsDirExists;
    private generate;
}
