"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTxHash = void 0;
const bitcore_lib_1 = __importDefault(require("bitcore-lib"));
function getTxHash(utxo, destination, amount, gateway) {
    // Create inputs
    const tx = new bitcore_lib_1.default.Transaction();
    tx.from(utxo);
    // Create outputs
    tx.to(destination, amount);
    tx.change(gateway);
    // pass hash of TX to FROST
    const hash = tx.getHash();
    return hash;
    // Print transaction
    console.log(tx.toString());
}
exports.getTxHash = getTxHash;
//# sourceMappingURL=bitcoin-utils.js.map