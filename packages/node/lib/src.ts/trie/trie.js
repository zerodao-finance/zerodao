"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisifyTrie = exports.StateTrie = void 0;
const merkle_patricia_tree_1 = require("merkle-patricia-tree");
const level_1 = require("level");
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs/yargs"));
class StateTrie {
    constructor() {
        const db = new level_1.Level((0, yargs_1.default)().argv["db-path"] || path_1.default.join(process.env.HOME, ".zero"));
        const trie = new merkle_patricia_tree_1.SecureTrie(db);
        this.trie = (0, exports.promisifyTrie)(trie);
    }
    getAccount(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountData = yield this.trie.get(Buffer.from(address));
            if (accountData) {
                const account = JSON.parse(accountData.toString());
                return account;
            }
            return null;
        });
    }
    setAccount(address, account) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountData = Buffer.from(JSON.stringify(account));
            yield this.trie.put(Buffer.from(address), accountData);
        });
    }
    getStakeBalance(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const balanceData = yield this.trie.get(Buffer.from(hash));
            if (balanceData) {
                const balance = JSON.parse(balanceData.toString());
                return balance;
            }
            return null;
        });
    }
    setStakeBalance(hash, balance) {
        return __awaiter(this, void 0, void 0, function* () {
            const balanceData = Buffer.from(JSON.stringify(balance));
            yield this.trie.put(Buffer.from(hash), balanceData);
        });
    }
}
exports.StateTrie = StateTrie;
const promisifyTrie = (trie) => Object.getOwnPropertyNames(Object.getPrototypeOf(trie))
    .filter((v) => typeof trie[v] === "function")
    .reduce((r, fn) => {
    r[fn] = (...args) => __awaiter(void 0, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => trie[fn](...args, (err, result) => err ? reject(err) : resolve(result)));
    });
    return r;
}, {});
exports.promisifyTrie = promisifyTrie;
//# sourceMappingURL=trie.js.map