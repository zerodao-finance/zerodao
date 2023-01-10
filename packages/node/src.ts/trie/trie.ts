import { SecureTrie } from "merkle-patricia-tree";
import { Level } from "level";
import path from "path";
import yargs from "yargs/yargs";
import { Account, Balance } from "@zerodao/protobuf";
export class StateTrie {
  trie: PromisifiedTrie;

  constructor() {
    const db = new Level(
      yargs().argv["db-path"] || path.join(process.env.HOME as string, ".zero")
    );

    const trie = new SecureTrie(db);
    this.trie = promisifyTrie(trie);
  }
  
  public async getAccount(address: string): Promise<Account | null> {
    const accountData = await this.trie.get(Buffer.from(address));
    if (accountData) {
      const account: Account = JSON.parse(accountData.toString());
      return account;
    }
    return null;
  }

  public async setAccount(address: string, account: Account): Promise<void> {
    const accountData = Buffer.from(JSON.stringify(account));
    await this.trie.put(Buffer.from(address), accountData);
  }

  public async getStakeBalance(hash: string): Promise<Balance | null> {
    const balanceData = await this.trie.get(Buffer.from(hash));
    if (balanceData) {
      const balance: Balance = JSON.parse(balanceData.toString());
      return balance;
    }
    return null;
  }

  public async setStakeBalance(hash: string, balance: Balance): Promise<void> {
    const balanceData = Buffer.from(JSON.stringify(balance));
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
