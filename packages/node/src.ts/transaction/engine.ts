import { StateTrie } from "../trie/trie";
import * as protobuf from "protobufjs";
import ethers from "ethers";
import { Account, Balance } from "@zerodao/protobuf";

const PROTO_PATH: string =
  __dirname + "/../../../protobuf/proto/ZeroProtocol.proto";
const root = protobuf.loadSync(PROTO_PATH);
const transaction = root.lookupType("Transaction");
const stake = root.lookupType("Stake");
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
    this.trie.trie.checkpoint();
    if (tx.type == "Transfer") {
      try {
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
    if (tx.type == "Stake") {
      try {
        const oldBalance = await this.trie.getStakeBalance(
          ethers.utils.solidityKeccak256(["address"], [tx.address])
        );
        const newBalance: Balance = {
          ...oldBalance,
          balance: oldBalance.balance + tx.amount,
        };
        await this.trie.setStakeBalance(
          ethers.utils.solidityKeccak256(["address"], [tx.address]),
          newBalance
        );
        await this.trie.trie.commit();
      } catch (error) {
        await this.trie.trie.revert();
      }
    }
  }
  async validateTransaction(tx) {
    const hash: string = ethers.utils.keccak256(tx);
    const address = ethers.utils.recoverAddress(hash, tx.signature);
    const oldFromAccount: Account = (await this.trie.getAccount(
      tx.from
    )) as Account;
    const fromBalance = Number(oldFromAccount.balance);
    if (fromBalance >= tx.amount) return;
    else throw Error;
  }
}

export async function checkTransaction(tBuf: Buffer) {
  try {
    transaction.decode(tBuf) || stake.decode(tBuf);
  } catch (error) {
    throw error;
  }
}
