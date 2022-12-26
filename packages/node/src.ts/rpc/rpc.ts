"use strict";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const EventEmitter = require("events");
import { UnaryCallHandler } from "./services";
import { logger } from "@zerodao/logger";
import { protocol } from "@zerodao/protobuf";

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
		this.self = new grpc.Server();
	}

	start({ port }: any = {}) {
		this.pkg = grpc.loadPackageDefinition(
			protoLoader.loadSync(this.path, {
				keepCase: true,
				longs: String,
				enums: String,
				defualts: true,
				oneofs: true,
			})
		);

		this.service = (this.pkg as any).RpcService;

		this.self.addService((this.service as any).service, {
			zero_sendTransaction: this._handleTransaction
		});

		this.self.bindAsync(
			`0.0.0.0:${port || RPCServer.PORT}`,
			grpc.ServerCredentials.createInsecure(),
			() => {
				this.self.start();
			}
		);
		return { success: true };
	}
	

	_handleTransaction (call: any, callback: any) {
		callback(null, (message) => {
			try {
				this._emit("zero_sendTransaction", message);
				return { status: 0 };
			} catch (error) {
				return { status: 1, errorMsg: new TextEncoder().encode(error.message) };
			}
		})
	}


	_emit(eventName, msg) {
		logger.info(`EMIT: <${event},${msg}>`);
		super.emit(eventName, msg);
	}

}
