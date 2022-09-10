"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFixtureName = exports.getRenAssetName = exports.isZcashAddress = void 0;
const bytes_1 = require("@ethersproject/bytes");
const buffer_1 = require("buffer");
function isZcashAddress(hex) {
    return buffer_1.Buffer.from((0, bytes_1.hexlify)(hex).substr(2), "hex").toString("utf8")[0] === "t";
}
exports.isZcashAddress = isZcashAddress;
function getRenAssetName(request) {
    return isZcashAddress(request.destination) ? "renZEC" : "renBTC";
}
exports.getRenAssetName = getRenAssetName;
function toFixtureName(chainId) {
    switch (chainId) {
        case 1:
            return "ETHEREUM";
        case 137:
            return "MATIC";
        case 43114:
            return "AVALANCHE";
        case 42161:
            return "ARBITRUM";
        case 10:
            return "OPTIMISM";
    }
}
exports.toFixtureName = toFixtureName;
//# sourceMappingURL=util.js.map