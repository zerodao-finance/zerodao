import { StateTrie } from "../trie/trie";
import * as protobuf from "protobufjs";
import ethers from "ethers";
import { Account, Balance, Transaction, Stake } from "@zerodao/protobuf";
import { Data } from "../core/types"
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
  async runBlock(block: Data) {
    for (const txs of block.Txs) {
      for (const tx of txs) {
      const txObject: any = transaction.decode(tx)
      await this.runTransaction(txObject);
      }
    }
  }
  async runTransaction(tx) {
    await this.trie.trie.checkpoint();
    if (tx.type == "Transfer") {
      try {
        await this.validateTransaction(tx)
        const oldFromAccount: Account = (await this.trie.getAccount(
          tx.from
        )) as Account;
        const fromBalance = Number(oldFromAccount.unStakedBalance) - Number(tx.amount);
        const newFromAccount: Account = {
          ...oldFromAccount,
          address: tx.from,
          unStakedBalance: fromBalance,
        };
        const oldToAccount: Account = (await this.trie.getAccount(
          tx.to
        )) as Account;
        const toBalance = Number(oldToAccount.unStakedBalance) + Number(tx.amount);
        const newToAccount: Account = {
          ...oldToAccount,
          address: tx.to,
          unStakedBalance: toBalance,
        };

        await this.trie.setAccount(tx.from, newFromAccount /* new account */);
        await this.trie.setAccount(tx.to, newToAccount);
        await this.trie.trie.commit();
      } catch (error) {
        await this.trie.trie.revert();
      }
    }
    else {
      try {
        await this.validateTransaction(tx)
        const oldFromAccount: Account = (await this.trie.getAccount(
          tx.from
        )) as Account;
        const fromBalance = Number(oldFromAccount.unStakedBalance) - Number(tx.amount);
        const fromStakedBalance = Number(oldFromAccount.stakedBalance) + Number(tx.amount);
        const newFromAccount: Account = {
          ...oldFromAccount,
          unStakedBalance: fromBalance,
          stakedBalance: fromStakedBalance
        };
        const oldBalance = await this.trie.getStakeBalance(
          ethers.utils.solidityKeccak256(["address"], [tx.tokenAddress])
        );
        const newBalance: Balance = {
          ...oldBalance,
          balance: oldBalance.balance + tx.amount,
        };
        await this.trie.setAccount(tx.from, newFromAccount)
        await this.trie.setStakeBalance(
          ethers.utils.solidityKeccak256(["address"], [tx.tokenAddress]),
          newBalance
        );
        await this.trie.trie.commit();
      } catch (error) {
        await this.trie.trie.revert();
      }
    }
    /* if (tx.type == "Release") {
      try {
        await this.validateTransaction(tx)
        const oldFromAccount: Account = (await this.trie.getAccount(
          tx.from
        )) as Account;
        const fromBalance = Number(oldFromAccount.unStakedBalance) - Number(tx.amount);
        const fromStakedBalance = Number(oldFromAccount.stakedBalance) + Number(tx.amount);
        const newFromAccount: Account = {
          ...oldFromAccount,
          unStakedBalance: fromBalance,
          stakedBalance: fromStakedBalance
        };
        const oldBalance = await this.trie.getStakeBalance(
          ethers.utils.solidityKeccak256(["address"], [tx.address])
        );
        const newBalance: Balance = {
          ...oldBalance,
          balance: oldBalance.balance + tx.amount,
        };
        await this.trie.setAccount(tx.from, newFromAccount)
        await this.trie.setStakeBalance(
          ethers.utils.solidityKeccak256(["address"], [tx.address]),
          newBalance
        );
        await this.trie.trie.commit();
      } catch (error) {
        await this.trie.trie.revert();
      }
    } */
  }
  async validateTransaction(tx) {
    const hash: string = ethers.utils.keccak256(tx);
    const address = ethers.utils.recoverAddress(hash, tx.signature);
    const oldFromAccount: Account = (await this.trie.getAccount(
      tx.from
    )) as Account;
    const fromBalance = Number(oldFromAccount.unStakedBalance);
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
