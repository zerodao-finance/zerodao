/// <reference types="node" />
export type WrappedTx = {
    tx: Buffer;
    timestamp: string;
    hash: string;
    height: number;
    new (tx: any, height: any, timestamp: any): WrappedTx;
    Bytes(): number;
    Copy(): WrappedTx;
    Hash(): string;
    CheckBytes(number: any): boolean;
    toBuffer(): Buffer;
};
export declare function WrappedTx(tx: any, timestamp: any, height: any): void;
