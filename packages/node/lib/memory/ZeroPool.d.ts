/// <reference types="node" />
import { Transaction } from "../core/types";
export declare class Mempool {
    running: boolean;
    state: Map<string, Buffer>;
    handled: Map<string, any>;
    private _len;
    private _cleanupInterval;
    private _gossipInterval;
    private peer;
    private protocol;
    private POOL_GOSSIP_TOPIC;
    private POOL_GOSSIP_TIME;
    private MEMORY_CLEANUP_TIME;
    private MAX_POOL_SIZE;
    private MAX_MSG_BYTES;
    static init(peer: any): Mempool;
    constructor({ peer }: any);
    start(): Promise<boolean>;
    close(): Promise<void>;
    validate(tx: Buffer): Promise<void>;
    get length(): number;
    addTx(tx: Transaction): Promise<void>;
    cleanup(): Promise<void>;
    ackGossip(message: Buffer): Promise<void>;
    broadcast(): Promise<void>;
    _hashMempool(): Promise<void>;
}
