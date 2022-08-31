"use strict";

import util from "util";
import { Buffer } from "buffer";
import { Redis } from "ioredis";
import { hexlify } from "@ethersproject/bytes";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";

export class ZeroWebhook {
  public redis: Redis;
  constructor({ redis }) {
    this.redis = redis;
  }

  async run() {
    // process first item in list
    for (let i = 0; i < await this.redis.llen('/zero/watch'); i++) {

    }
  }

  async timeout(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
