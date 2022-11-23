'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroNode = void 0;
const consensus_1 = require("./consensus");
const chalk = require("chalk");
const logger_1 = require("./logger");
const p2p_1 = require("@zerodao/p2p");
class ZeroNode {
    static async fromSigner(signer) {
        logger_1.logger.info('generating seed from secp256k1 signature');
        const seed = await signer.signMessage(p2p_1.ZeroP2P.toMessage(await signer.getAddress()));
        logger_1.logger.info('creating peer from seed, wait for complete ...');
        const peer = await p2p_1.ZeroP2P.fromSeed({
            signer,
            seed: Buffer.from(seed.substr(2), 'hex')
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
        Object.assign(this, {
            consensus,
            signer,
            peer
        });
    }
}
exports.ZeroNode = ZeroNode;
//# sourceMappingURL=node.js.map