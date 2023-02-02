import { SecureTrie } from "merkle-patricia-tree";
import { Level } from "level";
import path from "path";
import yargs from "yargs/yargs";
// import { Account, Balance } from "@zerodao/protobuf";
import ethers from "ethers"
import { Account } from "../types/account";
export class StateTrie {
  trie: PromisifiedTrie;

  constructor() {
    const db = new Level(
      yargs().argv["db-path"] || path.join(process.env.HOME as string, ".zero")
    );

    const trie = new SecureTrie(db);
    this.trie = promisifyTrie(trie);
  }

  public async getAccount(address: string): Promise<any | null> {
    const accountData = await this.trie.get(Buffer.from(address));
    if (accountData) {
      const account: any = JSON.parse(accountData.toString());
      return account;
    }
    return null;
  }

  public async setAccount(address: string, account: Account): Promise<void> {
    account.nonce += 1;
    const accountData = Buffer.from(JSON.stringify(account));
    await this.trie.put(Buffer.from(address), accountData);
  }

  public async setUnStakedBalance(accountAddress, balance, tokenAddress) {
    const account: Account = await this.getAccount(accountAddress)
    account.unStakedBalance[tokenAddress] = balance;
    account.nonce += 1;
    await this.setAccount(accountAddress, account)
  }

  public async getUnStakedBalance(accountAddress, tokenAddress) {
    const account: Account = await this.getAccount(accountAddress);
    return account.unStakedBalance[tokenAddress]
  }

  public async setStakedBalance(accountAddress, balance, tokenAddress) {
    const account: Account = await this.getAccount(accountAddress)
    account.stakedBalance[tokenAddress] = balance;
    account.nonce += 1;
    await this.setAccount(accountAddress, account)
  }

  public async getStakedBalance(accountAddress, tokenAddress) {
    const account: Account = await this.getAccount(accountAddress);
    return account.stakedBalance[tokenAddress]
  }

//   public async getStakeBalance(accountAddress, tokenAddress): Promise<any | null> {
//     const hash = ethers.utils.solidityKeccak256([accountAddress], [tokenAddress])
//     await this.trie.get(Buffer.from(hash))
//   }

  public async setReleaseBalance(accountAddress: string, tokenAddress: string, balance: any): Promise<void> {
    const balanceData = Buffer.from(JSON.stringify(balance));
    const hash = ethers.utils.solidityKeccak256([accountAddress], [tokenAddress])
    await this.trie.put(Buffer.from(hash), balanceData);
  }
 }

export type PromisifiedTrie = {
  [K in keyof SecureTrie]: SecureTrie[K] extends (...args: any[]) => void
    ? (...args: Parameters<SecureTrie[K]>) => Promise<ReturnType<SecureTrie[K]>>
    : SecureTrie[K];
};

export const promisifyTrie = (trie: SecureTrie): PromisifiedTrie =>
  Object.getOwnPropertyNames(Object.getPrototypeOf(trie))
    .filter((v) => typeof trie[v] === "function")
    .reduce((r, fn) => {
      r[fn] = async (...args) =>
        await new Promise((resolve, reject) =>
          trie[fn](...args, (err, result) =>
            err ? reject(err) : resolve(result)
          )
        );
      return r;
    }, {} as PromisifiedTrie);
