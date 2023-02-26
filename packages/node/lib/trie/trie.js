"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisifyTrie = exports.StateTrie = void 0;
const merkle_patricia_tree_1 = require("merkle-patricia-tree");
const level_1 = require("level");
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs/yargs"));
// import { Account, Balance } from "@zerodao/protobuf";
const ethers_1 = __importDefault(require("ethers"));
class StateTrie {
    constructor() {
        const db = new level_1.Level((0, yargs_1.default)().argv["db-path"] || path_1.default.join(process.env.HOME, ".zeronode/config/db"));
        const trie = new merkle_patricia_tree_1.SecureTrie(db);
        this.trie = (0, exports.promisifyTrie)(trie);
    }
    async getAccount(address) {
        const accountData = await this.trie.get(Buffer.from(address));
        if (accountData) {
            const account = JSON.parse(accountData.toString());
            return account;
        }
        return null;
    }
    async setAccount(address, account) {
        account.nonce += 1;
        const accountData = Buffer.from(JSON.stringify(account));
        await this.trie.put(Buffer.from(address), accountData);
    }
    async setUnStakedBalance(accountAddress, balance, tokenAddress) {
        const account = await this.getAccount(accountAddress);
        account.unStakedBalance[tokenAddress] = balance;
        account.nonce += 1;
        await this.setAccount(accountAddress, account);
    }
    async getUnStakedBalance(accountAddress, tokenAddress) {
        const account = await this.getAccount(accountAddress);
        return account.unStakedBalance[tokenAddress];
    }
    async setStakedBalance(accountAddress, balance, tokenAddress) {
        const account = await this.getAccount(accountAddress);
        account.stakedBalance[tokenAddress] = balance;
        account.nonce += 1;
        await this.setAccount(accountAddress, account);
    }
    async getStakedBalance(accountAddress, tokenAddress) {
        const account = await this.getAccount(accountAddress);
        return account.stakedBalance[tokenAddress];
    }
    //   public async getStakeBalance(accountAddress, tokenAddress): Promise<any | null> {
    //     const hash = ethers.utils.solidityKeccak256([accountAddress], [tokenAddress])
    //     await this.trie.get(Buffer.from(hash))
    //   }
    async setReleaseBalance(accountAddress, tokenAddress, balance) {
        const balanceData = Buffer.from(JSON.stringify(balance));
        const hash = ethers_1.default.utils.solidityKeccak256([accountAddress], [tokenAddress]);
        await this.trie.put(Buffer.from(hash), balanceData);
    }
}
exports.StateTrie = StateTrie;
const promisifyTrie = (trie) => Object.getOwnPropertyNames(Object.getPrototypeOf(trie))
    .filter((v) => typeof trie[v] === "function")
    .reduce((r, fn) => {
    r[fn] = async (...args) => await new Promise((resolve, reject) => trie[fn](...args, (err, result) => err ? reject(err) : resolve(result)));
    return r;
}, {});
exports.promisifyTrie = promisifyTrie;
//# sourceMappingURL=trie.js.map