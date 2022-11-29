/// <reference types="node" />
export interface ZeroPoolConfig {
    TOPIC: string;
    POOL_STORAGE_TIME_LIMIT: number;
    POOL_GOSSIP_TIME_LIMIT: number;
    PEER_GOSSIP_TOPIC: string;
}
declare type Transaction = {
    tx: any;
    hash: any;
};
declare type HandledTransaction = {
    tx: Transaction;
    timestamp: number;
    hash: string;
    error?: Error | string;
};
export declare class ZeroPool {
    running: boolean;
    txPool: Map<string, Transaction>;
    handled: Map<string, HandledTransaction>;
    private _len;
    private _cleanupInterval;
    private _gossipInterval;
    private config;
    private buffer;
    private peer;
    static init(config: ZeroPoolConfig, peer: any, buffer: any): ZeroPool;
    constructor({ config, peer, buffer }: any);
    start(): Promise<boolean>;
    get length(): number;
    close(): Promise<void>;
    getPoolHashes(): any;
    getPoolState(): any;
    getHandledHashes(): string[];
    getHandledLogs(): HandledTransaction[];
    addTx(tx: any): Promise<void>;
    handleGossip(txs: Buffer): Promise<void>;
    gossipToPeers(): Promise<void>;
    validateTx(tx: any): Promise<void>;
    cleanup(): void;
    getThash(): string;
}
export {};
