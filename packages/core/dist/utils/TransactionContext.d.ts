import { EntityManager } from '../EntityManager';
export declare class TransactionContext {
    readonly em: EntityManager;
    private static storage;
    readonly id: number;
    constructor(em: EntityManager);
    /**
     * Creates new TransactionContext instance and runs the code inside its domain.
     */
    static createAsync<T>(em: EntityManager, next: (...args: any[]) => Promise<T>): Promise<T>;
    /**
     * Returns current TransactionContext (if available).
     */
    static currentTransactionContext(): TransactionContext | undefined;
    /**
     * Returns current EntityManager (if available).
     */
    static getEntityManager(): EntityManager | undefined;
}
