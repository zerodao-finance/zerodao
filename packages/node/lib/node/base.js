"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const mempool_1 = require("../mempool");
const rpc_1 = require("../rpc");
const p2p_1 = require("../p2p");
const events_1 = require("events");
const chalk_1 = __importDefault(require("chalk"));
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
        // testing only need to fix this
        this.proxyApp = {
            checkTxSync: function (tx) {
                return [{ Code: 1, value: "something" }, null];
            }
        };
        this.peer = peer;
        this.rpc = rpc;
        this.createConfigDir();
    }
    // creates .zeronode/config directory if one doesn't exist in the home dir
    createConfigDir() {
        if (node_fs_1.default.existsSync(this.configPath))
            return;
        node_fs_1.default.mkdirSync(this.configPath, { recursive: true });
    }
    // initializes mempool and mempool reactor
    // connects reactor to the rpc via .addService() method
    initializeMempoolAndReactor(config) {
        // 0, should be replaced by this.state.height
        const [mp, reactor] = (0, mempool_1.MempoolConstructor)(0, this.proxyApp, config, this.peer);
        this.mempool = mp;
        this.mempoolReactor = reactor;
        this.rpc.addService(this.mempoolReactor);
        logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> mempool & reactor created...`));
    }
    async startNode(port) {
        // start mempool and connect mempool service to rpc
        await new Promise((resolve) => {
            this.initializeMempoolAndReactor({ MAX_BYTES: 10000 });
            setTimeout(resolve, 2000);
            logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> mempool & reactor initialized`));
        });
        // start libp2p
        await new Promise((resolve) => {
            this.peer.start();
            this.rpc.start({ address: '0.0.0.0', port: port });
            setTimeout(resolve, 2000);
            logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> started rpc listening on 0.0.0.0:${port}`));
            logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> started libp2p module...`));
        });
        // start transaction gossip from mempool reactor
        await new Promise(async (resolve) => {
            await this.mempoolReactor.initTxGossip();
            setTimeout(resolve, 2000);
            logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("Node Startup")}|=> Peer transaction gossip started...`));
        });
    }
}
(async () => {
    await new Promise(async (resolve) => {
        let node_1 = Node.initNode({ peer: await p2p_1.Peer.fromMultiaddr("mainnet", "first") });
        let node_2 = Node.initNode({ peer: await p2p_1.Peer.fromMultiaddr("mainnet", "second") });
        await node_2.startNode('50052');
        await node_1.startNode('50051');
        setTimeout(resolve, 2000);
    });
    logger_1.logger.info("ready to go...");
})();
//# sourceMappingURL=base.js.map