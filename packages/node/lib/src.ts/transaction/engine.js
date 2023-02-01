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
exports.checkTransaction = exports.TransactionEngine = void 0;
const ethers_1 = __importDefault(require("ethers"));
const PROTO_PATH = __dirname + "@zerodao/protobuf";
const root = protocol;
const transaction = root.lookupType("Transaction");
const stake = root.lookupType("Stake");
class TransactionEngine {
    constructor(trie) {
        this.trie = trie;
    }
    runBlock(block) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const txs of block.Txs) {
                for (const tx of txs) {
                    const txObject = transaction.decode(tx);
                    yield this.runTransaction(txObject);
                }
            }
        });
    }
    runTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.trie.trie.checkpoint();
            if (tx.type == "Transfer") {
                try {
                    yield this.validateTransaction(tx);
                    const oldFromAccount = (yield this.trie.getAccount(tx.from));
                    const fromBalance = Number(oldFromAccount.unStakedBalance) - Number(tx.amount);
                    const newFromAccount = Object.assign(Object.assign({}, oldFromAccount), { address: tx.from, unStakedBalance: fromBalance });
                    const oldToAccount = (yield this.trie.getAccount(tx.to));
                    const toBalance = Number(oldToAccount.unStakedBalance) + Number(tx.amount);
                    const newToAccount = Object.assign(Object.assign({}, oldToAccount), { address: tx.to, unStakedBalance: toBalance });
                    yield this.trie.setAccount(tx.from, newFromAccount /* new account */);
                    yield this.trie.setAccount(tx.to, newToAccount);
                    yield this.trie.trie.commit();
                }
                catch (error) {
                    yield this.trie.trie.revert();
                }
            }
            else {
                try {
                    yield this.validateTransaction(tx);
                    const oldFromAccount = (yield this.trie.getAccount(tx.from));
                    const fromBalance = Number(oldFromAccount.unStakedBalance) - Number(tx.amount);
                    const fromStakedBalance = Number(oldFromAccount.stakedBalance) + Number(tx.amount);
                    const newFromAccount = Object.assign(Object.assign({}, oldFromAccount), { unStakedBalance: fromBalance, stakedBalance: fromStakedBalance });
                    const oldBalance = yield this.trie.getStakeBalance(ethers_1.default.utils.solidityKeccak256(["address"], [tx.tokenAddress]));
                    const newBalance = Object.assign(Object.assign({}, oldBalance), { balance: oldBalance.balance + tx.amount });
                    yield this.trie.setAccount(tx.from, newFromAccount);
                    yield this.trie.setStakeBalance(ethers_1.default.utils.solidityKeccak256(["address"], [tx.tokenAddress]), newBalance);
                    yield this.trie.trie.commit();
                }
                catch (error) {
                    yield this.trie.trie.revert();
                }
            }
            /* if (tx.type == "Release") {
              try {
                await this.validateTransaction(tx)
                const oldFromAccount: Account = (await this.trie.getAccount(
                  tx.from
                )) as Account;
                const fromBalance = Number(oldFromAccount.unStakedBalance) - Number(tx.amount);
                const fromStakedBalance = Number(oldFromAccount.stakedBalance) + Number(tx.amount);
                const newFromAccount: Account = {
                  ...oldFromAccount,
                  unStakedBalance: fromBalance,
                  stakedBalance: fromStakedBalance
                };
                const oldBalance = await this.trie.getStakeBalance(
                  ethers.utils.solidityKeccak256(["address"], [tx.address])
                );
                const newBalance: Balance = {
                  ...oldBalance,
                  balance: oldBalance.balance + tx.amount,
                };
                await this.trie.setAccount(tx.from, newFromAccount)
                await this.trie.setStakeBalance(
                  ethers.utils.solidityKeccak256(["address"], [tx.address]),
                  newBalance
                );
                await this.trie.trie.commit();
              } catch (error) {
                await this.trie.trie.revert();
              }
            } */
        });
    }
    validateTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = ethers_1.default.utils.keccak256(tx);
            const address = ethers_1.default.utils.recoverAddress(hash, tx.signature);
            const oldFromAccount = (yield this.trie.getAccount(tx.from));
            const fromBalance = Number(oldFromAccount.unStakedBalance);
            if (fromBalance >= tx.amount)
                return;
            else
                throw Error;
        });
    }
}
exports.TransactionEngine = TransactionEngine;
function checkTransaction(tBuf) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            transaction.decode(tBuf) || stake.decode(tBuf);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.checkTransaction = checkTransaction;
//# sourceMappingURL=engine.js.map