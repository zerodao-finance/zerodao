const gasnow = require('ethers-gasnow');
const packageJson = require('../package');
const { createLogger } = require('@zerodao/logger');
const ethers = require('ethers');
const polygongastracker = require('ethers-polygongastracker');
const { makePrivateSigner } = require('ethers-flashbots');

const getGasPricePolygon = polygongastracker.createGetGasPrice('rapid');

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
  [42161]: 'https://arb-mainnet.g.alchemy.com/v2/utMr7YLZtnhmRySXim_DuF5QMl0HBwdA',
  [137]: 'https://polygon-mainnet.g.alchemyapi.io/v2/gMO3S4SBWM72d94XKR4Hy2pbviLjmLqk',
  [1]: 'https://eth-mainnet.alchemyapi.io/v2/gMO3S4SBWM72d94XKR4Hy2pbviLjmLqk',
  [43114]: 'https://api.avax.network/ext/bc/C/rpc'
};

const NO_FLASHBOTS = {
  [43114]: true,
  [137]: true,
  [42161]: true
};

const ERROR_TIMEOUT = 1000;

const util = require('util');

const chainIdToPromise = {};

export class Dispatcher {
  static RPC_ENDPOINTS = RPC_ENDPOINTS;
  static ERROR_TIMEOUT = ERROR_TIMEOUT;
  logger: any;
  providers: {};
  signers: {};
  redis: any;
  constructor({
    redis,
    gasLimit,
    logger,
    signer
  }) {
    Object.assign(this, {
      redis,
      gasLimit,
      logger,
      signer
    });
    if (!this.logger) this.logger = createLogger(packageJson.name);
    this.providers = Object.entries(Dispatcher.RPC_ENDPOINTS).reduce((r, [ key, value ]) => {
      const provider = r[key] = new ethers.providers.JsonRpcProvider(value);
      if (Number(key) == 1) provider.getGasPrice = gasnow.createGetGasPrice('rapid');
      else if (Number(key) == 137) fixGetFeeData(provider);
      return r;
    }, {});
    this.signers = Object.entries(Dispatcher.RPC_ENDPOINTS).reduce((r, [ key, value ]) => {
      r[key] = (NO_FLASHBOTS[key] ? (v) => v : (v) => makePrivateSigner({ signer: v, getMaxBlockNumber: async (signer) => ((await signer.provider.getBlockNumber()) + 10000) }))(signer.connect(this.makeProvider(key)));
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
    this.logger.info('starting dispatch loop');
    while (true) {
      const txSerialized = await this.redis.lpop('/zero/dispatch');
      try {
        if (!txSerialized) {
          await this.errorTimeout();
          continue;
        }
        const tx = JSON.parse(txSerialized);
              this.logger.info('dispatching tx');
              this.logger.info(util.inspect(tx, { colors: true, depth: 15 }));
              try {
                await (chainIdToPromise[tx.chainId] || Promise.resolve());
                const dispatched = await (this.getSigner(tx.chainId)).sendTransaction({
                  ...tx,
                  chainId: undefined,
                  gasLimit: { [1]: 8e5, [43114]: 2e6, [137]: 2e6, [42161]: undefined }[tx.chainId]
          });
	        chainIdToPromise[tx.chainId] = dispatched.wait().catch((err) => this.logger.error(err));
                this.logger.info('dispatched tx: ' + dispatched.hash);
              } catch (e) {
                this.logger.error(e);
                await this.redis.rpush('/zero/dispatch', txSerialized);
                await this.errorTimeout();
        }
      } catch (e) {
        this.logger.error(e);
//        await this.redis.rpush('/zero/dispatch', txSerialized)
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
};
