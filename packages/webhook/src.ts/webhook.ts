"use strict";

import axios from 'axios';
import util from "util";
import { Buffer } from "buffer";
const redis = new (require('ioredis'))();
import { Signer } from "@ethersproject/abstract-signer";
import { keccak256 } from "@ethersproject/keccak256";

const hashWebhookMessage = (serialized: any) => keccak256(['/zero/1.1.0/webhook', serialized ]);

const serialize = (obj: any) => {
  let serialized = '';
  Object.keys(obj).forEach(function(key) {
    serialized += encodeURIComponent(key).replace(/%20/g, '+') + '=' + encodeURIComponent(obj[key]).replace(/%20/g, '+') + '&';
  });
  return serialized.slice(0, -1);
}

export class ZeroWebhook {
  public signer: Signer;
  public baseUrl: string;
  constructor({ signer, baseUrl }) {
    this.signer = signer;
    this.baseUrl = baseUrl;
  }

  async run() {
    // process first item in list
    for (let i = 0; i < await redis.llen('/zero/watch'); i++) {

    }
  }

  async send(request: Request)  {
    const serialized = '0x' + serialize(request).toString();
    await axios.post(this.baseUrl, {
      data: serialized,
      signature: await this.signer.signMessage(hashWebhookMessage(serialized))
    })
  }
}
