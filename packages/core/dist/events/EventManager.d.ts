import { AnyEntity, EntityMetadata } from '../typings';
import { EventArgs, EventSubscriber, FlushEventArgs, TransactionEventArgs } from './EventSubscriber';
import { EventType, TransactionEventType } from '../enums';
export declare class EventManager {
    private readonly listeners;
    private readonly entities;
    constructor(subscribers: EventSubscriber[]);
    registerSubscriber(subscriber: EventSubscriber): void;
    dispatchEvent<T extends AnyEntity<T>>(event: TransactionEventType, args: TransactionEventArgs): unknown;
    dispatchEvent<T extends AnyEntity<T>>(event: EventType.onInit, args: Partial<EventArgs<T>>): unknown;
    dispatchEvent<T extends AnyEntity<T>>(event: EventType, args: Partial<EventArgs<T> | FlushEventArgs>): Promise<unknown>;
    hasListeners<T extends AnyEntity<T>>(event: EventType, meta: EntityMetadata<T>): boolean;
    private getSubscribedEntities;
}
