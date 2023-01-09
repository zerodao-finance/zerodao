"use strict";
import { loadSync } from "@grpc/proto-loader";
import ZeroProtocol from "./ZeroProtocol.json";

const dir: string = __dirname + "/../proto/ZeroProtocol.proto";
export const packageDef = loadSync(dir,
	{
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true
});
export * from "../generated";

const protobuf = require("protobufjs");
import "./ZeroProtocol.json";
export const protocol = protobuf.Root.fromJSON(require("./ZeroProtocol"));
