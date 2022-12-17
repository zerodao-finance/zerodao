"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protocol = void 0;
const protobuf = require("protobufjs");
require("./ZeroProtocol.json");
exports.protocol = protobuf.Root.fromJSON(require("./ZeroProtocol"));
//# sourceMappingURL=proto.js.map
