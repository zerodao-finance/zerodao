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
const logger_1 = require("../logger");
const mempool_1 = require("../mempool");
const rpc_1 = require("../rpc");
const p2p_1 = require("../p2p");
const events_1 = require("events");
class Node extends events_1.EventEmitter {
    // initialize new node from an instance of a libp2p peer
    // @params { peer: Peer } takes a libp2p instance
    // @returns { node: Node } returns new instance of this class
    static initNode({ peer } = {}) {
        // get env variables and start a new peer
        logger_1.logger.info("initializing node with configs...");
        return new this({
            rpc: rpc_1.RPC.init(),
            peer: peer
        });
    }
    constructor({ peer, rpc }) {
        super();
        this.proxyApp = {
            checkTxSync: function (tx) {
                return [{ Code: 1, value: "something" }, null];
            }
        };
        this.peer = peer;
        this.rpc = rpc;
    }
    // initializes mempool and mempool reactor
    // connects reactor to the rpc via .addService() method
    initializeMempoolAndReactor(config) {
        // 0, should be replaced by this.state.height
        const [mp, reactor] = (0, mempool_1.MempoolConstructor)(0, this.proxyApp, config, this.peer);
        this.mempool = mp;
        this.mempoolReactor = reactor;
        this.rpc.addService(this.mempoolReactor);
        logger_1.logger.info("mempool & reactor configured...");
    }
    startNode(port) {
        return __awaiter(this, void 0, void 0, function* () {
            // start mempool and connect mempool service to rpc
            yield new Promise((resolve) => {
                this.initializeMempoolAndReactor({ MAX_BYTES: 10000 });
                setTimeout(resolve, 2000);
                logger_1.logger.info("initialize mempool & mempool reactor");
            });
            // start libp2p
            yield new Promise((resolve) => {
                this.peer.start();
                this.rpc.start({ address: '0.0.0.0', port: port });
                setTimeout(resolve, 2000);
                logger_1.logger.info(`started rpc listening on 0.0.0.0:${port}`);
                logger_1.logger.info("started libp2p module...");
            });
            yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                yield this.mempoolReactor.initTxGossip();
                setTimeout(resolve, 2000);
                logger_1.logger.info("gossiping incoming transactions started...");
            }));
        });
    }
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    let peer = yield p2p_1.Peer.fromMultiaddr('mainnet', 'first');
    let peer2 = yield p2p_1.Peer.fromMultiaddr('mainnet', 'second');
    const callbackPromise = (msg) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.info(`heard message, ${msg}`);
    });
    yield new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        let node_1 = Node.initNode({ peer: yield p2p_1.Peer.fromMultiaddr("mainnet", "first") });
        let node_2 = Node.initNode({ peer: yield p2p_1.Peer.fromMultiaddr("mainnet", "second") });
        yield node_2.startNode('50052');
        yield node_1.startNode('50051');
        setTimeout(resolve, 2000);
    }));
    logger_1.logger.info("ready to go...");
}))();
//# sourceMappingURL=base.js.map