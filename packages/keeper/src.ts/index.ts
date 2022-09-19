import { InfuraProvider } from "@ethersproject/providers";
import { getAddress } from "@ethersproject/address";
import { Interface } from "@ethersproject/abi";
import constants from "@ethersproject/constants";
import { Wallet } from "@ethersproject/wallet";
import { ZeroP2P } from "@zerodao/p2p";
import { CHAINS } from "@zerodao/chains";
import { deserialize, Request, BurnRequest } from "@zerodao/request";
import { ZeroWebhook } from "@zerodao/webhook";
import { advertiseAsKeeper, handleRequestsV1, handleRequestsV2, handleRequestsV21, serializeToJSON } from "./util";
import Redis from "ioredis";
const redis = new Redis();
// const redis = require('ioredis')(process.env.REDIS_URI);

import util from "util";
import { createLogger } from "@zerodao/logger";
const packageJson = require("../package");
const logger = createLogger(packageJson.name);

const encodeBurnRequest = (request) => {
  const contractInterface = new Interface([
    "function burn(address, address, uint256, uint256, bytes, bytes, bytes)",
  ]);
  return contractInterface.encodeFunctionData("burn", [
    request.owner,
    request.asset,
    request.amount,
    request.deadline,
    request.data,
    request.destination,
    request.signature,
  ]);
};

async function handleEvent(data) {
  try {
    const request = JSON.parse(data);
    logger.info(util.inspect(request, { colors: true, depth: 2 }));
    if (typeof request.destination === "string") {
      // For Explorer API
      if (process.env.WEBHOOK_BASEURL) {
        const webhook = new ZeroWebhook({
          signer: process.env.WALLET
            ? new Wallet(process.env.WALLET)
            : Wallet.createRandom(),
          baseUrl: process.env.WEBHOOK_BASEURL,
        });
        webhook
          .send("/transaction?type=burn", new BurnRequest(request))
          .catch((err) => logger.error(err));
      } else {
        logger.error("Webhook environment variable not set up.");
      }

      await redis.lpush(
        "/zero/dispatch",
        JSON.stringify(
          {
            to: getAddress(request.contractAddress),
            chainId: Request.addressToChainId(request.contractAddress),
            data: encodeBurnRequest(request),
          },
          null,
          2
        )
      );
    } else {
      await redis.lpush(
        "/zero/pending",
        JSON.stringify({ ...request, timestamp: new Date().getTime() }, null, 2)
      );
    }
    await redis.lpush("/zero/request", data);
  } catch (e) {
    console.error(e);
  }
}

export const runKeeper = () => {
  (async () => {
    logger.info("keeper process started");
    const signer = new Wallet(process.env.WALLET).connect(
      new InfuraProvider("mainnet", CHAINS[1].rpcUrl)
    );
    console.log(process.env.SIGNALLING_SERVER);
    const peer = await ZeroP2P.fromPassword({
      signer,
      password: await signer.getAddress(),
      multiaddr: process.env.SIGNALLING_SERVER || "MAINNET",
    });

    await peer.start();

    handleRequestsV1(peer);
    handleRequestsV2(peer);
    handleRequestsV21(peer);

    peer.on("peer:discovery", (peerInfo) => {
      logger.info("peer:discovery");
      logger.info(JSON.stringify(peerInfo, null, 2));
    });

    peer.on("zero:request:1.1.0", async (data) => {
      await handleEvent(data);
    });

    peer.on("zero:request:2.0.0", async (data) => {
      await handleEvent(data);
    });
    peer.on("zero:request:2.1.0", async (data) => {
      await handleEvent(serializeToJSON(deserialize(data)));
    });
    peer.on("error", logger.error.bind(logger));

    advertiseAsKeeper(peer);
  })().catch(logger.error.bind(logger));
};
