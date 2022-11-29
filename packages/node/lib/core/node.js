'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroNode = void 0;
const chalk = require("chalk");
const logger_1 = require("../logger");
const p2p_1 = require("@zerodao/p2p");
const memory_1 = require("../memory");
const proto_1 = require("../proto");
const consensus_1 = require("../consensus");
class ZeroNode {
    static async fromSigner(signer, multiaddr) {
        logger_1.logger.info('generating seed from secp256k1 signature');
        const seed = await signer.signMessage(p2p_1.ZeroP2P.toMessage(await signer.getAddress()));
        logger_1.logger.info('creating peer from seed, wait for complete ...');
        const peer = await p2p_1.ZeroP2P.fromSeed({
            signer,
            seed: Buffer.from(seed.substr(2), 'hex'),
            multiaddr: (multiaddr || ZeroNode.PRESETS.DEVNET)
        });
        logger_1.logger.info('done!');
        logger_1.logger.info('zerop2p address ' + chalk.bold(peer.peerId.toB58String()));
        return new this({
            consensus: new consensus_1.Consensus(),
            peer,
            signer
        });
    }
    constructor({ consensus, signer, peer }) {
        this._clientTopic = "zeronode.v1.inbound";
        Object.assign(this, {
            consensus,
            signer,
            peer,
            protocol: proto_1.protocol
        });
    }
    async init() {
        this.pool = memory_1.ZeroPool.init({}, this.peer, this.protocol);
        await this.peer.start();
        await new Promise((resolve) => this.peer.on("peer:discovery", async (peerInfo) => {
            logger_1.logger.info("found peer");
            resolve(undefined);
        }));
        await new Promise((resolve) => setTimeout(resolve, 10000));
    }
    async listenForMsg(topic) {
        await this.peer.pubsub.subscribe(topic, async (msg) => {
            //do work
        });
    }
    async startNode() {
        //TODO: implement
    }
    async stopNode() {
        //TODO: implement
    }
    async cleanup() {
        //TODO: implement
    }
    async ping() {
        await this.peer.pubsub.subscribe("zerodao.V1.pingpong", async (msg) => {
            logger_1.logger.info(`heard message ${msg}`);
            if (msg == "ping") {
                await this.peer.pubsub.publish("zerodao.V1.pingong", new TextEncoder().encode("pong"));
            }
        });
        logger_1.logger.info("\n gossiping ping to the network");
        await this.listenForPing();
    }
    async listenForPing() {
        logger_1.logger.info(`\n saying ping`);
        await this.peer.pubsub.publish("zerodao.V1.pingpong", new TextEncoder().encode("ping"));
    }
}
exports.ZeroNode = ZeroNode;
ZeroNode.PRESETS = {
    DEVNET: "",
};
//# sourceMappingURL=node.js.map