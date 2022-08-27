"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToRPC = exports.getPack = exports.processDeposit = void 0;
const utils_1 = require("@renproject/utils");
const inputAndOutputTypes_1 = require("./utils/inputAndOutputTypes");
const utils_2 = require("@renproject/utils");
const provider_1 = require("@renproject/provider");
const bignumber_js_1 = require("bignumber.js");
const axios_1 = __importDefault(require("axios"));
const unmarshal_1 = require("./utils/unmarshal");
const processDeposit = async (fromChain, toChain, inputTx, asset, to, shard, _nonce, amount) => {
    const newAmount = new bignumber_js_1.BigNumber(inputTx.amount);
    const nonce = utils_1.utils.toURLBase64(
    // Check if the deposit has an associated nonce. This will
    // be true for contract-based inputs.
    // Check if the params have a nonce - this can be
    // a base64 string or a number. If no nonce is set,
    // default to `0`.
    typeof _nonce === "string"
        ? utils_1.utils.fromBase64(_nonce)
        : utils_1.utils.toNBytes(_nonce || 0, 32));
    const { inputType, outputType, selector } = await (0, inputAndOutputTypes_1.getInputAndOutputTypes)({
        asset,
        fromChain,
        toChain
    });
    const payload = await toChain.getOutputPayload(asset, inputType, outputType, to);
    const nonceBytes = typeof nonce === "string"
        ? utils_1.utils.fromBase64(nonce)
        : utils_1.utils.toNBytes(nonce || 0, 32);
    const nHash = (0, utils_1.generateNHash)(nonceBytes, utils_1.utils.fromBase64(inputTx.txid), inputTx.txindex);
    const gPubKey = utils_1.utils.toURLBase64(shard);
    const pHash = (0, utils_1.generatePHash)(payload.payload);
    const sHash = (0, utils_2.generateSHash)(`${asset}/to${to.chain}`);
    const gHash = (0, utils_2.generateGHash)(pHash, sHash, payload.toBytes, nonceBytes);
    const postPayload = {
        id: 1,
        jsonrpc: "2.0",
        method: "ren_queryConfig",
        params: {}
    };
    const timeout = 120000;
    const queryConfig = utils_1.utils.memoize(async () => {
        const response = await axios_1.default.post("https://rpc.renproject.io", postPayload, { timeout });
        return response.data.result;
    });
    const RenVMConfig = await queryConfig();
    const config = RenVMConfig.network;
    const result = amount.c[0] == newAmount.c[0]
        ? await (0, exports.getPack)(selector, {
            txid: utils_1.utils.fromBase64(inputTx.txid),
            txindex: new bignumber_js_1.BigNumber(inputTx.txindex),
            amount: new bignumber_js_1.BigNumber(inputTx.amount),
            payload: payload.payload,
            phash: pHash,
            to: payload.to,
            nonce: nonceBytes,
            nhash: nHash,
            gpubkey: gPubKey,
            ghash: gHash
        }, config, inputTx.txHash)
        : "";
    return result;
};
exports.processDeposit = processDeposit;
const getPack = async (selector, params, config, txHash) => {
    //  console.log(params.payload);
    // console.log(utils.toURLBase64(params.payload))
    return await (0, exports.sendToRPC)({
        selector,
        in: {
            t: provider_1.crossChainParamsType,
            v: {
                txid: utils_1.utils.toURLBase64(params.txid),
                txindex: params.txindex.toFixed(),
                amount: params.amount.toFixed(),
                payload: utils_1.utils.toURLBase64(params.payload),
                phash: utils_1.utils.toURLBase64(params.phash),
                to: params.to,
                nonce: utils_1.utils.toURLBase64(params.nonce),
                nhash: utils_1.utils.toURLBase64(params.nhash),
                gpubkey: params.gpubkey,
                ghash: utils_1.utils.toURLBase64(params.ghash)
            }
        }
    }, txHash, config);
};
exports.getPack = getPack;
const sendToRPC = async (params, txHash, config) => {
    const version = "1";
    // console.log(params.selector)
    // console.log(params.in)
    const hash = utils_1.utils.toURLBase64((0, utils_2.generateTransactionHash)(version, params.selector, params.in));
    const array = (0, utils_2.generateTransactionHash)(version, params.selector, params.in);
    const postPayload = {
        id: 1,
        jsonrpc: "2.0",
        method: "ren_queryTx",
        params: { hash }
    };
    const timeout = 120000;
    const queryTx = await utils_1.utils.memoize(async () => {
        const response = await axios_1.default.post("https://rpc.renproject.io", postPayload, { timeout });
        return response.data.result;
    });
    const txResponse = await queryTx();
    console.log(txResponse);
    return;
    return txResponse.tx
        ? {
            tx: (0, unmarshal_1.unmarshalRenVMTransaction)(txResponse.tx),
            txStatus: txResponse.txStatus
        }
        : "";
};
exports.sendToRPC = sendToRPC;
//# sourceMappingURL=processDeposit.js.map