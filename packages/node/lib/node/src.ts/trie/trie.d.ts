import { SecureTrie } from "merkle-patricia-tree";
import { Account } from "@zerodao/protobuf";
export declare class StateTrie {
  trie: PromisifiedTrie;
  constructor();
  getAccount(address: string): Promise<Account | null>;
  setAccount(address: string, account: Account): Promise<void>;
}
export type PromisifiedTrie = {
  [K in keyof SecureTrie]: SecureTrie[K] extends (...args: any[]) => void
    ? (...args: Parameters<SecureTrie[K]>) => Promise<ReturnType<SecureTrie[K]>>
    : SecureTrie[K];
};
export declare const promisifyTrie: (trie: SecureTrie) => PromisifiedTrie;
