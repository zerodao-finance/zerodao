"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePubKeyScript = exports.createAddressArray = void 0;
const script_1 = require("./script");
const gatewayScript = (gGubKeyHash, gHash) => new script_1.Script()
    .addData(gHash)
    .addOp(script_1.Script.OP.OP_DROP)
    .addOp(script_1.Script.OP.OP_DUP)
    .addOp(script_1.Script.OP.OP_HASH160)
    .addData(gGubKeyHash)
    .addOp(script_1.Script.OP.OP_EQUALVERIFY)
    .addOp(script_1.Script.OP.OP_CHECKSIG);
const createAddressArray = (gGubKeyHash, gHash, prefix) => gatewayScript(gGubKeyHash, gHash).toAddress(prefix);
exports.createAddressArray = createAddressArray;
const calculatePubKeyScript = (gGubKeyHash, gHash) => gatewayScript(gGubKeyHash, gHash).toScriptHashOut();
exports.calculatePubKeyScript = calculatePubKeyScript;
//# sourceMappingURL=index.js.map