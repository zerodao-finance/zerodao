"use strict";

import util from "util";
import { Buffer } from "buffer";
import { BTCHandler } from "send-crypto/build/main/handlers/BTC/BTCHandler";
import { Wallet } from "@ethersproject/wallet";
import { Zcash } from "@renproject/chains-bitcoin";
import { Redis } from "ioredis";
import { hexlify } from "@ethersproject/bytes";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { TransferRequestV2, TransferRequest } from "@zerodao/request";
import { ZeroWebhook } from "@zerodao/webhook";
import { Logger } from "@zerodao/logger";
const { getUTXOs } = BTCHandler;


const getZcashUTXOs = async (testnet, {
  confirmations,
  address
}) => {
  const zcash = new Zcash({ network: Boolean(testnet) ? 'testnet' : 'mainnet' });
  const utxos = await zcash.api.fetchUTXOs(address);
  return utxos.filter((v) => v.height !== null);
};

const isZcashAddress = (hex) => ((hex) => hex.substr(0, 2) === '0x' ? Buffer.from(hexlify(hex).substr(2), 'hex').toString('utf8').substr(0, 1) === 't' : hex.substr(0, 2) === 'zs' || hex.substr(0, 1) === 't')(Buffer.isBuffer(hex) ? '0x' + hex.toString('hex') : hex);

const cache = {};
const VAULT_DEPLOYMENTS = {
  [ AddressZero ]: 1
};
const getGateway = async (request) => {
  const { nonce } = request;
  if (cache[nonce]) return cache[nonce];
  else {
    cache[nonce] = await new TransferRequest(
      request
    ).submitToRenVM();
    return cache[nonce];
  }
};

const addHexPrefix = (s) => (s.substr(0, 2) === "0x" ? s : "0x" + s);

const stripHexPrefix = (s) => (s.substr(0, 2) === "0x" ? s.substr(2) : s);

const getBTCBlockNumber = async () => 0; // unused anyway


const lodash = require("lodash");

const seen = {};
const logGatewayAddress = (logger, v) => {
  if (!seen[v]) logger.info("gateway: " + v);
  seen[v] = true;
};

const MS_IN_DAY = 86400000

export class PendingProcess {
  public redis: Redis;
  public logger: Logger;
  public webhook: ZeroWebhook | null
  constructor({ redis, logger }) {
    this.redis = redis;
    this.logger = logger;
    this.webhook = process.env.WEBHOOK_BASEURL ? new ZeroWebhook({
      signer: process.env.WALLET ? new Wallet(process.env.WALLET) : Wallet.createRandom(),
      baseUrl: process.env.WEBHOOK_BASEURL
    }) : null;
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

        const daysElapsed = Math.floor((new Date().getTime() - transferRequest.timestamp) / MS_IN_DAY)
        if(daysElapsed >= 2){
          const removed = await this.redis.lrem("/zero/pending", 1, item);
          if (removed) i--;
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
          this.logger.info(util.inspect(utxos, { colors: true, depth: 15 }));
          // const redis = require('ioredis')(process.env.REDIS_URI);

          const contractAddress = getAddress(transferRequest.contractAddress)

          if(VAULT_DEPLOYMENTS[contractAddress]) {
            await this.redis.lpush("/zero/dispatch", JSON.stringify(new TransferRequestV2(transferRequest).buildLoanTransaction()));
          }

          await this.redis.rpush(
            "/zero/watch",
            JSON.stringify({
              blockNumber,
              transferRequest,
            })
          );
          
          // For Explorer API
	        if (this.webhook) {
            const request = VAULT_DEPLOYMENTS[getAddress(transferRequest.contractAddress)] ? new TransferRequestV2(transferRequest) : new TransferRequest(transferRequest);
            this.webhook.send('/transaction?type=mint', request).catch((err) => this.logger.error(err));
	        } else {
            this.logger.error("Webhook environment variables not setup.")
          }

          const removed = await this.redis.lrem("/zero/pending", 1, item);
          if (removed) i--;
        }
      } catch (error) {
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
