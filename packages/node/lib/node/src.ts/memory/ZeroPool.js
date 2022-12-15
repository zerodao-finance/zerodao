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
    static init(config) {
        return new Mempool(config);
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
        Object.assign(this, config);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.running)
                return;
            this.running = true;
            yield this.peer.pubsub.subscribe(this.POOL_GOSSIP_TOPIC, (msg) => __awaiter(this, void 0, void 0, function* () {
                yield this.ackGossip(msg);
            }));
            this._cleanupInterval = setInterval(this.cleanup.bind(this), this.MEMORY_CLEANUP_TIME * 1000 * 60);
            this._gossipInterval = setInterval(this.broadcast.bind(this), this.POOL_GOSSIP_TIME * 1000 * 60);
            return true;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.running)
                return;
            yield this.cleanup();
            this.peer.pubsub.unsubscribe(this.POOL_GOSSIP_TOPIC);
            this.running = false;
            clearInterval(this._gossipInterval);
            clearInterval(this._cleanupInterval);
        });
    }
    validate(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tx.length > this.MAX_MSG_BYTES) {
                throw new Error("Transaction exceeded memory limit");
            }
            //TODO: pass transaction to vm or equivilant
        });
    }
    get length() {
        return Array.from(this.state.keys()).length;
    }
    addTx(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = Date.now();
            let tBuf = this.protocol.Transaction.encode(tx).finish();
            const hash = ethers_1.ethers.utils.keccak256(tBuf);
            try {
                yield this.validate(tBuf);
                this.state.set(hash, tBuf);
            }
            catch (error) {
                this.handled.set(hash, {
                    tx: tBuf,
                    timestamp,
                    hash: hash,
                    error: error,
                });
            }
        });
    }
    cleanup() {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO:
        });
    }
    ackGossip(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let msg = this.protocol.Mempool.decode(message).toObject();
            // set recieved message items with current state
        });
    }
    broadcast() {
        return __awaiter(this, void 0, void 0, function* () {
            let m = Array.from(this.state.values());
            let mbuf = this.protocol.Mempool.encode({ txs: m }).finish();
            this.peer.pubsub.publish(this.POOL_GOSSIP_TOPIC, mbuf);
        });
    }
    // to save memory and time broadcasts will include a temporary tHash of the current state of the mempool
    // this can be checked against the stored hash in the mempool. when recieving gossip from peers. if the mHash matches your current mHash
    // the message from that peer can be safely ignored without losing information.
    _hashMempool() {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO: implement
        });
    }
}
exports.Mempool = Mempool;
//# sourceMappingURL=ZeroPool.js.map