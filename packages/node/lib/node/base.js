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
const logger_1 = require("../logger");
const mempool_1 = require("../mempool");
const rpc_1 = require("../rpc");
const p2p_1 = require("../p2p");
const events_1 = require("events");
const trie_1 = require("../trie/trie");
const engine_1 = require("../application/engine");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_os_1 = __importDefault(require("node:os"));
class Node extends events_1.EventEmitter {
    // initialize new node from an instance of a libp2p peer
    // @params { peer: Peer } takes a libp2p instance
    // @returns { node: Node } returns new instance of this class
    static initNode({ peer } = {}) {
        // get env variables and start a new peer
        logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> initializing node & configs...`));
        return new this({
            rpc: rpc_1.RPC.init(),
            peer: peer
        });
    }
    constructor({ peer, rpc }) {
        super();
        this.configPath = `${node_os_1.default.homedir()}/.zeronode/config`;
        this.peer = peer;
        this.rpc = rpc;
        if (!node_fs_1.default.existsSync(this.configPath))
            node_fs_1.default.mkdirSync(this.configPath, { recursive: true });
        if (!node_fs_1.default.existsSync(path_1.default.join(this.configPath, 'db')))
            node_fs_1.default.mkdirSync(path_1.default.join(this.configPath, 'db'));
        logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> creating storage directories if needed...`));
        this.trie = new trie_1.StateTrie();
    }
    initializeApplicationLayer() {
        this.proxyApp = new engine_1.TransactionEngine(this.trie);
        logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> app proxy initialized...`));
    }
    // initializes mempool and mempool reactor
    // connects reactor to the rpc via .addService() method
    initializeMempoolAndReactor(height, config) {
        // 0, should be replaced by this.state.height
        const [mp, reactor] = (0, mempool_1.MempoolConstructor)(height, this.proxyApp, config, this.peer);
        this.mempool = mp;
        this.mempoolReactor = reactor;
        this.rpc.addService(this.mempoolReactor);
        logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> mempool & reactor created...`));
    }
    startNode({ height, port }) {
        return __awaiter(this, void 0, void 0, function* () {
            // start application layer
            this.initializeApplicationLayer();
            // start mempool and connect mempool service to rpc
            yield new Promise((resolve) => {
                this.initializeMempoolAndReactor(height, { MAX_BYTES: 10000 });
                setTimeout(resolve, 2000);
                logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> mempool & reactor initialized`));
            });
            // start libp2p
            yield new Promise((resolve) => {
                this.peer.start();
                this.rpc.start({ address: "0.0.0.0", port: port });
                setTimeout(resolve, 2000);
                logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> started rpc listening on 0.0.0.0:${port}`));
                logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> started libp2p module...`));
            });
            // start transaction gossip from mempool reactor
            yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                yield this.mempoolReactor.initTxGossip();
                setTimeout(resolve, 2000);
                logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> Peer transaction gossip started...`));
            }));
        });
    }
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        let node_1 = Node.initNode({ peer: yield p2p_1.Peer.fromMultiaddr("mainnet", "first") });
        let node_2 = Node.initNode({ peer: yield p2p_1.Peer.fromMultiaddr("mainnet", "second") });
        yield node_2.startNode({ height: 0, port: '50052' });
        yield node_1.startNode({ height: 0, port: '50051' });
        setTimeout(resolve, 2000);
    }));
    logger_1.logger.info("ready to go...");
}))();
//# sourceMappingURL=base.js.map