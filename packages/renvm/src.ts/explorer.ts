import Axios from "axios";
import { OrderedMap, Record } from "immutable";
import { pack } from "@renproject/utils";
import { utils } from "@renproject/utils";
import { getGatewayAddress } from "./gatewayAddress";
import { getGatewayHash, getPayloadHash } from "./gHash";
import { processDeposit } from "./processDeposit";
import ethers from "ethers";
import BigNumber from "bignumber.js";
export const explorer = async (
  provider,
  asset,
  fromChain,
  toChain,
  from,
  to,
  nonce,
  amount
) => {
  // provider = type EthereumBaseChain
  // asset = "BTC or ZEC"
  // fromChain Bitcoin or Zcash class
  // from = { chain = "BTC" | "ZEC", type = "gatewayAddress" }
  // to = to Object
  //nonce = arrayified nonce
  const bigAmount = new BigNumber(amount);
  const timeout = 120000;
  const blockStatePayload = await generatePayload("ren_queryBlockState", {
    asset,
  });
  const resp = await Axios.post(
    "https://rpc.renproject.io",
    blockStatePayload,
    { timeout }
  );
  const { state } = resp.data.result;
  const getBlockState = await memoize(() =>
    pack.unmarshal.unmarshalTypedPackValue(state)
  );
  const blockState = await getBlockState();
  const shardKey = blockState[asset].shards[0].pubKey;
  /* becomes {
            gPubKey: utils.toURLBase64(pubKey),
        } 
        then shard in gateway
        then params.shard in gatewayTransaction
        in gatewayTransaction:
        gPubKey = utils.fromBase64(params.shard.gPubKey)
        then params.gpubkey in RenVMCrossChainTxSubmitter
        gpubkey = utils.toURLBase64(params.gpubkey)
        then to RenVMTxSubmitter:
        tx.in.gpubkey
        passed this way to generateTransactionHash
        */
  const gHash = await getGatewayHash(
    provider,
    asset,
    to,
    provider.network,
    to.chain,
    nonce
  );
  const pHash = await getPayloadHash(provider, asset, to, provider.network);
  //  const address = getGatewayAddress("BTC", { chain: "Bitcoin", type: "gatewayAddress"}, shardKey, gHash);
  const gatewayAddress = await getGatewayAddress(
    fromChain,
    asset,
    from,
    shardKey,
    gHash
  );
  // fetchTxs
  const chain = fromChain.network.selector;
  const resps: any = await Axios.get(
    `https://blockstream.info/api/address/${gatewayAddress}/txs`
  );
  const response = resps.data;
  const received = [];
  let latestBlock: BigNumber | undefined;
  for (const tx of response) {
    latestBlock = latestBlock || new BigNumber(await fetchHeight());
    for (let i = 0; i < tx.vout.length; i++) {
      const vout = tx.vout[i];
      received.push({
        txid: tx.txid,
        amount: vout.value.toString(),
        txindex: i.toString(),
        height: tx.status.confirmed ? tx.status.block_height.toString() : null,
      });
    }
  }

  const results = received.map((tx) => {
    try {
      processDeposit(
        fromChain,
        toChain,
        {
          chain: chain,
          txid: utils.toURLBase64(utils.fromHex(tx.txid).reverse()),
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
        shardKey,
        nonce,
        bigAmount,
        gHash,
        pHash
      );
    } catch (error) {}
  });
  return results;
};

const fetchHeight = async (): Promise<string> => {
  const response = await Axios.get<unknown>(getAPIUrl(`/blocks/tip/height`), {
    timeout: 30000,
  });
  return response.data.toString();
};

const getAPIUrl = (path: string): string => {
  return `https://blockstream.info/api${path}`;
};
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
  }
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
        })
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
