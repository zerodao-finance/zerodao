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
exports.Peer = void 0;
const p2p_1 = require("@zerodao/p2p");
const ethers_1 = require("ethers");
const logger_1 = require("../logger");
const peer_id_1 = __importDefault(require("peer-id"));
const node_fs_1 = __importDefault(require("node:fs"));
class Peer extends p2p_1.ZeroP2P {
    static peerIdFromNodeKey(nodeKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield peer_id_1.default.createFromJSON(nodeKey);
        });
    }
    static fromConfig(path = 'default.config.json') {
        return __awaiter(this, void 0, void 0, function* () {
            var json = node_fs_1.default.readFileSync(path, 'utf8');
            let config = JSON.parse(json);
            var signer = new ethers_1.ethers.Wallet(config.wallet.private_key);
            logger_1.logger.info(`successfully loaded node: ${config['node_id']} `);
            return new this({
                nodeId: config["node_id"],
                peerId: yield this.peerIdFromNodeKey(config["peer_id"]),
                multiaddr: config["multiaddrs"],
                signer
            });
        });
    }
    static createKey() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield peer_id_1.default.create();
        });
    }
    static createSigner() {
        return ethers_1.ethers.Wallet.createRandom();
    }
    static fromMultiaddr(multiaddr, profile = 'defualt') {
        return __awaiter(this, void 0, void 0, function* () {
            let nodeKey = yield Peer.createKey();
            let signer = Peer.createSigner();
            return new this({
                nodeId: profile,
                peerId: nodeKey,
                signer: signer,
                multiaddr: multiaddr
            });
        });
    }
    constructor(options) {
        super(options);
        this.saveConfig(options);
    }
    createPubsubProtocol(topic, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pubsub.subscribe(topic, callback);
            return (function (topic, msg) {
                this.pubsub.publish(topic, msg);
            }).bind(this);
        });
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
        node_fs_1.default.writeFile(`${options.nodeId}.config.json`, json, 'utf8', () => { logger_1.logger.info("current node config saved..."); });
    }
}
exports.Peer = Peer;
//# sourceMappingURL=network.js.map