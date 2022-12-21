/// <reference types="node" />
import { Minisketch } from "libminisketch-wasm";
import { Transaction } from "../core/types";
export interface MempoolConfig {
    _len: number;
    _cleanupInterval: any;
    _gossipInterval: any;
    peer: any;
    protocol: any;
    sketch: Minisketch;
    POOL_GOSSIP_TIME: number;
    MAX_POOL_SIZE: number;
    MAX_MSG_BYTES: number;
    POOL_STORAGE_TIME_LIMIT: number;
    POOL_GOSSIP_TOPIC: string;
}
export declare class Mempool {
    running: boolean;
    state: Map<string, Buffer>;
    handled: Map<string, any>;
    private _len;
    private _cleanupInterval;
    private _gossipInterval;
    private peer;
    private protocol;
    private sketch;
    private POOL_GOSSIP_TOPIC;
    private POOL_GOSSIP_TIME;
    private MEMORY_CLEANUP_TIME;
    private MAX_POOL_SIZE;
    private MAX_MSG_BYTES;
    private POOL_STORAGE_TIME_LIMIT;
    static init(config: Partial<MempoolConfig>): Promise<Mempool>;
    constructor(config?: Partial<MempoolConfig>);
    start(): Promise<boolean>;
    close(): Promise<void>;
    validate(tx: Buffer): Promise<void>;
    get length(): number;
    addTransaction(tx: Transaction): Promise<void>;
    cleanup(): Promise<void>;
    ackGossip(message: Buffer): Promise<void>;
    broadcast(): Promise<void>;
    _hashMempool(): Promise<any>;
}
