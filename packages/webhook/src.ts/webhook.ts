"use strict";

import axios from 'axios';
import { Signer } from "@ethersproject/abstract-signer";
import { keccak256 } from "@ethersproject/keccak256";
import { Request } from "@zerodao/request";

export const hashWebhookMessage = (serialized: any) => keccak256(['/zero/1.1.0/webhook', serialized ]);

export class ZeroWebhook {
  public signer: Signer;
  public baseUrl: string;
  constructor({ signer, baseUrl }) {
    this.signer = signer;
    this.baseUrl = baseUrl;
  }
  
  async send(request: Request)  {
    const serialized = '0x' + request.serialize().toString('hex');
    await axios.post(this.baseUrl, {
      data: serialized,
      signature: await this.signer.signMessage(hashWebhookMessage(serialized))
    })
  }
}
