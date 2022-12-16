import { SecureTrie } from 'merkle-patricia-tree'
import { LevelDB } from './level';

export type Account = {
    balance: number,
    nonce: Uint8Array
}
export class StateTrie {
    private trie: SecureTrie;

    constructor(leveldb: LevelDB) {
        const db = new LevelDB();
        const stateRoot = '0x.........'
        this.trie = new SecureTrie(db, Buffer.from(stateRoot.slice(2), 'hex'));
    }

    public async getAccount(address: string): Promise<Account | undefined> {
        const accountData = await this.trie.get(Buffer.from(address));
        if (accountData) {
          const account: Account = JSON.parse(accountData.toString());
          return account;
        }
        return undefined;
      }
    
      public async setAccount(address: string, account: Account): Promise<void> {
        const accountData = Buffer.from(JSON.stringify(account));
        await this.trie.put(Buffer.from(address), accountData);
      }
}
