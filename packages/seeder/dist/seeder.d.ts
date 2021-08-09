import { EntityManager } from '@mikro-orm/core';
export declare abstract class Seeder {
    abstract run(em: EntityManager): Promise<void>;
    protected call(em: EntityManager, seeders: {
        new (): Seeder;
    }[]): Promise<void>;
}
