"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTxDetails = void 0;
const chains_1 = require("@renproject/chains");
const utils_1 = require("@renproject/utils");
const axios_1 = __importDefault(require("axios"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const processDeposit_1 = require("./processDeposit");
const getTxDetails = async (chain, params, asset, selector) => {
    const fromChain = chain == "Bitcoin"
        ? new chains_1.Bitcoin({ network: "mainnet" })
        : new chains_1.Zcash({ network: "mainnet" });
    const txid = params.txid;
    const txindex = params.txindex;
    const amount = params.amount;
    const nonce = params.nonce;
    const tx = params;
    const result = await fromChain.Transaction(tx);
    const input = result.params.tx;
    console.log(input);
    const formatted = await runThroughUtils(input);
    const end = await (0, processDeposit_1.getPack)(selector, formatted);
    return end;
    // const next = nextStep(result);
    //const deposit = processSend(chain, next, asset);
    // processDeposit(deposit, nonce);
};
exports.getTxDetails = getTxDetails;
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
    const txid = await utils_1.utils.fromBase64(params.txid);
    const txindex = await new bignumber_js_1.default(params.txindex);
    const amount = await new bignumber_js_1.default(params.amount);
    const payload = await utils_1.utils.fromBase64(params.payload);
    const phash = await utils_1.utils.fromBase64(params.phash);
    const to = params.to;
    const nonce = await utils_1.utils.fromBase64(params.nonce);
    const nhash = await utils_1.utils.fromBase64(params.nhash);
    const gpubkey = await utils_1.utils.fromBase64(params.gpubkey);
    const ghash = await utils_1.utils.fromBase64(params.ghash);
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
    const utxo = await axios_1.default.get(`https://blockstream.info/api/tx/${inputTx.txHash}`);
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
        txid: utils_1.utils.toURLBase64(utils_1.utils.fromHex(params.txid).reverse()),
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
    const queryTx = await utils_1.utils.memoize(async () => {
        const response = await axios_1.default.post("https://rpc.renproject.io", postPayload, { timeout });
        return response.data.result;
    });
    const tx = await queryTx();
    return tx;
};
//# sourceMappingURL=transaction.js.map