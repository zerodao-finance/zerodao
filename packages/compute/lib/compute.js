"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.btcAddressToHex = exports.getPNonce = exports.getNonce = exports.computeRandomValue = void 0;
const solidity_1 = require("@ethersproject/solidity");
const bytes_1 = require("@ethersproject/bytes");
const basex_1 = require("@ethersproject/basex");
function computeRandomValue(salt, address, timestamp) {
    return (0, solidity_1.keccak256)(["string", "address", "uint256"], ["/zero/1.0.0" + salt, address, timestamp]);
}
exports.computeRandomValue = computeRandomValue;
function getNonce(address, timestamp) {
    return this.computeRandomValue("nonce", address, timestamp);
}
exports.getNonce = getNonce;
function getPNonce(address, timestamp) {
    return this.computeRandomValue("pNonce", address, timestamp);
}
exports.getPNonce = getPNonce;
function btcAddressToHex(address) {
    return (0, bytes_1.hexlify)((() => {
        if (address.substring(0, 3) === "bc1") {
            return (0, bytes_1.arrayify)(Buffer.from(address, "utf8"));
        }
        else {
            return basex_1.Base58.decode(address);
        }
    })());
}
exports.btcAddressToHex = btcAddressToHex;
;
//# sourceMappingURL=compute.js.map