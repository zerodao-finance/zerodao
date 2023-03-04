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
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = exports.keccak256 = exports.TransactionEngine = void 0;
const bip21 = __importStar(require("bip21"));
const bitcoin_address_validation_1 = require("bitcoin-address-validation");
const protobuf_1 = require("@zerodao/protobuf");
const sha3_1 = require("@noble/hashes/sha3");
const ethers_1 = require("ethers");
/* Receive a block, and run its transactions on the application state, validating each transaction and using checkpoints and reverts. */
const transfer = protobuf_1.protocol.Transfer;
const stake = protobuf_1.protocol.Stake;
const release = protobuf_1.protocol.Release;
class TransactionEngine {
    constructor(trie) {
        this.trie = trie;
    }
    /* accepts a block as an object, runs each transaction and returns the app state root as well as the results(success or revert) and messages which need signed by FROST */
    runBlock(block) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.trie.trie.checkpoint();
            for (const tx of block.Data.Txs) {
                const txObject = tx.type == 1 ? transfer.decode(tx.data) : tx.type == 2 ? stake.decode(tx.data) : release.decode(tx.data);
                console.log(txObject);
                yield this.runTransaction(txObject);
            }
            yield this.trie.trie.commit();
            const results = this.receipts;
            const toSign = this.messages;
            this.receipts = [];
            this.messages = [];
            return {
                root: this.trie.trie.root,
                results: results,
                messages: toSign
            };
        });
    }
    // Takes each transaction, validates it and carries out its changes on the state trie
    runTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.trie.trie.checkpoint();
            if (tx.type == "Transfer") {
                try {
                    yield this.validateTransaction(tx);
                    const fromAccount = (yield this.trie.getAccount(tx.from.toString()));
                    fromAccount.unStakedBalance[tx.asset.toString()] -= Number(tx.amount);
                    const toAccount = (yield this.trie.getAccount(tx.to.toString()));
                    toAccount.unStakedBalance[tx.asset.toString()] += Number(tx.amount);
                    yield this.trie.setAccount(tx.from.toString(), fromAccount);
                    yield this.trie.setAccount(tx.to.toString(), toAccount);
                    this.receipts.push(true);
                    yield this.trie.trie.commit();
                    // mark as success in the next block header
                }
                catch (error) {
                    this.receipts.push(false);
                    yield this.trie.trie.revert();
                    // mark as failure in the next block header
                }
            }
            if (tx.type == "Stake") {
                try {
                    yield this.validateTransaction(tx);
                    const fromAccount = (yield this.trie.getAccount(tx.from.toString()));
                    fromAccount.stakedBalance[tx.asset.toString()] += Number(tx.amount);
                    yield this.trie.setAccount(tx.from.toString(), fromAccount);
                    yield this.trie.trie.commit();
                    this.receipts.push(true);
                    // mark as success in next block header
                }
                catch (error) {
                    this.receipts.push(false);
                    yield this.trie.trie.revert();
                    // mark as failure in next block header
                }
            }
            if (tx.type == "Release") {
                try {
                    yield this.validateTransaction(tx);
                    const account = yield this.trie.getAccount(tx.from.toString());
                    account.unStakedBalance[tx.asset.toString()] -= Number(tx.amount);
                    // add bytestrings into next block header
                    const pHash = (0, exports.keccak256)(tx.data);
                    this.messages.push(ethers_1.utils.solidityKeccak256(["string", "string", "uint64", "uint64"], [tx.destination, pHash, tx.nonce, tx.amount]));
                    this.receipts.push(true);
                    yield this.trie.setAccount(tx.from.toString(), account);
                    yield this.trie.trie.commit();
                }
                catch (error) {
                    this.receipts.push(false);
                    yield this.trie.trie.revert();
                }
            }
            if (tx.type == "Burn") {
                try {
                    yield this.validateTransaction(tx);
                }
                catch (error) {
                }
            }
        });
    }
    // checkTx
    checkTxSync(tBuf) {
        return __awaiter(this, void 0, void 0, function* () {
            let _decoded = protobuf_1.protocol.Transaction.decode(tBuf);
            let tx = protobuf_1.protocol.Transaction.toObject(_decoded, { longs: String, bytes: String, enums: String });
            let res = yield this.validateTransaction(tx);
            if (_.isError(res))
                return [null, new Error("Transaction will revert against state trie")];
            return [{ Code: 1, value: tBuf }, null];
        });
    }
    // validates a tx, causes revert if fails
    validateTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(chalk.red("from logger => "), tx);
            const oldFromAccount = (yield this.trie.getAccount(tx.from));
            if (tx.destination && tx.chain == "BTC") {
                if (bip21.validate(tx.destination)) {
                    if (tx.destination.startsWith("bc1")) {
                        console.log("It's a taproot address");
                    }
                    else {
                        console.log("It's a bech32 address");
                    }
                }
                else if ((0, bitcoin_address_validation_1.validate)(tx.address)) {
                    console.log("It's a regular BTC address");
                }
                else {
                    throw new Error(`Invalid address: ${tx.destination}`);
                }
            }
            const fromBalance = Number(oldFromAccount.unStakedBalance[tx.asset]);
            if (fromBalance >= tx.amount)
                return;
            else
                throw Error;
        });
    }
}
exports.TransactionEngine = TransactionEngine;
const keccak256 = (...msg) => {
    return new Uint8Array((0, sha3_1.keccak_256)((0, exports.concat)(msg)));
};
exports.keccak256 = keccak256;
const concat = (uint8Arrays) => {
    const concatenated = uint8Arrays.reduce((acc, curr) => {
        acc.push(...curr);
        return acc;
    }, []);
    return new Uint8Array(concatenated);
};
exports.concat = concat;
//# sourceMappingURL=engine.js.map