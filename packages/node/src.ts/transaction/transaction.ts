import { forEach } from "lodash";
import { SecureTrie } from "merkle-patricia-tree";

export class Transaction {
  Trie: SecureTrie;
  constructor(trie: SecureTrie) {
    this.Trie = trie;
  }
  async runBlock(txs) {}

  async runTransaction(tx) {
    this.Trie.commit();
    // execute tx
  }

  async validateTransaction(tx) {
    // check tx signature
    // check tx type
    // check if byte array decodes
  }
}
