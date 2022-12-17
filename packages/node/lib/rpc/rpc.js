"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCServer = void 0;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const services_1 = require("./services");
class RPCServer {
  static init() {
    return new RPCServer();
  }
  constructor() {
    this.self = undefined;
    this.path = __dirname + "/../../proto/ZeroProtocol.proto";
    this.service = undefined;
    this.pkg = undefined;
    this.self = new grpc.Server();
  }
  start({ port } = {}) {
    this.pkg = grpc.loadPackageDefinition(
      protoLoader.loadSync(this.path, {
        keepCase: true,
        longs: String,
        enums: String,
        defualts: true,
        oneofs: true,
      })
    );
    this.service = this.pkg.RpcService;
    this.self.addService(this.service.service, services_1.TransactionService);
    this.self.bindAsync(
      `0.0.0.0:${port || RPCServer.PORT}`,
      grpc.ServerCredentials.createInsecure(),
      () => {
        this.self.start();
      }
    );
    return { success: true };
  }
}
exports.RPCServer = RPCServer;
RPCServer.PORT = "50051";
//# sourceMappingURL=rpc.js.map
