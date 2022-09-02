"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runKeeper = void 0;
const providers_1 = require("@ethersproject/providers");
const address_1 = require("@ethersproject/address");
const abi_1 = require("@ethersproject/abi");
const wallet_1 = require("@ethersproject/wallet");
const p2p_1 = require("@zerodao/p2p");
const chains_1 = require("@zerodao/chains");
const request_1 = require("@zerodao/request");
const webhook_1 = require("@zerodao/webhook");
const util_1 = require("./util");
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default();
// const redis = require('ioredis')(process.env.REDIS_URI);
const util_2 = __importDefault(require("util"));
const logger_1 = require("@zerodao/logger");
const packageJson = require("../package");
const logger = (0, logger_1.createLogger)(packageJson.name);
const encodeBurnRequest = (request) => {
    const contractInterface = new abi_1.Interface([
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
        logger.info(util_2.default.inspect(request, { colors: true, depth: 2 }));
        if (typeof request.destination === "string") {
            if (process.env.WEBHOOK_BASEURL) {
                const webhook = new webhook_1.ZeroWebhook({
                    signer: process.env.WALLET ? new wallet_1.Wallet(process.env.WALLET) : wallet_1.Wallet.createRandom(),
                    logger,
                    baseUrl: process.env.WEBHOOK_BASEURL
                });
                try {
                    await webhook.send(new request_1.BurnRequest(request));
                }
                catch (e) {
                    logger.error(e);
                }
            }
            await redis.lpush("/zero/dispatch", JSON.stringify({
                to: (0, address_1.getAddress)(request.contractAddress),
                chainId: request_1.Request.addressToChainId(request.contractAddress),
                data: encodeBurnRequest(request),
            }, null, 2));
        }
        else {
            await redis.lpush("/zero/pending", JSON.stringify({ ...request, timestamp: new Date().getTime() }, null, 2));
        }
        await redis.lpush("/zero/request", data);
    }
    catch (e) {
        console.error(e);
    }
}
const runKeeper = () => {
    (async () => {
        logger.info("keeper process started");
        const signer = new wallet_1.Wallet(process.env.WALLET).connect(new providers_1.InfuraProvider("mainnet", chains_1.CHAINS[1].rpcUrl));
        console.log(process.env.SIGNALLING_SERVER);
        const peer = await p2p_1.ZeroP2P.fromPassword({
            signer,
            password: await signer.getAddress(),
            multiaddr: process.env.SIGNALLING_SERVER || "MAINNET",
        });
        await peer.start();
        (0, util_1.handleRequestsV1)(peer);
        (0, util_1.handleRequestsV2)(peer);
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
        peer.on("error", logger.error.bind(logger));
        (0, util_1.advertiseAsKeeper)(peer);
    })().catch(logger.error.bind(logger));
};
exports.runKeeper = runKeeper;
//# sourceMappingURL=index.js.map