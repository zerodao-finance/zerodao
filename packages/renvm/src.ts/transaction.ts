import { Bitcoin, Zcash } from "@renproject/chains";
import { JSONRPCResponse } from "./processDeposit";
import { memoize } from "./explorer";
import { utils } from "@renproject/utils";
import axios from "axios";
import BigNumber from "bignumber.js";
import { getPack } from "./processDeposit";
import { EndOfLineState } from "typescript";

export const getTxDetails = async (chain, params, asset, selector) => {
  const fromChain =
    chain == "Bitcoin"
      ? new Bitcoin({ network: "mainnet" })
      : new Zcash({ network: "mainnet" });
  const txid = params.txid;
  const txindex = params.txindex;
  const amount = params.amount;
  const nonce = params.nonce;
  const tx = params;
  const result: any = await fromChain.Transaction(tx);
  const input = result.params.tx;
  console.log(input);
  const formatted = await runThroughUtils(input);
  const end = await getPack(selector, formatted);
  return end;
  // const next = nextStep(result);
  //const deposit = processSend(chain, next, asset);
  // processDeposit(deposit, nonce);
};
/* {
    txid: Uint8Array;
    txindex: BigNumber;
    amount: BigNumber;
    payload: Uint8Array;
    phash: Uint8Array;
    to: string;
    nonce: Uint8Array;
    nhash: Uint8Array;
    gpubkey: Uint8Array;
    ghash: Uint8Array;
  } */
const runThroughUtils = async (params) => {
  const txid: Uint8Array = await utils.fromBase64(params.txid);
  const txindex = await new BigNumber(params.txindex);
  const amount = await new BigNumber(params.amount);
  const payload: Uint8Array = await utils.fromBase64(params.payload);
  const phash: Uint8Array = await utils.fromBase64(params.phash);
  const to = params.to;
  const nonce: Uint8Array = await utils.fromBase64(params.nonce);
  const nhash: Uint8Array = await utils.fromBase64(params.nhash);
  const gpubkey: Uint8Array = await utils.fromBase64(params.gpubkey);
  const ghash: Uint8Array = await utils.fromBase64(params.ghash);
  const formatted = {
    txid,
    txindex,
    amount,
    payload,
    phash,
    to,
    nonce,
    nhash,
    gpubkey,
    ghash,
  };
  return formatted;
};
const nextStep = async (fromPayload) => {
  const inputTx = fromPayload.params.tx;

  const utxo: any = await axios.get(
    `https://blockstream.info/api/tx/${inputTx.txHash}`
  );

  return {
    txid: inputTx.txid,
    amount: utxo.vout[parseInt(inputTx.txindex, 10)].value.toString(),
    txindex: inputTx.txindex,
    height: utxo.status.confirmed ? utxo.status.block_height.toString() : null,
    explorerLink: inputTx.explorerLink,
  };
};

const processSend = async (chain, params, asset) => {
  return {
    chain,
    txid: utils.toURLBase64(utils.fromHex(params.txid).reverse()),
    txHash: params.txid,
    txindex: params.txindex,
    explorerLink: params.explorerLink,

    asset,
    amount: params.amount,
  };
};

/* const processDeposit = async (inputTx) => {
  const nonce = utils.toURLBase64(
    // Check if the deposit has an associated nonce. This will
    // be true for contract-based inputs.
    inputTx.nonce
      ? utils.fromBase64(inputTx.nonce)
      : // Check if the params have a nonce - this can be
      // a base64 string or a number. If no nonce is set,
      // default to `0`.
      typeof baseNonce === "string"
      ? utils.fromBase64(baseNonce)
      : utils.toNBytes(baseNonce || 0, 32)
  );
}; */

const submitTxHash = async (hash) => {
  const postPayload = {
    id: 1,
    jsonrpc: "2.0",
    method: "ren_queryTx",
    params: { hash },
  };
  const timeout = 120000;
  const queryTx = await utils.memoize(async () => {
    const response = await axios.post<JSONRPCResponse<any>>(
      "https://rpc.renproject.io",
      postPayload,
      { timeout }
    );
    return response.data.result;
  });
  const tx = await queryTx();
  return tx;
};
