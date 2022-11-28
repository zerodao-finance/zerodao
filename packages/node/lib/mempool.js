"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroPool = void 0;
const protobuf_1 = require("protobuf");
class ZeroPool {
    constructor() {
        this._running = false; //if the mempool is running or not
        this._buffer = protobuf_1.protobuf.load('../proto/ZeroProtocol.proto');
        this._pending = [];
    }
    static initialize({ config, buffer } = {}) {
        config ? buffer ?  :  : ;
        return this(config, buffer);
        return this(config);
        return this();
        return this();
    }
}
exports.ZeroPool = ZeroPool;
 || {};
;
if (buffer) {
    this._buffer = buffer;
}
open();
boolean;
{
    if (this.opened) {
        return false;
    }
    this.open = true;
    return true;
}
/**
 * start tx processing
 */
start();
boolean;
{
    if (this._running)
        return false;
    /**
     *
     * remember to clear the interval in the cleanup code
     */
    this._cleanupInterval == setInterval(this.cleanup.bind(this), this.POOL_STORAGE_TIME_LIMIT * 1000 * 60);
    this._running = true;
    return true;
}
async;
addTx(tx, typedTransaction);
{
    const hash = tx.hash.toString(hex);
    const timestamp = Date.now();
    try {
        await (this._validate(tx));
        if (this._pool.has(hash))
            return; // disregard duplicate transaction
        this._pool.set(hash, { tx: tx, timestamp: added, hash: hash }); // set the added tx with the hash as the key
        this._handled.set(hash, { hash, added });
        this._length++; // increase _length property by 1 transaction
    }
    catch (error) {
        this._handled.set(hash, { hash, added, error: error });
        throw error;
    }
}
private;
_generateTHash();
{
    let buf = this._buffer.lookupType("Transaction Block");
    let txs = Object.assign({}, { transactions: (this._pool.values()).map((i) => i.tx) });
    let _rbuf = buf.encode(txs);
    return ethers.utils.keccak256(_rbuf);
}
async;
_handlePeerGossip(txHashes, string[]);
{
    //TODO: handle transaction hashes annouced via gossip
}
async;
_gossipMemPool();
{
    new Promise((resolve) => {
        setTimeout(() => this.annouceTxs, this._gossipInterval);
        resolve();
    });
}
async;
_validate(tx, typedTransaction);
{
    //TODO: transaction validation logic
}
async;
_cleanupPool();
{
    clearInterval(this._cleanupInterval); // clear cleanup interval
    clearInterval(this._gossipInterval);
    //TODO: cleanup current mempool
}
//# sourceMappingURL=mempool.js.map