import { loadPackageDefinition, Server, ServerCredentials } from "grpc";
import { loadSync } from "@grpc/proto-loader";
import { EventEmitter } from "node:events";
import type { UnaryCallHandler } from "./services";
import { logger } from "../logger";

export class RPCServer extends EventEmitter {
  self: any = undefined;
  path: string = __dirname + "/../../proto/ZeroProtocol.proto";
  service: any = undefined;
  pkg: any = undefined;

  static PORT: string = "50051";

  static init() {
    return new RPCServer();
  }

  constructor() {
    super();
    this.self = new Server();
  }

  start({ port }: any = {}) {
    this.pkg = loadPackageDefinition(
      loadSync(this.path, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      })
    );

    this.service = (this.pkg as any).RpcService;

    this.self.addService((this.service as any).service, {
      zero_sendTransaction: this._handleTransaction,
    });

    this.self.bindAsync(
      `0.0.0.0:${port || RPCServer.PORT}`,
      ServerCredentials.createInsecure(),
      () => {
        this.self.start();
      }
    );
    return { success: true };
  }

  // handle zero_sendTransaction gRPC request
  _handleTransaction: UnaryCallHandler = (message: any, callback: any) => {
    callback(null, () => {
      try {
        this._emit("zero_sendTransaction", message);
        return { status: 0 };
      } catch (error) {
        return { status: 1, errorMsg: new TextEncoder().encode(error.message) };
      }
    });
  };

  _emit(eventName, msg) {
    logger.info(`EMIT: <${event},${msg}>`);
    super.emit(eventName, msg);
  }
}
