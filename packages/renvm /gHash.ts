import { EVMParam } from "packages/chains/chains-ethereum/src";
import { memoize } from "./explorer";
import { getRenAsset } from "packages/chains/chains-ethereum/src/utils/gatewayRegistry";
import { contractPayloadHandler } from "packages/chains/chains-ethereum/src/utils/payloads/evmContractPayload";
import { generatePHash } from "./utils/src";
import { generateSHash } from "./utils/src";
import { fromBase64, toNBytes, toURLBase64 } from "packages/utils/src/internal/common";
import { generateGHash, generateTransactionHash } from "./utils/src";

export const getGatewayHash = async (provider, asset, toObject, network, chain, nonce) => {
        const EVMParams = provider.getEVMParams(
            asset,
            "lock",
            "mint",
            "mint",
            {},
        );
        const getPayloadHandler = (payloadType: string) => {
            switch (payloadType) {
                case "contract":
                    return contractPayloadHandler;
            }
        };
        const payload = contractPayloadHandler.getPayload({
            network,
            signer: null,
            payload: toObject,
            evmParams: EVMParams,
            getPayloadHandler,
        });
        const pHash = generatePHash(payload.payload);
        const sHash = generateSHash(`${asset}/to${chain}`);
        const _nonce =
            typeof nonce === "string"
                ? fromBase64(nonce)
                : toNBytes(nonce || 0, 32);

        const gHash = generateGHash(pHash, sHash, payload.toBytes, _nonce);
        return gHash;
};

export const getTransactionHash = async (selector, in) => {
    const txHash = toURLBase64(
        generateTransactionHash("1", selector, in),
    );
}
