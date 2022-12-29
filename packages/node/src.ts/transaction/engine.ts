import { StateTrie } from "../trie/trie";
import * as protobuf from "protobufjs";
import ethers from "ethers";
import { Account } from "@zerodao/protobuf";

const PROTO_PATH: string =
  __dirname + "/../../../protobuf/proto/ZeroProtocol.proto";
const root = protobuf.loadSync(PROTO_PATH);
const transaction = root.lookupType("Transaction");

export class TransactionEngine {
  trie: StateTrie;
  constructor(trie: StateTrie) {
    this.trie = trie;
  }
  async runBlock(txs) {
    for (const tx of txs) {
      this.runTransaction(tx);
    }
  }
  async runTransaction(tx) {
    try {
      this.trie.trie.checkpoint();
      const oldFromAccount: Account = (await this.trie.getAccount(
        tx.from
      )) as Account;
      const fromBalance = Number(oldFromAccount.balance) - Number(tx.amount);
      const newFromAccount: Account = {
        ...oldFromAccount,
        address: tx.from,
        balance: fromBalance,
      };
      const oldToAccount: Account = (await this.trie.getAccount(
        tx.to
      )) as Account;
      const toBalance = Number(oldToAccount.balance) + Number(tx.amount);
      const newToAccount: Account = {
        ...oldToAccount,
        address: tx.to,
        balance: toBalance,
      };

      await this.trie.setAccount(tx.from, newFromAccount /* new account */);
      await this.trie.setAccount(tx.to, newToAccount);
      await this.trie.trie.commit();
    } catch (error) {
      await this.trie.trie.revert();
    }
  }
}

export async function validateTransaction(tBuf) {
  try {
    const tx: any = transaction.decode(tBuf);
    const hash: string = ethers.utils.keccak256(tx);
    ethers.utils.recoverAddress(hash, tx.signature);
  } catch (error) {
    throw error;
  }
}
