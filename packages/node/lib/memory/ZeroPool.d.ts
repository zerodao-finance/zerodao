/// <reference types="node" />
type Transaction = {
    tx: any;
    hash: any;
};
type HandledTransaction = {
    tx: Transaction;
    timestamp: number;
    hash: string;
    error?: Error | string;
};
export declare class ZeroPool {
    running: boolean;
    txPool: Map<string, Transaction>;
    handled: Map<String, HandledTransaction>;
    private _len;
    private _cleanupInterval;
    private _gossipInterval;
    private config;
    private buffer;
    private peer;
    static init(config: any, peer: any, buffer: any): ZeroPool;
    constructor({ config, peer, buffer }: any);
    start(): boolean;
    get length(): number;
    close(): Promise<void>;
    getPoolHashes(): any;
    getPoolState(): any;
    getHandledHashes(): String[];
    getHandledLogs(): HandledTransaction[];
    addTx(tx: any): Promise<void>;
    handleGossip(txs: Buffer): Promise<void>;
    gossipToPeers(): Promise<void>;
    validateTx(tx: any): Promise<void>;
    cleanup(): void;
    getThash(): string;
}
export {};
