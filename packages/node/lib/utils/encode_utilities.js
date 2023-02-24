"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeMessage = exports.encodeMessage = void 0;
const protobuf_1 = require("@zerodao/protobuf");
function encodeMessage(type, data) {
    let msg = protobuf_1.protocol[`${type}`].fromObject(data);
    return protobuf_1.protocol[`${type}`].encode(msg).finish();
}
exports.encodeMessage = encodeMessage;
function decodeMessage(type, buf) {
    let decoded = protobuf_1.protocol[`${type}`].decode(buf);
    return protobuf_1.protocol[`${type}`].toObject(decoded, {
        enums: String,
        longs: String,
        bytes: String
    });
}
exports.decodeMessage = decodeMessage;
//# sourceMappingURL=encode_utilities.js.map