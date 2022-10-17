"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispatcher = void 0;
const util_1 = __importDefault(require("util"));
const providers_1 = require("@ethersproject/providers");
const polygongastracker = require("ethers-polygongastracker");
const ethers_flashbots_1 = require("ethers-flashbots");
const logger_1 = require("@zerodao/logger");
const units_1 = require("@ethersproject/units");
const chains_1 = require("@zerodao/chains");
const wait_1 = require("./wait");
const gasnow = require("ethers-gasnow");
const packageJson = require("../package");
const getGasPricePolygon = polygongastracker.createGetGasPrice("rapid");
const fixGetFeeData = (provider) => {
    const { getFeeData } = provider;
    provider.getFeeData = async function (...args) {
        const data = await getFeeData.call(this, ...args);
        data.gasPrice = await getGasPricePolygon();
        data.maxFeePerGas = data.gasPrice;
        data.maxPriorityFeePerGas = data.maxFeePerGas;
        return data;
    };
    return provider;
};
const RPC_ENDPOINTS = {
    [42161]: chains_1.ID_CHAIN[42161].rpcUrl,
    [10]: "https://mainnet.optimism.io",
    [137]: chains_1.ID_CHAIN[137].rpcUrl,
    [1]: "https://rpc.flashbots.net",
    [43114]: "https://api.avax.network/ext/bc/C/rpc",
};
const NO_FLASHBOTS = {
    [43114]: true,
    [137]: true,
    [42161]: true,
    [10]: true,
    [1]: true
};
const ERROR_TIMEOUT = 1000;
const chainIdToPromise = {};
const EIP838_BYTES = "0x08c379a0";
class Dispatcher {
    constructor({ redis, gasLimit, logger, signer }) {
        Object.assign(this, {
            redis,
            gasLimit,
            logger,
            signer,
        });
        if (!this.logger)
            this.logger = (0, logger_1.createLogger)(packageJson.name);
        this.providers = Object.entries(this.constructor.RPC_ENDPOINTS).reduce((r, [key, value]) => {
            const provider = (r[key] = new providers_1.JsonRpcProvider(value));
            if (Number(key) === 1)
                provider.getGasPrice = gasnow.createGetGasPrice("rapid");
            else if (Number(key) === 137)
                fixGetFeeData(provider);
            return r;
        }, {});
        this.signers = Object.entries(this.constructor.RPC_ENDPOINTS).reduce((r, [key, value]) => {
            r[key] = (NO_FLASHBOTS[key]
                ? (v) => v
                : (v) => (0, ethers_flashbots_1.makePrivateSigner)({
                    signer: v,
                    getMaxBlockNumber: async (signer) => (await signer.provider.getBlockNumber()) + 10000,
                }))(signer.connect(this.makeProvider(key)));
            return r;
        }, {});
    }
    makeProvider(chainId) {
        return this.providers[chainId];
    }
    getSigner(chainId) {
        return this.signers[chainId];
    }
    async runLoop() {
        this.logger.info("starting dispatch loop");
        while (true) {
            const txSerialized = await this.redis.lpop("/zero/dispatch");
            try {
                if (!txSerialized) {
                    await this.errorTimeout();
                    continue;
                }
                const tx = JSON.parse(txSerialized);
                this.logger.info("dispatching tx");
                this.logger.info(util_1.default.inspect(tx, { colors: true, depth: 15 }));
                try {
                    await (chainIdToPromise[tx.chainId] || Promise.resolve());
                    const signer = this.getSigner(tx.chainId);
                    const txObject = {
                        ...tx,
                        chainId: undefined,
                        gasLimit: {
                            [1]: 8e5,
                            [43114]: 2e6,
                            [137]: 2e6,
                            [42161]: undefined,
                            [10]: undefined,
                        }[tx.chainId],
                    };
                    this.logger.info("simulate");
                    let hadError, response;
                    try {
                        response = await signer.provider.estimateGas({
                            data: tx.data,
                            to: tx.to,
                            from: await signer.getAddress(),
                            gasPrice: (0, units_1.parseUnits)('10', 9)
                        });
                    }
                    catch (e) {
                        hadError = e;
                        this.logger.debug(hadError);
                    }
                    if ((typeof response === "string" && response.match(EIP838_BYTES)) ||
                        hadError) {
                        this.logger.info("tx simulation failed");
                        if (typeof hadError === 'string' && hadError.includes('transfer amount exceeds balance')) {
                            await this.redis.lrem("/zero/dispatch", txSerialized, 1);
                        }
                    }
                    const dispatched = await this.getSigner(tx.chainId)
                        .sendTransaction(txObject);
                    if (tx.chainId === 1)
                        dispatched.wait = (0, wait_1.makeFlashbotsWait)(dispatched, this.logger); // poll flashbots protect
                    chainIdToPromise[tx.chainId] = dispatched
                        .wait()
                        .catch((err) => this.logger.error(err));
                    this.logger.info("dispatched tx: " + dispatched.hash);
                }
                catch (e) {
                    this.logger.error(e);
                    await this.redis.rpush("/zero/dispatch", txSerialized);
                    await this.errorTimeout();
                }
            }
            catch (e) {
                this.logger.error(e);
                // await this.redis.rpush('/zero/dispatch', txSerialized)
            }
            await this.timeout(1000);
        }
    }
    async timeout(ms) {
        return await new Promise((resolve) => setTimeout(resolve, ms));
    }
    async errorTimeout() {
        await new Promise((resolve) => setTimeout(resolve, Dispatcher.ERROR_TIMEOUT));
    }
}
exports.Dispatcher = Dispatcher;
Dispatcher.RPC_ENDPOINTS = RPC_ENDPOINTS;
Dispatcher.ERROR_TIMEOUT = ERROR_TIMEOUT;
//# sourceMappingURL=dispatcher.js.map