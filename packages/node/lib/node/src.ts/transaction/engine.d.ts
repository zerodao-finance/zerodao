import { StateTrie } from "../trie/trie";
export declare class TransactionEngine {
  trie: StateTrie;
  constructor(trie: StateTrie);
  runBlock(txs: any): Promise<void>;
  runTransaction(tx: any): Promise<void>;
}
export declare function validateTransaction(tBuf: any): Promise<void>;
