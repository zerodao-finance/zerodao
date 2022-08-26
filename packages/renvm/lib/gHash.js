"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGatewayHash = void 0;
const evmContractPayload_1 = require("./payload/evmContractPayload");
const utils_1 = require("@renproject/utils");
const utils_2 = require("@renproject/utils");
const utils_3 = require("@renproject/utils");
const utils_4 = require("@renproject/utils");
const getGatewayHash = async (provider, asset, toObject, network, chain, nonce) => {
    const EVMParams = await provider.getEVMParams(asset, "lock", "mint", "mint", {});
    const getPayloadHandler = (payloadType) => {
        switch (payloadType) {
            case "contract":
                return evmContractPayload_1.contractPayloadHandler;
        }
    };
    const payload = await evmContractPayload_1.contractPayloadHandler.getPayload({
        network,
        signer: null,
        payload: toObject,
        evmParams: EVMParams,
        getPayloadHandler
    });
    const pHash = (0, utils_1.generatePHash)(payload.payload);
    const sHash = (0, utils_2.generateSHash)(`${asset}/to${chain}`);
    const _nonce = typeof nonce === "string"
        ? utils_3.utils.fromBase64(nonce)
        : utils_3.utils.toNBytes(nonce || 0, 32);
    const gHash = (0, utils_4.generateGHash)(pHash, sHash, payload.toBytes, _nonce);
    return gHash;
};
exports.getGatewayHash = getGatewayHash;
//# sourceMappingURL=gHash.js.map