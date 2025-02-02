import { ObjectId } from 'mongodb';
import { IPrimaryKey, Primary, Platform, NamingStrategy, Constructor, EntityRepository } from '@mikro-orm/core';
import { MongoExceptionConverter } from './MongoExceptionConverter';
export declare class MongoPlatform extends Platform {
    protected readonly exceptionConverter: MongoExceptionConverter;
    getNamingStrategy(): {
        new (): NamingStrategy;
    };
    getRepositoryClass<T>(): Constructor<EntityRepository<T>>;
    normalizePrimaryKey<T extends number | string = number | string>(data: Primary<T> | IPrimaryKey | ObjectId): T;
    denormalizePrimaryKey(data: number | string): IPrimaryKey;
    getSerializedPrimaryKeyField(field: string): string;
    usesDifferentSerializedPrimaryKey(): boolean;
    usesImplicitTransactions(): boolean;
    convertsJsonAutomatically(marshall?: boolean): boolean;
    marshallArray(values: string[]): string;
    cloneEmbeddable<T>(data: T): T;
}
