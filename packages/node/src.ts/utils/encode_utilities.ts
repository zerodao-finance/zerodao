import { protocol } from "@zerodao/protobuf";

export function encodeMessage(type: string, data: any) {
	let msg = protocol[`${type}`].fromObject( data );
	return protocol[`${type}`].encode(msg).finish();	
}

export function decodeMessage(type: string, buf: Buffer) {
	let decoded = protocol[`${type}`].decode(buf);
	return protocol[`${type}`].toObject(decoded, {
		enums: String,
		longs: String,
		bytes: String
	});
}
