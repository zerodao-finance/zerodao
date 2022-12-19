import { forEach } from "lodash";
import { PromisifiedTrie } from "../trie/trie";
import * as protobuf from 'protobufjs';
import ethers from 'ethers'
import { text } from "stream/consumers";

// Load the .proto file that defines the message type

const PROTO_PATH: string = __dirname + "/../../../protobuf/proto/ZeroProtocol.proto";
const root = protobuf.loadSync(PROTO_PATH);

export class Transaction {
  Trie: PromisifiedTrie;
  constructor(trie: PromisifiedTrie) {
    this.Trie = trie;
  }
  async runBlock(txs) {
    for (const tx of txs) {
      this.runTransaction(tx)
    }
  }

  async runTransaction(tx) {
    this.Trie.checkpoint();
    // execute tx on state
    try {
      this.Trie.put(tx.address, tx.account /* new account */)
      this.Trie.commit()
    }
    catch (error) {
      this.Trie.revert()
    }
  }

  async validateTransaction(tBuf) {
    // Get the message type from the root object
    const transactionType = root.lookupType('Transaction');
    try {
     const tx: any = transactionType.decode(tBuf)
     const hash: string = ethers.utils.keccak256(tx)
     ethers.utils.recoverAddress(hash, tx.signature)
     this.runTransaction(tx)
    }
    catch (error) {
      throw error
    }

    // check tx signature
    // check tx type
    // check if byte array decodes
  }
}
