const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
import { Transaction } from "../../protobuf/generated/Transaction";
import { TransactionReply } from "../../protobuf/generated/TransactionReply";

export class Client {
  service: any = undefined;
  static PROTO_PATH: string = __dirname + "/../../../protobuf/proto/ZeroProtocol.proto";
  static URL: string = "0.0.0.0:50051";
  constructor(url?: string) {
    const packageDefinition = protoLoader.loadSync(Client.PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    let pkg = grpc.loadPackageDefinition(packageDefinition);

    this.service = new (pkg as any).RpcService(
      `${url || Client.URL}`,
      grpc.credentials.createInsecure()
    );
  }

  async handleTransaction(data: Transaction): Promise<TransactionReply> {
    return new Promise((resolve, reject) => {
      this.service.handleTransaction(
        data,
        (err: Error | string, response: TransactionReply) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    });
  }
}
