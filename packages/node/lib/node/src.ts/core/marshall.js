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
exports.Marshaller = void 0;
const logger_1 = require("../logger");
const p2p_1 = require("@zerodao/p2p");
const memory_1 = require("../memory");
const rpc_1 = require("../rpc");
class Marshaller {
    static init(signer, multiaddr) {
        return __awaiter(this, void 0, void 0, function* () {
            console.time("marshall:start");
            // initialize Mempool and rpc server
            let rpc = rpc_1.RPCServer.init();
            let memory = yield memory_1.Mempool.init({});
            // start peer process
            const seed = yield signer.signMessage(p2p_1.ZeroP2P.toMessage(yield signer.getAddress()));
            const peer = yield p2p_1.ZeroP2P.fromSeed({
                signer,
                seed: Buffer.from(seed.substring(2), "hex"),
                multiaddr: multiaddr,
            });
            yield new Promise((resolve) => {
                peer.start();
                peer.on("peer:discover", (peerInfo) => __awaiter(this, void 0, void 0, function* () {
                    logger_1.logger.info(`found peer \n ${peerInfo}`);
                }));
                resolve(console.timeLog("marshall:start:"));
            });
            // await timeout(5000);
            logger_1.logger.info(`marshall process startup in ${console.timeEnd("marshall:start")}`);
            return new this({
                rpc,
                memory,
                peer,
            });
        });
    }
    constructor({ rpc, memory, peer }) {
        Object.assign(this, {
            rpc,
            memory,
            peer,
        });
    }
    startService() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rpc.start();
            yield this._handleInboundTransactions();
            logger_1.logger.info("rpc server started");
        });
    }
    stopService() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    proposeBlockFromMemory(height) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    _handleInboundTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            this.rpc.on("zero_sendTransaction", (message) => {
                this.memory.addTransaction(message);
            });
        });
    }
    broadcast() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    //gossip current state of mempool to peers
    _broadcastMempool() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    // cleanup stale transactions in mempool
    _cleanupMempool() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Marshaller = Marshaller;
//# sourceMappingURL=marshall.js.map