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
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = exports.keccak256 = exports.checkTx = exports.TransactionEngine = void 0;
const protobuf = __importStar(require("protobufjs"));
const bip21 = __importStar(require("bip21"));
const bitcoin_address_validation_1 = require("bitcoin-address-validation");
const sha3_1 = require("@noble/hashes/sha3");
const ethers_1 = require("ethers");
/* Receive a block, and run its transactions on the application state, validating each transaction and using checkpoints and reverts. */
const PROTO_PATH = __dirname + "/../../../protobuf/proto/ZeroProtocol.proto";
const root = protobuf.loadSync(PROTO_PATH);
__dirname + "@zerodao/protobuf";
// const root = protocol;
const transfer = root.lookupType("Transfer");
const stake = root.lookupType("Stake");
const release = root.lookupType("Release");
class TransactionEngine {
    constructor(trie) {
        this.trie = trie;
    }
    /* accepts a block as an object, runs each transaction and returns the app state root as well as the results(success or revert) and messages which need signed by FROST */
    async runBlock(block) {
        await this.trie.trie.checkpoint();
        for (const tx of block.Data.Txs) {
            const txObject = tx.type == 1 ? transfer.decode(tx.data) : tx.type == 2 ? stake.decode(tx.data) : release.decode(tx.data);
            console.log(txObject);
            await this.runTransaction(txObject);
        }
        await this.trie.trie.commit();
        const results = this.receipts;
        const toSign = this.messages;
        this.receipts = [];
        this.messages = [];
        return {
            root: this.trie.trie.root,
            results: results,
            messages: toSign
        };
    }
    // Takes each transaction, validates it and carries out its changes on the state trie
    async runTransaction(tx) {
        await this.trie.trie.checkpoint();
        if (tx.type == "Transfer") {
            try {
                await this.validateTransaction(tx);
                const fromAccount = (await this.trie.getAccount(tx.from.toString()));
                fromAccount.unStakedBalance[tx.asset.toString()] -= Number(tx.amount);
                const toAccount = (await this.trie.getAccount(tx.to.toString()));
                toAccount.unStakedBalance[tx.asset.toString()] += Number(tx.amount);
                await this.trie.setAccount(tx.from.toString(), fromAccount);
                await this.trie.setAccount(tx.to.toString(), toAccount);
                this.receipts.push(true);
                await this.trie.trie.commit();
                // mark as success in the next block header
            }
            catch (error) {
                this.receipts.push(false);
                await this.trie.trie.revert();
                // mark as failure in the next block header
            }
        }
        if (tx.type == "Stake") {
            try {
                await this.validateTransaction(tx);
                const fromAccount = (await this.trie.getAccount(tx.from.toString()));
                fromAccount.stakedBalance[tx.asset.toString()] += Number(tx.amount);
                await this.trie.setAccount(tx.from.toString(), fromAccount);
                await this.trie.trie.commit();
                this.receipts.push(true);
                // mark as success in next block header
            }
            catch (error) {
                this.receipts.push(false);
                await this.trie.trie.revert();
                // mark as failure in next block header
            }
        }
        if (tx.type == "Release") {
            try {
                await this.validateTransaction(tx);
                const account = await this.trie.getAccount(tx.from.toString());
                account.unStakedBalance[tx.asset.toString()] -= Number(tx.amount);
                // add bytestrings into next block header
                const pHash = (0, exports.keccak256)(tx.data);
                this.messages.push(ethers_1.utils.solidityKeccak256(["string", "string", "uint64", "uint64"], [tx.destination, pHash, tx.nonce, tx.amount]));
                this.receipts.push(true);
                await this.trie.setAccount(tx.from.toString(), account);
                await this.trie.trie.commit();
            }
            catch (error) {
                this.receipts.push(false);
                await this.trie.trie.revert();
            }
        }
        if (tx.type == "Burn") {
            try {
                await this.validateTransaction(tx);
            }
            catch (error) {
            }
        }
    }
    // validates a tx, causes revert if fails
    async validateTransaction(tx) {
        const oldFromAccount = (await this.trie.getAccount(tx.from));
        if (tx.destination && tx.chain == "BTC") {
            if (bip21.validate(tx.destination)) {
                if (tx.destination.startsWith("bc1t")) {
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
    }
}
exports.TransactionEngine = TransactionEngine;
async function checkTx(tBuf) {
    try {
        transfer.decode(tBuf) || stake.decode(tBuf) || release.decode(tBuf);
    }
    catch (error) {
        throw "Transaction not a valid protobuf type";
    }
}
exports.checkTx = checkTx;
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