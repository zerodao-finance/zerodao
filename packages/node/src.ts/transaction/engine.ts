import { StateTrie } from "../trie/trie";
import * as protobuf from "protobufjs";
import ethers from "ethers";
import * as bip21 from 'bip21';
import { validate } from 'bitcoin-address-validation'
// import { protocol } from "@zerodao/protobuf";
import { Account } from "../types/account";
import { Balance } from "../types/balance";
import { Block} from "../types";
import { TX } from "../types/tx";
import { keccak_256 as createKeccak256 } from "@noble/hashes/sha3";
import { utils } from "ethers"
/* Receive a block, and run its transactions on the application state, validating each transaction and using checkpoints and reverts. */

const PROTO_PATH: string =
   __dirname + "/../../../protobuf/proto/ZeroProtocol.proto";
   const root = protobuf.loadSync(PROTO_PATH);
  __dirname + "@zerodao/protobuf";
// const root = protocol;
const transfer = root.lookupType("Transfer");
const stake = root.lookupType("Stake");
const release = root.lookupType("Release")

export class TransactionEngine {
  trie: StateTrie;
  receipts: Array<boolean>;
  messages: Array<string>;
  constructor(trie: StateTrie) {
    this.trie = trie;
  }
  async runBlock(block) {
   // await this.trie.trie.checkpoint();
    for (const tx of block.Data.Txs) {
        const txObject: any =  tx.type == 1 ? transfer.decode(tx.data) : tx.type == 2 ? stake.decode(tx.data) : release.decode(tx.data);
        console.log(txObject);
        await this.runTransaction(txObject);
    }
    // await this.trie.trie.commit();
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
  async runTransaction(tx) {
    // await this.trie.trie.checkpoint();
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
        await this.trie.trie.commit();
      } catch (error) {
        this.receipts.push(false)
        await this.trie.trie.revert();
      }
    } 
  }
  async validateTransaction(tx) {
    const oldFromAccount: Account = (await this.trie.getAccount(
      tx.from
    )) as Account;
    if (tx.destination && tx.chain == "BTC") {
    if (bip21.validate(tx.destination)) {
      if(tx.destination.startsWith("bc1t")){
          console.log("It's a taproot address")
      } else {
          console.log("It's a bech32 address")
      }
  } else if (validate(tx.address)) {
      console.log("It's a regular BTC address");
  } else {
      throw new Error(`Invalid address: ${tx.destination}`);
  }}
    const fromBalance = Number(oldFromAccount.unStakedBalance[tx.asset]);
    if (fromBalance >= tx.amount) return;
    else throw Error;
  }
}

export async function checkTx(tBuf: Buffer) {
  try {
    transfer.decode(tBuf) || stake.decode(tBuf) || release.decode(tBuf);
  } catch (error) {
    throw "Transaction not a valid protobuf type";
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
