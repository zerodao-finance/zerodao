"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PendingProcess = void 0;
const util_1 = __importDefault(require("util"));
const buffer_1 = require("buffer");
const BTCHandler_1 = require("send-crypto/build/main/handlers/BTC/BTCHandler");
const wallet_1 = require("@ethersproject/wallet");
const chains_bitcoin_1 = require("@renproject/chains-bitcoin");
const bytes_1 = require("@ethersproject/bytes");
const address_1 = require("@ethersproject/address");
const constants_1 = require("@ethersproject/constants");
const request_1 = require("@zerodao/request");
const webhook_1 = require("@zerodao/webhook");
const { getUTXOs } = BTCHandler_1.BTCHandler;
const getZcashUTXOs = async (testnet, { confirmations, address }) => {
    const zcash = new chains_bitcoin_1.Zcash({ network: Boolean(testnet) ? 'testnet' : 'mainnet' });
    const utxos = await zcash.api.fetchUTXOs(address);
    return utxos.filter((v) => v.height !== null);
};
const isZcashAddress = (hex) => ((hex) => hex.substr(0, 2) === '0x' ? buffer_1.Buffer.from((0, bytes_1.hexlify)(hex).substr(2), 'hex').toString('utf8').substr(0, 1) === 't' : hex.substr(0, 2) === 'zs' || hex.substr(0, 1) === 't')(buffer_1.Buffer.isBuffer(hex) ? '0x' + hex.toString('hex') : hex);
const cache = {};
const VAULT_DEPLOYMENTS = {
    [constants_1.AddressZero]: 1
};
const getGateway = async (request) => {
    const { nonce } = request;
    if (cache[nonce])
        return cache[nonce];
    else {
        cache[nonce] = await new request_1.TransferRequest(request).submitToRenVM();
        return cache[nonce];
    }
};
const addHexPrefix = (s) => (s.substr(0, 2) === "0x" ? s : "0x" + s);
const stripHexPrefix = (s) => (s.substr(0, 2) === "0x" ? s.substr(2) : s);
const getBTCBlockNumber = async () => 0; // unused anyway
const lodash = require("lodash");
const seen = {};
const logGatewayAddress = (logger, v) => {
    if (!seen[v])
        logger.info("gateway: " + v);
    seen[v] = true;
};
const MS_IN_DAY = 86400000;
class PendingProcess {
    constructor({ redis, logger }) {
        this.redis = redis;
        this.logger = logger;
    }
    async runLoop() {
        while (true) {
            await this.run();
            await this.timeout(1000);
        }
    }
    async run() {
        // process first item in list
        for (let i = 0; i < await this.redis.llen('/zero/pending'); i++) {
            try {
                const item = await this.redis.lindex("/zero/pending", i);
                const transferRequest = JSON.parse(item);
                const daysElapsed = Math.floor((new Date().getTime() - transferRequest.timestamp) / MS_IN_DAY);
                if (daysElapsed >= 2) {
                    const removed = await this.redis.lrem("/zero/pending", 1, item);
                    if (removed)
                        i--;
                    continue;
                }
                const gateway = await getGateway(transferRequest);
                logGatewayAddress(this.logger, gateway.gatewayAddress);
                const blockNumber = await getBTCBlockNumber();
                const utxos = isZcashAddress(gateway.gatewayAddress) ? await getZcashUTXOs(false, {
                    address: gateway.gatewayAddress,
                    confirmations: 1
                }) : await getUTXOs(false, {
                    address: gateway.gatewayAddress,
                    confirmations: 1,
                });
                if (utxos && utxos.length) {
                    this.logger.info("got UTXO");
                    this.logger.info(util_1.default.inspect(utxos, { colors: true, depth: 15 }));
                    const contractAddress = (0, address_1.getAddress)(transferRequest.contractAddress);
                    if (VAULT_DEPLOYMENTS[contractAddress]) {
                        await this.redis.lpush("/zero/dispatch", JSON.stringify(new request_1.TransferRequestV2(transferRequest).buildLoanTransaction()));
                    }
                    await this.redis.rpush("/zero/watch", JSON.stringify({
                        blockNumber,
                        transferRequest,
                    }));
                    if (process.env.WALLET) {
                        const signer = new wallet_1.Wallet(process.env.WALLET);
                        const txType = transferRequest.to === constants_1.AddressZero ? 'burn' : 'mint';
                        const webhookClient = new webhook_1.ZeroWebhook({
                            baseUrl: `https://explorer.zerodao.com/api/transaction?type=${txType}`,
                            signer: signer,
                            logger: this.logger
                        });
                        await webhookClient.send(transferRequest);
                    }
                    const removed = await this.redis.lrem("/zero/pending", 1, item);
                    if (removed)
                        i--;
                }
            }
            catch (error) {
                console.error(error);
                return this.logger.error(error);
            }
            await this.timeout(1000);
        }
    }
    async timeout(ms) {
        return await new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.PendingProcess = PendingProcess;
//# sourceMappingURL=pending.js.map