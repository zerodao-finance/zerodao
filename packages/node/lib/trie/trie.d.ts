import { SecureTrie } from "merkle-patricia-tree";
import { Account } from "../types/account";
export declare class StateTrie {
    trie: PromisifiedTrie;
    constructor();
    getAccount(address: string): Promise<any | null>;
    setAccount(address: string, account: Account): Promise<void>;
    setUnStakedBalance(accountAddress: any, balance: any, tokenAddress: any): Promise<void>;
    getUnStakedBalance(accountAddress: any, tokenAddress: any): Promise<number>;
    setStakedBalance(accountAddress: any, balance: any, tokenAddress: any): Promise<void>;
    getStakedBalance(accountAddress: any, tokenAddress: any): Promise<number>;
    setReleaseBalance(accountAddress: string, tokenAddress: string, balance: any): Promise<void>;
}
export type PromisifiedTrie = {
    [K in keyof SecureTrie]: SecureTrie[K] extends (...args: any[]) => void ? (...args: Parameters<SecureTrie[K]>) => Promise<ReturnType<SecureTrie[K]>> : SecureTrie[K];
};
export declare const promisifyTrie: (trie: SecureTrie) => PromisifiedTrie;
