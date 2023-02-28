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
exports.Mempool = void 0;
const tx_1 = require("./tx");
const lodash_1 = __importDefault(require("lodash"));
const ethers_1 = require("ethers");
const logger_1 = require("../logger");
const protobuf_1 = require("@zerodao/protobuf");
const sketch_1 = require("./sketch");
const abci = {
    CodeTypeOk: 1
};
const OkMessage = { Code: abci.CodeTypeOk, value: "something" };
const proxyAppTest = {
    checkTxSync: function (tx) {
        return [OkMessage, null];
    },
};
function Mempool(height, proxyApp, config) {
    this.txs = new Map();
    this.cache = new Set();
    this.height = height;
    this.config = config;
    this.proxy = proxyApp;
    this.sketch = undefined;
}
exports.Mempool = Mempool;
// returns length of the current mempool (ie. number of txs in pool)
Mempool.prototype.length = function () {
    return this.txs.size;
};
// clears current mempool
Mempool.prototype.flushPool = function () {
    this.txs.clear();
    return;
};
// removes a transaction from the mempool by the transaction hash
Mempool.prototype.deleteByHash = function (hash) {
    if (this.cache.has(hash))
        this.cache.delete(hash);
    if (this.txs.hash(hash))
        this.txs.delete(hash);
    return;
};
/*
 * pulls up to (max) transactions from the mempool
 * does not modify mempool
 * if max is undefined or 0 returns all transactions in the mempool
 */
Mempool.prototype.reapMax = function (max) {
    var txs = lodash_1.default.map([...this.txs.values()], (w) => w.tx);
    if (max == undefined || max == 0)
        return txs;
    return lodash_1.default.take(txs, max);
};
// check transaction function
Mempool.prototype.checkTx = function (tx) {
    return __awaiter(this, void 0, void 0, function* () {
        tx = protobuf_1.protocol.Transaction.encode(tx).finish();
        var hash = ethers_1.ethers.utils.keccak256(tx);
        var time = Date.now().toString();
        if (tx.length > this.config.MAX_BYTES) {
            return [null, new Error("transaction exceeds MAX_BYTES")];
        }
        if (this.cache.has(hash)) {
            if (this.txs.has(hash)) {
                // recheck the transaction
                // if invalid remove from the pool
                // leave in the cache
            }
            return [null, new Error("transaction exists in cache")];
        }
        this.cache.add(hash);
        let wtx = new tx_1.WrappedTx(tx, time, this.height);
        let [rsp, err] = yield this.proxy.checkTxSync(tx);
        if (err) {
            return [null, err];
        }
        ;
        this.addTx(wtx, rsp);
        return [{ status: "SUCCESS" }, null];
    });
};
Mempool.prototype.addTx = function (wtx, checkResponse) {
    if (checkResponse.Code != abci.CodeTypeOk) {
        logger_1.logger.info('rejected bad transaction');
        throw new Error("rejected bad transaction");
        return;
    }
    this.txs.set(wtx.Hash(), wtx);
};
Mempool.prototype.merge = function (otherMap) {
    return;
    // merge other pool into this pool
    // use lodash merge()
};
Mempool.prototype.serialize = function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.sketch = yield sketch_1.Sketch.fromTxs([...this.txs.values()]);
        console.log(this.sketch);
        return this.sketch.serialize();
    });
};
Mempool.prototype.resolveSketch = function (sketch) {
    return __awaiter(this, void 0, void 0, function* () {
        // = await Sketch.fromTxs([...this.txs.values()]);
        return yield this.sketch.calculateDifferences(sketch);
    });
};
// testing stuff >>>>>>>>>>>>>>
function startInjesting(mp) {
    setInterval((mp) => {
        let encoded = protobuf_1.protocol.BalanceQuery.encode({ address: ethers_1.ethers.utils.randomBytes(8) }).finish();
        mp.checkTx(encoded);
        logger_1.logger.info(`mempool size ${mp.length()}`);
    }, 5000, mp);
}
function fillMock(times, mp) {
    return new Promise((resolve) => {
        for (let y = 0; y < times; y++) {
            let encoded = protobuf_1.protocol.BalanceQuery.encode({ address: ethers_1.ethers.utils.randomBytes(8) }).finish();
            mp.checkTx(encoded);
        }
        setTimeout(resolve, 10000);
    });
}
function logdata(mp) {
    setInterval((mp) => {
        console.log(`reaping transactions`, mp.reapMax());
    }, 1000, mp);
    setInterval((mp) => __awaiter(this, void 0, void 0, function* () {
        console.log(`creating sketch`, yield mp.serialize());
    }), 1000, mp);
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    let mp = new Mempool(0, proxyAppTest, { MAX_BYTES: 10000 });
    let mp2 = new Mempool(0, proxyAppTest, { MAX_BYTES: 10000 });
    yield Promise.all([fillMock(10, mp),
        fillMock(19, mp2)]).then();
    let mp_buffer = yield mp.serialize();
    let mp2_buffer = yield mp2.serialize();
    console.log(yield mp.resolveSketch(mp2_buffer));
}));
//# sourceMappingURL=mempool.js.map