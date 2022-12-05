"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mempool = void 0;
const ethers_1 = require("ethers");
const logger_1 = require("../logger");
class Mempool {
    static init(peer) {
        logger_1.logger.info("Mempool has been initialized");
        return new this({ peer });
    }
    constructor({ peer }) {
        this.running = false;
        this._len = 0;
        this.POOL_GOSSIP_TOPIC = "zerodao:xnode:gossip:v1";
        this.POOL_GOSSIP_TIME = 5;
        this.MEMORY_CLEANUP_TIME = 10;
        this.MAX_POOL_SIZE = 10000;
        this.MAX_MSG_BYTES = 1000; // 1kb max message limit;
        Object.bind(this, {
            peer: peer,
        });
    }
    async start() {
        if (this.running)
            return;
        this.running = true;
        await this.peer.pubsub.subscribe(this.POOL_GOSSIP_TOPIC, async (msg) => {
            await this.ackGossip(msg);
        });
        this._cleanupInterval = setInterval(this.cleanup.bind(this), this.MEMORY_CLEANUP_TIME * 1000 * 60);
        this._gossipInterval = setInterval(this.broadcast.bind(this), this.POOL_GOSSIP_TIME * 1000 * 60);
        return true;
    }
    async close() {
        if (!this.running)
            return;
        //TODO:
    }
    async validate(tx) {
        if (tx.length > this.MAX_MSG_BYTES) {
            throw new Error("Transaction exceeded memory limit");
        }
        //TODO: pass transaction to vm or equivilant
    }
    get length() {
        return Array.from(this.state.keys()).length;
    }
    async addTx(tx) {
        const timestamp = Date.now();
        let tBuf = this.protocol.Transaction.encode(tx);
        const hash = ethers_1.ethers.utils.keccak256(tBuf);
        try {
            await this.validate(tBuf);
            this.state.set(hash, tBuf);
        }
        catch (error) {
            this.handled.set(hash, {
                tx: tBuf,
                hash: hash,
                timestamp: Date.now(),
                error: error,
            });
        }
    }
    async cleanup() {
        //TODO:
    }
    async ackGossip(message) {
        let msg = this.protocol.Mempool.decode(message).toObject();
        // set recieved message items with current state
    }
    async broadcast() {
        let m = Array.from(this.state.values());
        let mbuf = this.protocol.Mempool.encode({ txs: m }).finish();
        this.peer.pubsub.publish(this.POOL_GOSSIP_TOPIC, mbuf);
    }
    // to save memory and time broadcasts will include a temporary tHash of the current state of the mempool
    // this can be checked against the stored hash in the mempool. when recieving gossip from peers. if the mHash matches your current mHash
    // the message from that peer can be safely ignored without losing information.
    async _hashMempool() {
        //TODO: implement
    }
}
exports.Mempool = Mempool;
//# sourceMappingURL=ZeroPool.js.map