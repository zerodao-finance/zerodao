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
const address_1 = require("@ethersproject/address");
class Request {
    static addressToChainId(address) {
        return this.prototype.getChainId.call({
            contractAddress: address
        });
    }
    static get PROTOCOL() {
        throw new Error("static get PROTOCOL() must be implemented");
    }
    serialize() {
        throw new Error("Serialize must be implemented");
    }
    getChainId() {
        return Number(Object.keys(protocol_1.default).find((v) => Object.keys(protocol_1.default[v]).find((network) => Object.keys(protocol_1.default[v][network].contracts).find((contract) => ['BadgerBridgeZeroController', 'RenZECController', 'ZeroBTC'].includes(contract) && (0, address_1.getAddress)(protocol_1.default[v][network].contracts[contract].address) === (0, address_1.getAddress)(this.contractAddress)))) ||
            (() => {
                throw Error("Request#getChainId(): no contract found at " + this.contractAddress);
            })());
    }
    async publish(peer) {
        const request = this.serialize().toString('utf8');
        const result = new PublishEventEmitter_1.PublishEventEmitter();
        if (peer._keepers.length === 0) {
            setTimeout(() => result.emit("error", new Error("Cannot publish request if no keepers are found")), 0);
        }
        (async () => {
            for (const keeper of peer._keepers) {
                try {
                    const _peerId = await peerId.createFromB58String(keeper);
                    console.log([_peerId, this.constructor.PROTOCOL]);
                    console.log(request);
                    const { stream } = await peer.dialProtocol(_peerId, this.constructor.PROTOCOL);
                    (0, it_pipe_1.default)(request, it_length_prefixed_1.default.encode(), stream.sink);
                    result.emit("dialed", keeper);
                }
                catch (e) {
                    result.emit("error", e);
                }
            }
            result.emit("finish");
        })().catch((err) => result.emit("error", err));
        return result;
    }
}
exports.Request = Request;
//# sourceMappingURL=Request.js.map