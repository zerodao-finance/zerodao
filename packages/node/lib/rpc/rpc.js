"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCServer = void 0;
const grpc_1 = require("grpc");
const node_events_1 = require("node:events");
const logger_1 = require("../logger");
const protobuf_1 = require("@zerodao/protobuf");
class RPCServer extends node_events_1.EventEmitter {
    static init() {
        return new RPCServer();
    }
    constructor() {
        super();
        this.self = undefined;
        this.service = undefined;
        this.pkg = undefined;
        this.self = new grpc_1.Server();
    }
    start({ port } = {}) {
        this.pkg = (0, grpc_1.loadPackageDefinition)(protobuf_1.packageDef);
        this.service = this.pkg.RpcService;
        this.self.addService(this.service.service, {
            zero_sendTransaction: this._handleTransaction,
        });
        this.self.bindAsync(`0.0.0.0:${port || RPCServer.PORT}`, grpc_1.ServerCredentials.createInsecure(), () => {
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