import { contractPayloadHandler } from "./payload/evmContractPayload";
import { generatePHash } from "@renproject/utils";
import { generateSHash } from "@renproject/utils";
import { utils } from "@renproject/utils";
import { generateGHash } from "@renproject/utils";
import { PayloadHandler } from "./payload/evmParams";

export const getGatewayHash = async (
  provider,
  asset,
  toObject,
  network,
  chain,
  nonce
) => {
  const EVMParams = await provider.getEVMParams(
    asset,
    "lock",
    "mint",
    "mint",
    {}
  );
  const getPayloadHandler = (payloadType: string): PayloadHandler<any> => {
    switch (payloadType) {
      case "contract":
        return contractPayloadHandler;
    }
  };
  const payload = await contractPayloadHandler.getPayload({
    network,
    signer: null,
    payload: toObject,
    evmParams: EVMParams,
    getPayloadHandler
  });
  const pHash = generatePHash(payload.payload);
  const sHash = generateSHash(`${asset}/to${chain}`);
  const _nonce =
    typeof nonce === "string"
      ? utils.fromBase64(nonce)
      : utils.toNBytes(nonce || 0, 32);

  const gHash = generateGHash(pHash, sHash, payload.toBytes, _nonce);
  return gHash;
};
