'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroNode = void 0;
const consensus_1 = require("./consensus");
const chalk = require("chalk");
const logger_1 = require("./logger");
const p2p_1 = require("@zerodao/p2p");
const protobufjs_1 = require("protobufjs");
const mempool_1 = require("./mempool");
class ZeroNode extends p2p_1.ZeroP2P {
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
        this._clientTopic = "zeronode.v1.inbound";
        Object.assign(this, {
            consensus,
            signer,
            peer
        });
        this.buf = protobufjs_1.protobuf.load("../proto/ZeroProtocol.proto");
        this._pool = mempool_1.ZeroPool.initialize({});
    }
    async _listenForClient() {
        if (!this._isValidator)
            return;
        await _this.pubsub.subscribe(this._clientTopic, async (message) => {
            await this._decodeMsg(message, 'Transaction');
            await this._pool._addTx(message);
        });
    }
    async _sendMessage(topic, messageType, message) {
        const data = await this._encodeMsg(message, messageType);
        await this.pubsub.publish(topic, data);
    }
    //decode message from buffer to json
    async _decodeMsg(message, type) {
        const _type = this.buf.lookupType(`${type}`);
        return _type.decode(message);
    }
    //encode message to protobuf type
    async _encodeMsg(message, type) {
        const _type = this.buf.lookupType(`${type}`);
        return _type.encode(message).finish();
    }
}
exports.ZeroNode = ZeroNode;
//# sourceMappingURL=node.js.map