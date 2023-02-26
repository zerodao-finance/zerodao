import { StateTrie } from "../trie/trie";
import * as bip21 from 'bip21';
import { validate } from 'bitcoin-address-validation';
import { protocol } from "@zerodao/protobuf";
import { Account } from "../types/account";
import { keccak_256 as createKeccak256 } from "@noble/hashes/sha3";
import { utils } from "ethers";
import chalk from "chalk";
import _ from "lodash";
/* Receive a block, and run its transactions on the application state, validating each transaction and using checkpoints and reverts. */

const transfer = protocol.Transfer;
const stake = protocol.Stake;
const release = protocol.Release;

export class TransactionEngine {
  trie: StateTrie;
  receipts: Array<boolean>;
  messages: Array<string>;

  constructor(trie: StateTrie) {
    this.trie = trie;
  }

  /* accepts a block as an object, runs each transaction and returns the app state root as well as the results(success or revert) and messages which need signed by FROST */
  async runBlock(block) {
    await this.trie.trie.checkpoint();
    for (const tx of block.Data.Txs) {
        const txObject: any =  tx.type == 1 ? transfer.decode(tx.data) : tx.type == 2 ? stake.decode(tx.data) : release.decode(tx.data);
        console.log(txObject);
        await this.runTransaction(txObject);
    }
    await this.trie.trie.commit();
    const results = this.receipts;
    const toSign = this.messages;
    this.receipts = [];
    this.messages = [];
    return {
      root: this.trie.trie.root,
      results: results,
      messages: toSign
    }
  }

  // Takes each transaction, validates it and carries out its changes on the state trie
  async runTransaction(tx) {
    await this.trie.trie.checkpoint();
    if (tx.type == "Transfer") {
      try {
        await this.validateTransaction(tx);
        const fromAccount: Account = (await this.trie.getAccount(
          tx.from.toString()
        )) as Account;
        fromAccount.unStakedBalance[tx.asset.toString()] -= Number(tx.amount)
        const toAccount: Account = (await this.trie.getAccount(
          tx.to.toString()
        )) as Account;
        toAccount.unStakedBalance[tx.asset.toString()] += Number(tx.amount)
        await this.trie.setAccount(tx.from.toString(), fromAccount);
        await this.trie.setAccount(tx.to.toString(), toAccount);
        this.receipts.push(true)
        await this.trie.trie.commit();
        // mark as success in the next block header
      } catch (error) {
        this.receipts.push(false)
        await this.trie.trie.revert();
        // mark as failure in the next block header
      }
    }
    if (tx.type == "Stake") {
      try {
        await this.validateTransaction(tx);
        const fromAccount: Account = (await this.trie.getAccount(
          tx.from.toString()
        )) as Account;
        fromAccount.stakedBalance[tx.asset.toString()] += Number(tx.amount)
        await this.trie.setAccount(tx.from.toString(), fromAccount);
        await this.trie.trie.commit();
        this.receipts.push(true)
        // mark as success in next block header
      } catch (error) {
        this.receipts.push(false)
        await this.trie.trie.revert();
        // mark as failure in next block header
      }
    }
    if (tx.type == "Release") {
      try {
        await this.validateTransaction(tx)
       const account: Account = await this.trie.getAccount(tx.from.toString())
       account.unStakedBalance[tx.asset.toString()] -= Number(tx.amount)
       // add bytestrings into next block header
       const pHash = keccak256(tx.data)
       this.messages.push(utils.solidityKeccak256(["string", "string", "uint64", "uint64"], [tx.destination, pHash, tx.nonce, tx.amount ]))
       this.receipts.push(true)
       await this.trie.setAccount(tx.from.toString(), account)
       await this.trie.trie.commit();
      } catch (error) {
        this.receipts.push(false)
        await this.trie.trie.revert();
      }
    }
    if (tx.type == "Burn") {
      try {
        await this.validateTransaction(tx)
      }
      catch (error){

      }
    }
  }

  // checkTx
  async checkTxSync(tBuf: Buffer) {
    let _decoded = protocol.Transaction.decode(tBuf);
    let tx = protocol.Transaction.toObject(_decoded, { longs: String, bytes: String, enums: String });
    let res = await this.validateTransaction(tx);
    if (_.isError(res)) return [null, new Error("Transaction will revert against state trie")];
    return [{ Code: 1, value: tBuf }, null];
  }

  // validates a tx, causes revert if fails
  async validateTransaction(tx) {
    console.log(chalk.red("from logger => "), tx);
    const oldFromAccount: Account = (await this.trie.getAccount(
      tx.from
    )) as Account;
    if (tx.destination && tx.chain == "BTC") {
      if (bip21.validate(tx.destination)) {
        if(tx.destination.startsWith("bc1")){
            console.log("It's a taproot address")
        } else {
            console.log("It's a bech32 address")
        }
      } else if (validate(tx.address)) {
          console.log("It's a regular BTC address");
      } else {
          throw new Error(`Invalid address: ${tx.destination}`);
      }
    }
    const fromBalance = Number(oldFromAccount.unStakedBalance[tx.asset]);
    if (fromBalance >= tx.amount) return;
    else throw Error;
  }
}

export const keccak256 = (...msg: Uint8Array[]): Uint8Array => {
  return new Uint8Array(createKeccak256(concat(msg)));
};

export const concat = (uint8Arrays: Uint8Array[]): Uint8Array => {
  const concatenated = uint8Arrays.reduce((acc, curr) => {
      acc.push(...curr);
      return acc;
  }, [] as number[]);

  return new Uint8Array(concatenated);
};
