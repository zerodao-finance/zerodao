"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const peerId = require("peer-id");
const it_length_prefixed_1 = __importDefault(require("it-length-prefixed"));
const it_pipe_1 = __importDefault(require("it-pipe"));
class Request {
    constructor(params) {
    }
    serialize() {
        throw new Error("Serialize must be implemented");
    }
    ;
    async publish(peer) {
        const request = this.serialize();
        if (peer.keepers.length === 0) {
            console.error(`Cannot publish request if no keepers are found`);
        }
        try {
            for (const keeper of peer.keepers) {
                try {
                    const _peerId = await peerId.createFromB58String(keeper);
                    const { stream } = await peer.dialProtocol(_peerId, this.constructor().PROTOCOL);
                    (0, it_pipe_1.default)(request, it_length_prefixed_1.default.encode(), stream.sink);
                    console.info(`Published request to ${keeper}. Waiting for keeper confirmation.`);
                }
                catch (e) {
                    console.error(`Failed dialing keeper: ${keeper} for txDispatch`);
                    console.error(e.stack);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
Request.PROTOCOL = "/zero/1.1.0/dispatch";
exports.default = Request;
//# sourceMappingURL=Request.js.map