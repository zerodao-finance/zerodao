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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mempool = void 0;
const ethers_1 = require("ethers");
class Mempool {
    constructor(config = {
        protocol: null,
        MAX_BLOCK_SIZE: 10000,
        MAX_MSG_BYTES: 1000, // 1kb max message limit;
    }) {
        this.MAX_BLOCK_SIZE = 10000;
        this.MAX_MSG_BYTES = 1000; // 1kb max message limit;
        Object.assign(this, config);
    }
    static init(config) {
        return new Mempool(config);
    }
    get length() {
        return this.state.size;
    }
    addTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            let _buff = this.protocol.Transaction.encode(tx).finish(); //encode transaction
            const hash = ethers_1.ethers.utils.keccak256(_buff); // generate arbitrary hash string 
            try {
                this._validate(_buff);
                this.state.set(hash, _buff); //set valid transaction to the state set
            }
            catch (error) {
                this.handled.set(hash, {
                    tx: _buff,
                    timestamp: Date.now(),
                    error: error
                });
                throw error;
            }
        });
    }
    reapMaxBytes() {
        return __awaiter(this, void 0, void 0, function* () {
            let entries = this.state.entries();
        });
    } // get txs to propose in next block
    merge(_message) {
        let message = this.protocol.Mempool.decode(_message);
        this._xor(message);
    }
    resolve(_message) {
        let message = this.protocol.Mempool.decode(_message);
        this._xnot(message);
    }
    _xor(subset) {
        subset.forEach((tx, hash) => {
            this.state.set(hash, tx);
        });
    }
    _xnot(subset) {
        subset.forEach((tx, hash) => {
            this.state.delete(hash);
        });
    }
    _validate(tx) {
        if (this.protocol.Transaction.verify(tx)) {
            throw new Error("Check transaction params");
        }
        if (Buffer.byteLength(tx, "hex") > this.MAX_MSG_BYTES) {
            throw new Error("Transaction exceeded memory limit");
        }
        //TODO: pass transaction to vm or equivilant
    }
}
exports.Mempool = Mempool;
//# sourceMappingURL=mempool.js.map