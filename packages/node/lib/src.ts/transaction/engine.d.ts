/// <reference types="node" />
import { StateTrie } from "../trie/trie";
import { Data } from "../core/types";
export declare class TransactionEngine {
    trie: StateTrie;
    constructor(trie: StateTrie);
    runBlock(block: Data): Promise<void>;
    runTransaction(tx: any): Promise<void>;
    validateTransaction(tx: any): Promise<void>;
}
export declare function checkTransaction(tBuf: Buffer): Promise<void>;
