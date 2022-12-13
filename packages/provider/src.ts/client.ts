"use strict";
const grpc = require("@grpc/grpc-js"); 
const protoLoader = require("@grpc/proto-loader");

interface TransactionRequest {
	name: string;
	data: string;
}

interface TransactionResponse {
	status: number;
}

export class Client {
	service: any = undefined;
	static PATH: string = __dirname + "/../proto/BufferDeclr.proto";
	static PORT: string = "50052";

	constructor({ port }: any = {}) {
		let pkg = grpc.loadPackageDefinition(protoLoader.loadSync(
			Client.PATH,
			{
				keepCase: true,
				longs: String,
				enums: String,
				defaults: true,
				oneofs: true
			}
		));
		this.service = new (pkg as any).TransactionService(`0.0.0.0:${port || Client.PORT}`, grpc.credentials.createInsecure());
	}
	
	async getTransaction(data: TransactionRequest) {
		await this.service.getTransaction(data, (err: Error | string, response: any) => { 
			if (err) throw err;
			console.log(response);
		})
	}

}
