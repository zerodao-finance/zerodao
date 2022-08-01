"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = exports.PublishEventEmitter = void 0;
const peerId = require("peer-id");
const it_length_prefixed_1 = __importDefault(require("it-length-prefixed"));
const it_pipe_1 = __importDefault(require("it-pipe"));
const events_1 = require("events");
function defer() {
    let resolve, reject, promise;
    promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    return {
        resolve,
        reject,
        promise
    };
}
;
class PublishEventEmitter extends events_1.EventEmitter {
    toPromise() {
        const deferred = defer();
        this.on('finish', () => {
            deferred.resolve();
        });
        this.on('error', (e) => {
            deferred.reject(e);
        });
        return deferred.promise;
    }
}
exports.PublishEventEmitter = PublishEventEmitter;
class Request {
    static get PROTOCOL() { throw new Error('static get PROTOCOL() must be implemented'); }
    serialize() {
        throw new Error("Serialize must be implemented");
    }
    ;
    getChainId() {
        this.contractAddress;
        return;
    }
    async publish(peer) {
        const request = this.serialize();
        const result = new PublishEventEmitter();
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
                    result.emit('error', new Error(`Failed dialing keeper: ${keeper}`));
                }
            }
            result.emit('finish');
        })().catch((err) => result.emit('error', err));
        return result;
    }
}
exports.Request = Request;
//# sourceMappingURL=Request.js.map