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
    async pingpong() {
        this.peer.pubsub.subscribe('zerodao.V1.pingpong');
        this.peer.pubsub.on("zerodao.V1.pingpong", (data) => {
            console.log(new TextDecoder().decode(data));
            this.peer.pubsub.unsubscribe('zerodao.V1.pingpong');
            setTimeout(this.pingpong, 4000);
        });
        console.log("ping");
        this.peer.pubsub.publish('zerodao.V1.pingpong', new TextEncoder().encode("ping"));
    }
}
exports.ZeroNode = ZeroNode;
ZeroNode.PRESETS = {
    DEVNET: "",
};
//# sourceMappingURL=node.js.map