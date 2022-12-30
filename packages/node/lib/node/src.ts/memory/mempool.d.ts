/// <reference types="node" />
import { Sketch } from "./sketch";
export interface MempoolConfig {
    _len: number;
    _cleanupInterval: any;
    _gossipInterval: any;
    peer: any;
    protocol: any;
    sketch: Sketch;
    POOL_GOSSIP_TIME: number;
    MAX_POOL_SIZE: number;
    MAX_MSG_BYTES: number;
    POOL_STORAGE_TIME_LIMIT: number;
    POOL_GOSSIP_TOPIC: string;
}
export interface MempoolMessage {
    messageType: "SKETCH" | "MEMORY" | "TX";
    data: Buffer & Buffer[];
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
    validate(tx: Buffer): Promise<void>;
    get length(): number;
    addTransaction(tx: Buffer): Promise<void>;
    cleanup(): void;
    synchronize(serializedSketch: Buffer): Promise<{
        missing: string[];
        found: string[];
        rebuild: boolean;
    }>;
    resetMempool(mempool: Buffer[]): Promise<void>;
    handlers: {
        SKETCH: (serializedSketch: Buffer) => Promise<{
            missing: string[];
            found: string[];
            rebuild: boolean;
        }>;
        TX: (tx: Buffer) => Promise<void>;
        MEMORY: (mempool: Buffer[]) => Promise<void>;
    };
    handleBroadcast(msg: MempoolMessage): Promise<void>;
    broadcastValues(): Promise<any>;
    _hashMempool(): Buffer;
}
