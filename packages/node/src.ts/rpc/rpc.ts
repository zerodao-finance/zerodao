"use strict"
const grpc = require("grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
import { TransactionService } from "./services";

export class RPCServer {

	self: any = undefined;
	path: string = __dirname + "/../../ZeroProtocol.proto";
	service: any = undefined;
	pkg: any = undefined;
	
	static PORT: string = "50051";

	static init() {
		return new RPCServer();
	}

	constructor() {
		this.self = new grpc.Server();
	}

	start({ port }: any = {}) {
		this.pkg = grpc.loadPackageDefinitions(protoLoader.loadSync(
			this.path,
			{
				keepCase: true,
				longs: String,
				enums: String,
				defualts: true,
				oneofs: true
			}
		));

		this.service = (this.pkg as any).ZeroRpcService;

		this.self.addService((this.service as any).service, TransactionService);

		this.self.bindAsync(`0.0.0.0:${port || RPCServer.PORT }`, grpc.ServerCredentials.createInsecure(), () => { this.self.start() });
		return { success: true };
	}
}
