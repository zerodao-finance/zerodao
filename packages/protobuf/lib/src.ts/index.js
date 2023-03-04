"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protocol = exports.packageDef = void 0;
const proto_loader_1 = require("@grpc/proto-loader");
const dir = __dirname + "/../proto/ZeroProtocol.proto";
exports.packageDef = (0, proto_loader_1.loadSync)(dir, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
__exportStar(require("../generated"), exports);
const protobuf = require("protobufjs");
require("./ZeroProtocol.json");
exports.protocol = protobuf.Root.fromJSON(require("./ZeroProtocol"));
//# sourceMappingURL=index.js.map