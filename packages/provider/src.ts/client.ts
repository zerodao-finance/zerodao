import grpc from "@grpc/grpc-js"; 
import protoLoader from "@grpc/proto-loader"
import { Transaction } from "../proto/Transaction";
import { TransactionReply } from "../proto/TransactionReply"



export class Client {
	service: any = undefined;
	static PROTO_PATH: string = __dirname + '/../proto/ZeroProtocol.proto';
	static PORT: string = "50051";
	static SERVER: string = '0.0.0.0';
	constructor({ port, server }: any = {}) {
		const packageDefinition = protoLoader.loadSync(Client.PROTO_PATH, {
			keepCase: true,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true
		  });

		let pkg = grpc.loadPackageDefinition(packageDefinition);

		this.service = new (pkg as any).RpcService(`${server || Client.SERVER}:${port || Client.PORT}`, grpc.credentials.createInsecure());
	}
	
	async handleTransaction(data: Transaction): Promise<TransactionReply> {
		const reply = this.service.handleTransaction(data, (err: Error | string, response: any) => { 
			if (err) throw err;
			return response;
		});
		return reply;
	}

}
