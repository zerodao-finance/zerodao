/// <reference types="node" />
import { WrappedTx } from "./tx";
import { MempoolConfig } from "./types";
export type Mempool = {
    txs: Map<string, WrappedTx>;
    cache: typeof Set;
    height: number;
    config: MempoolConfig;
    proxy: any;
    sketch: any;
    new (height: number, proxyApp: any, config: MempoolConfig): Mempool;
    length(): number;
    flushPool(): void;
    deleteByHash(hash: string): void;
    reapMax(max?: number): Buffer[];
    checkTx(tx: Buffer): Error | void;
    addTx(wtx: WrappedTx, checkResponse: any): void;
    serialize(): Buffer;
    resolveSketch(sketch: Buffer): any;
    merge(pool: Buffer): void;
};
export declare function Mempool(height: any, proxyApp: any, config: any): void;
