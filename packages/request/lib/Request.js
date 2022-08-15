"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const peerId = require("peer-id");
const it_length_prefixed_1 = __importDefault(require("it-length-prefixed"));
const it_pipe_1 = __importDefault(require("it-pipe"));
const PublishEventEmitter_1 = require("./PublishEventEmitter");
const protocol_1 = __importDefault(require("@zerodao/protocol"));
class Request {
    static get PROTOCOL() { throw new Error('static get PROTOCOL() must be implemented'); }
    serialize() {
        throw new Error("Serialize must be implemented");
    }
    ;
    getChainId() {
        return Number(Object.keys(protocol_1.default).find((v) => Object.keys(protocol_1.default[v]).find((network) => Object.keys(protocol_1.default[v][network].contracts).find((contract) => protocol_1.default[v][network].contracts[contract].address === this.contractAddress))) || (() => { throw Error('Request#getChainId(): no contract found at ' + this.contractAddress); })());
    }
    async publish(peer) {
        const request = this.serialize();
        const result = new PublishEventEmitter_1.PublishEventEmitter();
        if (peer.keepers.length === 0) {
            setImmediate(() => result.emit('error', new Error('Cannot publish request if no keepers are found')));
        }
        (async () => {
            for (const keeper of peer.keepers) {
                try {
                    const _peerId = await peerId.createFromB58String(keeper);
                    const { stream } = await peer.dialProtocol(_peerId, this.constructor().PROTOCOL);
                    (0, it_pipe_1.default)(request, it_length_prefixed_1.default.encode(), stream.sink);
                    result.emit('dialed', keeper);
                }
                catch (e) {
                    result.emit('error', new Error(`failed dialing keeper: ${keeper}`));
                }
            }
            result.emit('finish');
        })().catch((err) => result.emit('error', err));
        return result;
    }
}
exports.Request = Request;
//# sourceMappingURL=Request.js.map