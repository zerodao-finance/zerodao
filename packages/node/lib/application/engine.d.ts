/// <reference types="node" />
import { StateTrie } from "../trie/trie";
export declare class TransactionEngine {
    trie: StateTrie;
    receipts: Array<boolean>;
    messages: Array<string>;
    constructor(trie: StateTrie);
    runBlock(block: any): Promise<{
        root: Buffer;
        results: boolean[];
        messages: string[];
    }>;
    runTransaction(tx: any): Promise<void>;
    checkTxSync(tBuf: Buffer): Promise<Error[] | {
        Code: number;
        value: Buffer;
    }[]>;
    validateTransaction(tx: any): Promise<void>;
}
export declare const keccak256: (...msg: Uint8Array[]) => Uint8Array;
export declare const concat: (uint8Arrays: Uint8Array[]) => Uint8Array;
