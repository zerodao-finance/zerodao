const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader")
import { Transaction } from "../proto/Transaction";
import { TransactionReply } from "../proto/TransactionReply"



export class Client {
	service: any = undefined;
	static PROTO_PATH: string = __dirname + '/../../proto/ZeroProtocol.proto';
	static URL: string = '0.0.0.0:50051';
	constructor(url?: string) {
		const packageDefinition = protoLoader.loadSync(Client.PROTO_PATH, {
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true
		});

		let pkg = grpc.loadPackageDefinition(packageDefinition);

		this.service = new (pkg as any).RpcService(`${url || Client.URL}`, grpc.credentials.createInsecure());
	}

	async handleTransaction(data: Transaction): Promise<TransactionReply> {
		const reply = this.service.handleTransaction(data, (err: Error | string, response: any) => {
			if (err) throw err;
			return response;
		});
		const message = reply.call.call.pendingMessage.message;
		return message;
	}

}
