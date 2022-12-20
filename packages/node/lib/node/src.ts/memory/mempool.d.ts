/// <reference types="node" />
export interface MempoolConfig {
    protocol: any;
    MAX_BLOCK_SIZE: number;
    MAX_MSG_BYTES: number;
}
export declare class Mempool {
    state: Map<string, Buffer>;
    handled: Map<string, any>;
    private protocol;
    private MAX_BLOCK_SIZE;
    private MAX_MSG_BYTES;
    static init(config: Partial<MempoolConfig>): Mempool;
    constructor(config?: Partial<MempoolConfig>);
    get length(): number;
    addTransaction(tx: any): Promise<void>;
    reapMaxBytes(): Promise<void>;
    merge(_message: Buffer): void;
    resolve(_message: Buffer): void;
    _xor(subset: Map<string, Buffer>): void;
    _xnot(subset: Map<string, Buffer>): void;
    _validate(tx: Buffer): void;
}
