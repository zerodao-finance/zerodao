import { utils, generatePHash, generateNHash } from "packages/utils/src";
import { getInputAndOutputTypes } from "packages/ren/src/utils/inputAndOutputTypes";
import { generateGHash, generateSHash, generateTransactionHash } from "./utils/src";
import { crossChainParamsType } from "packages/provider/src";
import { BigNumber } from "bignumber.js";
import axios from "axios"
export const processDeposit = async (fromChain, toChain, inputTx, asset, to, shard, _nonce) => {
    const nonce = utils.toURLBase64(
        // Check if the deposit has an associated nonce. This will
        // be true for contract-based inputs.
        // Check if the params have a nonce - this can be
            // a base64 string or a number. If no nonce is set,
            // default to `0`.
            typeof _nonce === "string"
            ? utils.fromBase64(_nonce)
            : utils.toNBytes(_nonce || 0, 32),
    );
    const { inputType, outputType, selector } =
    await getInputAndOutputTypes({
        asset,
        fromChain,
        toChain,
    });
    const params = {
        asset,
        fromTx: inputTx,
        to,
        shard,
        nonce,
    };
    let payload = await toChain.getOutputPayload(
        asset,
        inputType,
        outputType,
        to,
    );
    const nonceBytes: Uint8Array =
            typeof nonce === "string"
                ? utils.fromBase64(nonce)
                : utils.toNBytes(nonce || 0, 32);

    const nHash = generateNHash(
        nonceBytes,
        utils.fromBase64(inputTx.txid),
        inputTx.txindex,
    );
    const gPubKey = utils.fromBase64(shard);
    const pHash = generatePHash(payload.payload);
    const sHash = generateSHash(
        `${asset}/to${to.chain}`,
    );
    const gHash = generateGHash(
        pHash,
        sHash,
        payload.toBytes,
        nonceBytes,
    );
    const postPayload =  {
        id: 1,
        jsonrpc: "2.0",
        method: "ren_queryConfig",
        params: {}
     }
     const timeout = 1200000
    const queryConfig = utils.memoize(
        async () => {
        const response = await axios.post<JSONRPCResponse<any>>("https://rpc.renproject.io", postPayload, { timeout });
        return response.data.result;
        }
        
    );
    const RenVMConfig = await queryConfig();
    const config = RenVMConfig.network;
   return await getPack(
        selector,
        {
            txid: utils.fromBase64(inputTx.txid),
            txindex: new BigNumber(inputTx.txindex),
            amount: new BigNumber(inputTx.amount),
            payload: payload.payload,
            phash: pHash,
            to: payload.to,
            nonce: nonceBytes,
            nhash: nHash,
            gpubkey: gPubKey,
            ghash: gHash,
        },
        config,
    );
}
export const getPack = async (selector, params, config) => {
  return await sendToRPC({
        selector,
        in: {
            t: crossChainParamsType,
            v: {
                txid: utils.toURLBase64(params.txid),
                txindex: params.txindex.toFixed(),
                amount: params.amount.toFixed(),
                payload: utils.toURLBase64(params.payload),
                phash: utils.toURLBase64(params.phash),
                to: params.to,
                nonce: utils.toURLBase64(params.nonce),
                nhash: utils.toURLBase64(params.nhash),
                gpubkey: utils.toURLBase64(params.gpubkey),
                ghash: utils.toURLBase64(params.ghash),
            },
        },
    }, 
    config)
}
export const sendToRPC = async (params, config) => {
    const version = "1";
    const hash = utils.toURLBase64(
        generateTransactionHash(version, params.selector, params.in),
    );
    const tx = {
        ...params,
        version,
        hash,
    };
    const postPayload =  {
        id: 1,
        jsonrpc: "2.0",
        method: "ren_queryTx",
        params: { hash }
     }
     const timeout = 120000;
    const queryTx = utils.memoize(
        async () => {
        const response = await axios.post<JSONRPCResponse<any>>("https://rpc.renproject.io", postPayload, { timeout });
        return response.data.result;
        }
        
    );
    const txResult = await queryTx();
    return txResult;
}
export type JSONRPCResponse<T> =
    |  {
          jsonrpc: string;
          version: string;
          result: T;
          error: undefined;
          id: number;
      }
    | {
          jsonrpc: string;
          version: string;
          result: undefined;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          error: any;
          id: number;
      };
