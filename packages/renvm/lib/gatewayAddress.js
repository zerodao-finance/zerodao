"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGatewayAddress = void 0;
const btcScript_1 = require("./btcScript");
const btcChainUtils_1 = require("./btcChainUtils");
const getGatewayAddress = async (fromChain, asset, from, gPubKey, gHash) => {
    const gatewayAddress = await fromChain.addressFromBytes((0, btcScript_1.createAddressArray)((0, btcChainUtils_1.hash160)(gPubKey), gHash, fromChain.network.p2shPrefix));
    return gatewayAddress;
};
exports.getGatewayAddress = getGatewayAddress;
//# sourceMappingURL=gatewayAddress.js.map