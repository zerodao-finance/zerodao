"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCServer = void 0;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const EventEmitter = require("events");
const logger_1 = require("@zerodao/logger");
class RPCServer extends EventEmitter {
    constructor() {
        super();
        this.self = undefined;
        this.path = __dirname + "/../../proto/ZeroProtocol.proto";
        this.service = undefined;
        this.pkg = undefined;
        this.self = new grpc.Server();
    }
    static init() {
        return new RPCServer();
    }
    start({ port } = {}) {
        this.pkg = grpc.loadPackageDefinition(protoLoader.loadSync(this.path, {
            keepCase: true,
            longs: String,
            enums: String,
            defualts: true,
            oneofs: true,
        }));
        this.service = this.pkg.RpcService;
        this.self.addService(this.service.service, {
            zero_sendTransaction: this._handleTransaction
        });
        this.self.bindAsync(`0.0.0.0:${port || RPCServer.PORT}`, grpc.ServerCredentials.createInsecure(), () => {
            this.self.start();
        });
        return { success: true };
    }
    _handleTransaction(call, callback) {
        callback(null, (message) => {
            try {
                this._emit("zero_sendTransaction", message);
                return { status: 0 };
            }
            catch (error) {
                return { status: 1, errorMsg: new TextEncoder().encode(error.message) };
            }
        });
    }
    _emit(eventName, msg) {
        logger_1.logger.info(`EMIT: <${event},${msg}>`);
        super.emit(eventName, msg);
    }
}
exports.RPCServer = RPCServer;
RPCServer.PORT = "50051";
//# sourceMappingURL=rpc.js.map