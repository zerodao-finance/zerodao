import Axios from "axios"
import { OrderedMap, Record } from "immutable";
import { unmarshalTypedPackValue } from "packages/utils/src/libraries/pack/unmarshal";
import { toURLBase64, fromHex } from "packages/utils/src/internal/common";
import { getGatewayAddress } from "./gatewayAddress";
import { getGatewayHash } from "./gHash";
import { processDeposit } from "./processDeposit";
export const explorer = async (provider, asset, fromChain, toChain from, to, nonce) => {
    // provider = type EthereumBaseChain
    // asset = "BTC or ZEC"
    // fromChain Bitcoin or Zcash class
    // from = { chain = "BTC" | "ZEC", type = "gatewayAddress" }
    // to = to Object
    //nonce = arrayified nonce
    const timeout = 120000
    const blockStatePayload = await generatePayload("ren_queryBlockState", asset)
    const resp = await Axios.post("https://rpc.renproject.io", blockStatePayload, { timeout })
    const { state } = resp.data.result;
    const getBlockState = memoize(unmarshalTypedPackValue(state));
    const blockState = await getBlockState(); 
    const shardKey = blockState[asset].shards[0].pubKey;
    let gHash = getGatewayHash(provider, asset, to, provider.network, to.chain, nonce)
     //  const address = getGatewayAddress("BTC", { chain: "Bitcoin", type: "gatewayAddress"}, shardKey, gHash);
     const gatewayAddress = getGatewayAddress(from, asset, from, shardKey, gHash);
     // fetchTxs
     const chain = fromChain.network.selector;
     try {
        const txs: any = await Axios.get(`https://blockstream.info/api/address/${gatewayAddress}/txs`);
        txs.map((tx) =>
            processDeposit(fromChain, toChain, {
                chain: chain,
                txid: toURLBase64(fromHex(tx.txid).reverse()),
                txHash: tx.txid,
                txindex: tx.txindex,
                explorerLink:
                    fromChain.transactionExplorerLink({
                        txHash: tx.txid,
                    }) || "",

                asset,
                amount: tx.amount,
            },
            asset,
            to,
            { shardKey },
            nonce),
        );
    } catch (error: unknown) {
        // Ignore error and fallback to getUTXOs.
    }
}

const generatePayload = (method: string, params?: unknown) => ({
    id: 1,
    jsonrpc: "2.0",
    method,
    params,
});

// used to create shard from asset
export const memoize = <Params extends unknown[], Result>(
    fn: (...params: Params) => Promise<Result>,
    { expiry = (5 * sleep.MINUTES) as number | false, entryLimit = 100 } = {
        expiry: (5 * sleep.MINUTES) as number | false,
        entryLimit: 100,
    },
): ((...params: Params) => Promise<Result>) => {
    interface CacheRecordInner {
        timestamp: number;
        paramKey: string;
        result: Result;
    }

    const CacheRecord = Record<CacheRecordInner>({
        timestamp: 0,
        paramKey: null as never,
        result: null as never,
    });

    let cacheMap = OrderedMap<string, Record<CacheRecordInner>>();

    return async (...params: Params): Promise<Result> => {
        const paramKey = JSON.stringify(params);
        const cachedResult = cacheMap.get(paramKey);
        const currentTime = Date.now() / 1000;
        if (
            cachedResult &&
            (expiry === false ||
                currentTime - cachedResult.get("timestamp") < expiry) &&
            cachedResult.get("paramKey") === paramKey
        ) {
            return cachedResult.get("result");
        } else {
            const result = await fn(...params);

            // Update cache
            cacheMap = cacheMap.set(
                paramKey,
                CacheRecord({
                    timestamp: Date.now() / 1000,
                    paramKey,
                    result,
                }),
            );
            if (cacheMap.size > entryLimit) {
                cacheMap = cacheMap.slice(-entryLimit);
            }

            return result;
        }
    };
};

export const sleep = async (ms: number): Promise<void> => {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });
};
sleep.SECONDS = 1000;
sleep.MINUTES = 60 * sleep.SECONDS;

