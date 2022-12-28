import { StateTrie } from "../trie/trie";
import * as protobuf from "protobufjs";
import ethers from "ethers";
import { Account } from "@zerodao/protobuf";

const PROTO_PATH: string =
  __dirname + "@zerodao/protobuf/proto/ZeroProtocol.proto";
const root = protobuf.loadSync(PROTO_PATH);
const transaction = root.lookupType("Transaction");
export class TransactionEngine {
  Trie: StateTrie;
  constructor(trie: StateTrie) {
    this.Trie = trie;
  }
  async runBlock(txs) {
    for (const tx of txs) {
      this.runTransaction(tx);
    }
  }
  async runTransaction(tx) {
    try {
      this.Trie.trie.checkpoint();
      const oldFromAccount: Account = await this.Trie.getAccount(tx.from);
      const fromBalance = Number(oldFromAccount.balance) - Number(tx.amount);
      const newFromAccount: Account = {
        ...oldFromAccount,
        address: tx.from,
        balance: fromBalance,
      };
      const oldToAccount: Account = await this.Trie.getAccount(tx.to);
      const toBalance = Number(oldToAccount.balance) + Number(tx.amount);
      const newToAccount: Account = {
        ...oldToAccount,
        address: tx.to,
        balance: toBalance,
      };

      await this.Trie.setAccount(tx.from, newFromAccount /* new account */);
      await this.Trie.setAccount(tx.to, newToAccount);
      await this.Trie.trie.commit();
    } catch (error) {
      await this.Trie.trie.revert();
    }
  }
}

export async function validateTransaction(tBuf) {
  try {
    const tx: any = transaction.decode(tBuf);
    const hash: string = ethers.utils.keccak256(tx);
    ethers.utils.recoverAddress(hash, tx.signature);
    this.runTransaction(tx);
  } catch (error) {
    throw error;
  }
}
