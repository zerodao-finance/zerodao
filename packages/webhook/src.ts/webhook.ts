"use strict";

import { Buffer } from 'buffer';
import axios from 'axios';
const redis = new (require('ioredis'))();
import { Signer } from "@ethersproject/abstract-signer";
import { keccak256 } from "@ethersproject/keccak256";
import { Request } from "@zerodao/request";
import { recoverAddress } from '@ethersproject/transactions';
import bodyparser from "body-parser";

const hashWebhookMessage = (serialized: any) => keccak256(['/zero/1.1.0/webhook', serialized ]);

export const zeroWebhookMiddleware = () => {
  return (req, res, next, end) => {
    req.signerAddress = recoverAddress(hashWebhookMessage(req.body.serialized), req.body.signature);
    req.deserialized = JSON.parse(Buffer.from(req.body.serialized.substr(2), 'hex').toString('utf8'));
    next();
  }
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
    const serialized = '0x' + request.serialize().toString('hex');
    await axios.post(this.baseUrl, {
      data: serialized,
      signature: await this.signer.signMessage(hashWebhookMessage(serialized))
    })
  }
}
