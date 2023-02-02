import { loadPackageDefinition, Server, ServerCredentials } from "grpc";
import { EventEmitter } from "node:events";
import { logger } from "../logger";
import { protocol, packageDef } from "@zerodao/protobuf";
import { MempoolReactor } from "../mempool";
import chalk from "chalk";
import { Mempool } from "../mempool";

<<<<<<< HEAD
export class RPC extends EventEmitter {
=======
export class RPCServer extends EventEmitter {
>>>>>>> 17959a14 (basic state store and block store)
  self: any = undefined;

  service: any = undefined;
  pkg: any = undefined;
  proxy_peer: any = undefined;

  implementations = {};

  static DEFAULT_PORT: string = "50051";
  static LOCAL_ADDRESS: string = "0.0.0.0";

  static ServiceCallbackWrapper = (returnMsg) => {
    return (call, callback) => {
      return returnMsg;
    }
  }

  static init() {
    return new RPC();
  }

  constructor() {
    super();
    this.self = new Server();
<<<<<<< HEAD
    this.pkg = loadPackageDefinition(
      packageDef
    );
=======
  }

  start({ port }: any = {}) {
    this.pkg = loadPackageDefinition(packageDef);
>>>>>>> 17959a14 (basic state store and block store)

    this.service = this.pkg.RpcService;
  }

<<<<<<< HEAD
  addService(proxy) {
    for ( let i of proxy.serviceMethods ) {
      this.implementations[i] = this.wrapServiceMethod(i, proxy);
    }
    this.self.addService(this.service.service, this.implementations);
  }
=======
    this.self.addService((this.service as any).service, {
      zero_sendTransaction: this._handleTransaction,
      zero_getBalance: this._handleTransaction,
    });
>>>>>>> 17959a14 (basic state store and block store)

  start({ address, port }: any = {}) {
    this.self.bindAsync(
      `${address || RPC.LOCAL_ADDRESS}:${port || RPC.DEFAULT_PORT}`,
      ServerCredentials.createInsecure(),
      () => {
        this.self.start();
      }
    );

    logger.info(chalk.magenta(`${chalk.green("RPC Startup")}|=> server started...`));
  }

  stop() {
    this.self.stop();
    logger.info("server stopped...");
  }

  wrapServiceMethod(methodName, proxy) {
    return (call, callback) => {
      this.emit(methodName, call.request);
      proxy[methodName](call, callback); 
    }
  }

  handler(method: string, func: (message) => any) {
    this.on(method, func);
    return function unsubscribe(server: RPC) {
      logger.info(`stopped handling ${method}`);
      server.off(method, func);
    }
  }
}

const proxyAppTest = {
  checkTxSync: function (tx: Buffer) {
    return [{ Code: 1, value: "something" }, null]
  }
};

(async () =>  {
  // let server = RPC.init();
  // let mp = new Mempool(0, proxyAppTest, { MAX_BYTES: 10000 });
  // let reactor = new MempoolReactor(mp);

  // server.addService(reactor)
  // server.start({ port: 50051 });
  
  // let unsubscribe = server.handler("zero_sendTransaction", (message) => logger.info('transaction recieved via gRPC'));

})
