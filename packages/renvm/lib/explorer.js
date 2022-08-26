"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.memoize = exports.explorer = void 0;
const axios_1 = __importDefault(require("axios"));
const immutable_1 = require("immutable");
const utils_1 = require("@renproject/utils");
const utils_2 = require("@renproject/utils");
const gatewayAddress_1 = require("./gatewayAddress");
const gHash_1 = require("./gHash");
const processDeposit_1 = require("./processDeposit");
const explorer = async (provider, asset, fromChain, toChain, from, to, nonce) => {
    // provider = type EthereumBaseChain
    // asset = "BTC or ZEC"
    // fromChain Bitcoin or Zcash class
    // from = { chain = "BTC" | "ZEC", type = "gatewayAddress" }
    // to = to Object
    //nonce = arrayified nonce
    const timeout = 120000;
    const blockStatePayload = await generatePayload("ren_queryBlockState", asset);
    const resp = await axios_1.default.post("https://rpc.renproject.io", blockStatePayload, { timeout });
    const { state } = resp.data.result;
    const getBlockState = await (0, exports.memoize)(utils_1.pack.unmarshal.unmarshalTypedPackValue(state));
    const blockState = await getBlockState();
    const shardKey = blockState[asset].shards[0].pubKey;
    let gHash = await (0, gHash_1.getGatewayHash)(provider, asset, to, provider.network, to.chain, nonce);
    //  const address = getGatewayAddress("BTC", { chain: "Bitcoin", type: "gatewayAddress"}, shardKey, gHash);
    const gatewayAddress = await (0, gatewayAddress_1.getGatewayAddress)(from, asset, from, shardKey, gHash);
    // fetchTxs
    const chain = fromChain.network.selector;
    const txs = await axios_1.default.get(`https://blockstream.info/api/address/${gatewayAddress}/txs`);
    const results = txs.map(tx => (0, processDeposit_1.processDeposit)(fromChain, toChain, {
        chain: chain,
        txid: utils_2.utils.toURLBase64(utils_2.utils.fromHex(tx.txid).reverse()),
        txHash: tx.txid,
        txindex: tx.txindex,
        explorerLink: fromChain.transactionExplorerLink({
            txHash: tx.txid
        }) || "",
        asset,
        amount: tx.amount
    }, asset, to, { shardKey }, nonce));
    results.map(result => console.log(result));
};
exports.explorer = explorer;
const generatePayload = (method, params) => ({
    id: 1,
    jsonrpc: "2.0",
    method,
    params
});
// used to create shard from asset
const memoize = (fn, { expiry = (5 * exports.sleep.MINUTES), entryLimit = 100 } = {
    expiry: (5 * exports.sleep.MINUTES),
    entryLimit: 100
}) => {
    const CacheRecord = (0, immutable_1.Record)({
        timestamp: 0,
        paramKey: null,
        result: null
    });
    let cacheMap = (0, immutable_1.OrderedMap)();
    return async (...params) => {
        const paramKey = JSON.stringify(params);
        const cachedResult = cacheMap.get(paramKey);
        const currentTime = Date.now() / 1000;
        if (cachedResult &&
            (expiry === false ||
                currentTime - cachedResult.get("timestamp") < expiry) &&
            cachedResult.get("paramKey") === paramKey) {
            return cachedResult.get("result");
        }
        else {
            const result = await fn(...params);
            // Update cache
            cacheMap = cacheMap.set(paramKey, CacheRecord({
                timestamp: Date.now() / 1000,
                paramKey,
                result
            }));
            if (cacheMap.size > entryLimit) {
                cacheMap = cacheMap.slice(-entryLimit);
            }
            return result;
        }
    };
};
exports.memoize = memoize;
const sleep = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};
exports.sleep = sleep;
exports.sleep.SECONDS = 1000;
exports.sleep.MINUTES = 60 * exports.sleep.SECONDS;
//# sourceMappingURL=explorer.js.map