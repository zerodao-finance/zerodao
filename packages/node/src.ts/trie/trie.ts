import { SecureTrie } from "merkle-patricia-tree";
import { Level } from "level";
import path from "path";
import yargs from "yargs/yargs";
export type Account = {
  balance: number;
  nonce: Uint8Array;
};
export class StateTrie {
  private trie: SecureTrie;

  constructor() {
    const db = new Level(
      yargs().argv["db-path"] || path.join(process.env.HOME as string, ".zero")
    );

    this.trie = new SecureTrie(db);

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
  async promisify() {
    return (await promisifyTrie(this.trie)).get()
  }
}

export const promisifyTrie = (trie) => ({
  async get(...args) {
    return await new Promise((resolve, reject) =>
      trie.get(...args, (err, result) => (err ? reject(err) : resolve(result)))
    );
  },
});
