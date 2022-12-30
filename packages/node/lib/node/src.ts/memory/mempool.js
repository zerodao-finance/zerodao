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
const sketch_1 = require("./sketch");
const proto_1 = require("../proto");
const transaction_1 = require("../transaction");
class Mempool {
    static init(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const sketch = yield sketch_1.Sketch.init(20);
            return new Mempool(Object.assign(Object.assign({}, config), { sketch }));
        });
    }
    constructor(config = {
        _len: 0,
        _cleanupInterval: 3600,
        _gossipInterval: 3600,
        peer: null,
        protocol: null,
        POOL_GOSSIP_TIME: 5,
        MAX_POOL_SIZE: 10000,
        MAX_MSG_BYTES: 1000,
        POOL_STORAGE_TIME_LIMIT: 3600,
        POOL_GOSSIP_TOPIC: "/zeropool/0.0.1",
    }) {
        this.running = false;
        this._len = 0;
        this.POOL_GOSSIP_TOPIC = "zerodao:xnode:gossip:v1";
        this.POOL_GOSSIP_TIME = 5;
        this.MEMORY_CLEANUP_TIME = 10;
        this.MAX_POOL_SIZE = 10000;
        this.MAX_MSG_BYTES = 1000; // 1kb max message limit;
        this.handlers = {
            SKETCH: this.synchronize,
            TX: this.addTransaction,
            MEMORY: this.resetMempool,
        };
        Object.assign(this, config);
        this.protocol = proto_1.protocol;
    }
    validate(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tx.length > this.MAX_MSG_BYTES) {
                throw new Error("Transaction exceeded memory limit");
            }
            yield (0, transaction_1.checkTransaction)(tx);
            //TODO: pass transaction to vm or equivilant
        });
    }
    get length() {
        return Array.from(this.state.keys()).length;
    }
    addTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = Date.now();
            const hash = ethers_1.ethers.utils.keccak256(tx);
            try {
                yield this.validate(tx);
                this.state.set(hash, tx);
                this.sketch.storeTx(hash);
            }
            catch (error) {
                this.handled.set(hash, {
                    tx,
                    timestamp,
                    hash: hash,
                    error: error,
                });
            }
        });
    }
    cleanup() {
        this.sketch.clear();
        this.state.clear();
        this.handled.clear();
    }
    synchronize(serializedSketch) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sketch.calculateDifferences(serializedSketch);
        });
    }
    resetMempool(mempool) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cleanup();
            yield mempool.reduce((a, d) => __awaiter(this, void 0, void 0, function* () {
                yield a;
                yield this.addTransaction(d);
            }), Promise.resolve());
        });
    }
    handleBroadcast(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.handlers[msg.messageType](msg.data);
        });
    }
    broadcastValues() {
        return __awaiter(this, void 0, void 0, function* () {
            let m = Array.from(this.state.values());
            return this.protocol.Mempool.encode({ txs: m }).finish();
        });
    }
    _hashMempool() {
        return this.sketch.serialize();
    }
}
exports.Mempool = Mempool;
//# sourceMappingURL=mempool.js.map