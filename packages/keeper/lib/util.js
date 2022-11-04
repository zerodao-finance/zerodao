"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeToJSON = exports.handleRequestsV21 = exports.handleRequestsV2 = exports.handleRequestsV1 = exports.pipeToBuffer = exports.pipeToString = exports.advertiseAsKeeper = exports.fromJSONtoBuffer = void 0;
const bytes_1 = require("@ethersproject/bytes");
const it_length_prefixed_1 = __importDefault(require("it-length-prefixed"));
const it_pipe_1 = __importDefault(require("it-pipe"));
const KEEPER_INTERVAL = 30000;
function fromJSONtoBuffer(o) {
    return (0, bytes_1.arrayify)(Buffer.from(JSON.stringify(o), "utf8"));
}
exports.fromJSONtoBuffer = fromJSONtoBuffer;
const logger_1 = require("@zerodao/logger");
const logger = (0, logger_1.createLogger)(require("../package").name);
async function advertiseAsKeeper(p2p) {
    const interval = setInterval(async () => {
        try {
            await p2p.pubsub.publish("zero.keepers", fromJSONtoBuffer({ address: await p2p.addressPromise }));
        }
        catch (e) {
            console.error(e);
        }
    }, KEEPER_INTERVAL);
    return function unsubscribe() {
        clearInterval(interval);
    };
}
exports.advertiseAsKeeper = advertiseAsKeeper;
async function pipeToString(stream) {
    return await new Promise((resolve, reject) => {
        (0, it_pipe_1.default)(stream.source, it_length_prefixed_1.default.decode(), async (rawData) => {
            const string = [];
            try {
                for await (const msg of rawData) {
                    string.push(msg.toString());
                }
            }
            catch (e) {
                return reject(e);
            }
            resolve(string.join(""));
        });
    });
}
exports.pipeToString = pipeToString;
async function pipeToBuffer(stream) {
    return await new Promise((resolve, reject) => {
        (0, it_pipe_1.default)(stream.source, it_length_prefixed_1.default.decode(), async (rawData) => {
            const buffers = [];
            try {
                for await (const msg of rawData) {
                    buffers.push(msg);
                }
            }
            catch (e) {
                return reject(e);
            }
            resolve(Buffer.concat(buffers.map((v) => Buffer.from(v))));
        });
    });
}
exports.pipeToBuffer = pipeToBuffer;
function handleRequestsV1(p2p) {
    p2p.handle("/zero/1.1.0/dispatch", async (duplex) => {
        try {
            p2p.emit("zero:request:1.1.0", await pipeToString(duplex.stream));
        }
        catch (e) {
            p2p.emit("error", e);
        }
    });
}
exports.handleRequestsV1 = handleRequestsV1;
function handleRequestsV2(p2p) {
    p2p.handle("/zero/2.0.0/dispatch", async (duplex) => {
        try {
            p2p.emit("zero:request:2.0.0", await pipeToString(duplex.stream));
        }
        catch (e) {
            p2p.emit("error", e);
        }
    });
}
exports.handleRequestsV2 = handleRequestsV2;
function handleRequestsV21(p2p) {
    p2p.handle("/zero/2.1.0/dispatch", async (duplex) => {
        try {
            p2p.emit("zero:request:2.1.0", await pipeToBuffer(duplex.stream));
        }
        catch (e) {
            p2p.emit("error", e);
        }
    });
}
exports.handleRequestsV21 = handleRequestsV21;
function serializeToJSON(request) {
    return JSON.stringify(request.constructor.FIELDS.reduce((r, v) => {
        r[v] = request[v];
        return r;
    }, {}));
}
exports.serializeToJSON = serializeToJSON;
//# sourceMappingURL=util.js.map