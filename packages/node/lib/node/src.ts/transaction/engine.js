"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.validateTransaction = exports.TransactionEngine = void 0;
const protobuf = __importStar(require("protobufjs"));
const ethers_1 = __importDefault(require("ethers"));
const PROTO_PATH = __dirname + "/../../../protobuf/proto/ZeroProtocol.proto";
const root = protobuf.loadSync(PROTO_PATH);
const transaction = root.lookupType("Transaction");
class TransactionEngine {
    constructor(trie) {
        this.Trie = trie;
    }
    runBlock(txs) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const tx of txs) {
                this.runTransaction(tx);
            }
        });
    }
    runTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.Trie.trie.checkpoint();
                const oldFromAccount = yield this.Trie.getAccount(tx.from);
                const fromBalance = Number(oldFromAccount.balance) - Number(tx.amount);
                const newFromAccount = Object.assign(Object.assign({}, oldFromAccount), { address: tx.from, balance: fromBalance });
                const oldToAccount = yield this.Trie.getAccount(tx.to);
                const toBalance = Number(oldToAccount.balance) + Number(tx.amount);
                const newToAccount = Object.assign(Object.assign({}, oldToAccount), { address: tx.to, balance: toBalance });
                yield this.Trie.setAccount(tx.from, newFromAccount /* new account */);
                yield this.Trie.setAccount(tx.to, newToAccount);
                yield this.Trie.trie.commit();
            }
            catch (error) {
                yield this.Trie.trie.revert();
            }
        });
    }
}
exports.TransactionEngine = TransactionEngine;
function validateTransaction(tBuf) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tx = transaction.decode(tBuf);
            const hash = ethers_1.default.utils.keccak256(tx);
            ethers_1.default.utils.recoverAddress(hash, tx.signature);
            this.runTransaction(tx);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.validateTransaction = validateTransaction;
//# sourceMappingURL=engine.js.map