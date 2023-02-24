"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPC = void 0;
const grpc_1 = require("grpc");
const node_events_1 = require("node:events");
const logger_1 = require("../logger");
const protobuf_1 = require("@zerodao/protobuf");
const chalk_1 = __importDefault(require("chalk"));
class RPC extends node_events_1.EventEmitter {
    static init() {
        return new RPC();
    }
    constructor() {
        super();
        this.self = undefined;
        this.service = undefined;
        this.pkg = undefined;
        this.proxy_peer = undefined;
        this.implementations = {};
        this.self = new grpc_1.Server();
        this.pkg = (0, grpc_1.loadPackageDefinition)(protobuf_1.packageDef);
        this.service = this.pkg.RpcService;
    }
    addService(proxy) {
        for (let i of proxy.serviceMethods) {
            this.implementations[i] = this.wrapServiceMethod(i, proxy);
        }
        this.self.addService(this.service.service, this.implementations);
    }
    start({ address, port } = {}) {
        this.self.bindAsync(`${address || RPC.LOCAL_ADDRESS}:${port || RPC.DEFAULT_PORT}`, grpc_1.ServerCredentials.createInsecure(), () => {
            this.self.start();
        });
        logger_1.logger.info(chalk_1.default.magenta(`${chalk_1.default.green("RPC Startup")}|=> server started...`));
    }
    stop() {
        this.self.stop();
        logger_1.logger.info("server stopped...");
    }
    wrapServiceMethod(methodName, proxy) {
        return (call, callback) => {
            this.emit(methodName, call.request);
            proxy[methodName](call, callback);
        };
    }
    handler(method, func) {
        this.on(method, func);
        return function unsubscribe(server) {
            logger_1.logger.info(`stopped handling ${method}`);
            server.off(method, func);
        };
    }
}
exports.RPC = RPC;
RPC.DEFAULT_PORT = "50051";
RPC.LOCAL_ADDRESS = "0.0.0.0";
RPC.ServiceCallbackWrapper = (returnMsg) => {
    return (call, callback) => {
        return returnMsg;
    };
};
const proxyAppTest = {
    checkTxSync: function (tx) {
        return [{ Code: 1, value: "something" }, null];
    }
};
(async () => {
    // let server = RPC.init();
    // let mp = new Mempool(0, proxyAppTest, { MAX_BYTES: 10000 });
    // let reactor = new MempoolReactor(mp);
    // server.addService(reactor)
    // server.start({ port: 50051 });
    // let unsubscribe = server.handler("zero_sendTransaction", (message) => logger.info('transaction recieved via gRPC'));
});
//# sourceMappingURL=rpc.js.map