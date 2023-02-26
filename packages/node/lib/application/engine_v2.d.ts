import { StateTrie } from '../trie/trie';
export type TransactionEngine = {
    trie: StateTrie;
    receipts: Array<boolean>;
    messages: Array<string>;
    new (trie: StateTrie): TransactionEngine;
};
export declare function TransactionEngine(trie: StateTrie): void;
