"use strict";
//// ZeroP2P Netoworking Layer for ZeroNode
//
//
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.initNode = void 0;
const node_1 = require("./node");
async function initNode(signer) {
    return await node_1.ZeroNode.fromSigner(signer);
}
exports.initNode = initNode;
//# sourceMappingURL=networking.js.map