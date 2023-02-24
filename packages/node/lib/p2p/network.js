"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peer = void 0;
const p2p_1 = require("@zerodao/p2p");
const ethers_1 = require("ethers");
const logger_1 = require("../logger");
const peer_id_1 = __importDefault(require("peer-id"));
const node_os_1 = __importDefault(require("node:os"));
const node_fs_1 = __importDefault(require("node:fs"));
const chalk_1 = __importDefault(require("chalk"));
class Peer extends p2p_1.ZeroP2P {
    static async fromConfig(path = 'default.config.json') {
        var json = node_fs_1.default.readFileSync(path, 'utf8');
        let config = JSON.parse(json);
        logger_1.logger.info(`loading ${chalk_1.default.yellow("PEER")} from config file ${chalk_1.default.yellow(`${config['node_id']}`)} \n `);
        var signer = new ethers_1.ethers.Wallet(config.wallet.private_key);
        return new this({
            nodeId: config["node_id"],
            peerId: await this.peerIdFromNodeKey(config["peer_id"]),
            multiaddr: config["multiaddrs"],
            signer
        });
    }
    static async fromMultiaddr(multiaddr, profile = 'default') {
        let nodeKey = await Peer.createKey();
        let signer = Peer.createSigner();
        logger_1.logger.info(`creating ${chalk_1.default.yellow("PEER")} with node key ${chalk_1.default.yellow(`${nodeKey}`)} \n`);
        return new this({
            nodeId: profile,
            peerId: nodeKey,
            signer: signer,
            multiaddr: multiaddr
        });
    }
    static async peerIdFromNodeKey(nodeKey) {
        return await peer_id_1.default.createFromJSON(nodeKey);
    }
    static createSigner() {
        return ethers_1.ethers.Wallet.createRandom();
    }
    static async createKey() {
        return await peer_id_1.default.create();
    }
    static createConfigDir() {
        if (node_fs_1.default.existsSync(`${node_os_1.default.homedir()}/.zeronode/config/profiles`))
            return;
        node_fs_1.default.mkdirSync(`${node_os_1.default.homedir()}/.zeronode/config/profiles/`, { recursive: true });
    }
    // constructor ===============>
    constructor(options) {
        super(options);
        this.savePath = `${node_os_1.default.homedir()}/.zeronode/config/profiles/`;
        Peer.createConfigDir();
        this.saveConfig(options);
    }
    async createPubsubProtocol(topic, callback) {
        await this.pubsub.subscribe(topic, callback);
        return (function (topic, msg) {
            this.pubsub.publish(topic, msg);
        }).bind(this);
    }
    saveConfig(options) {
        let config = {
            node_id: options.nodeId,
            peer_id: options.peerId.toJSON(),
            wallet: {
                private_key: options.signer.privateKey,
                public_key: options.signer.publicKey
            }
        };
        let json = JSON.stringify(config);
        node_fs_1.default.writeFile(`${this.savePath}${options.nodeId}.config.json`, json, 'utf8', () => { logger_1.logger.info(`${chalk_1.default.magenta(`${chalk_1.default.green("Libp2p Startup")}|=> node config saved...`)}`); });
    }
}
exports.Peer = Peer;
//# sourceMappingURL=network.js.map