"use strict";

// only run one of these

import { getAddress } from "@ethersproject/address";
import constants from "@ethersproject/constants";
import { Redis } from "ioredis";
import { Request, TransferRequest, TransferRequestV2 } from "@zerodao/request";
import { Logger } from "@zerodao/logger";

const VAULT_DEPLOYMENTS = {
  [constants.AddressZero]: 1337,
};

export class WatcherProcess {
  public logger: Logger;
  public redis: Redis;
  constructor({ logger, redis }) {
    Object.assign(this, {
      logger,
      redis,
    });
  }

  async run() {
    try {
      if (await this.redis.llen("/zero/watch")) {
        const request = await this.redis.lindex("/zero/watch", 0);
        const tr = JSON.parse(request);

        const contractAddress = getAddress(tr.transferRequest.contractAddress)
        const transferRequest = VAULT_DEPLOYMENTS[contractAddress] ? new TransferRequestV2(tr.transferRequest) : new TransferRequest(tr.transferRequest);
        const { signature, amount, nHash, pHash } =
          await transferRequest.waitForSignature();
        
        await this.redis.rpush("/zero/dispatch", JSON.stringify(transferRequest.buildRepayTransaction()));
        
        await this.redis.lpop("/zero/watch");
      }
    } catch (error) {
      this.logger.error(error);
      return;
    }
  }

  async runLoop() {
    while (true) {
      await this.run();
      await this.timeout(1000);
    }
  }
  async timeout(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
