"use strict";

import axios from "axios";
import { Signer } from "@ethersproject/abstract-signer";
import { Wallet } from "@ethersproject/wallet";
import { Request } from "@zerodao/request";
import { keccak256 } from "@ethersproject/solidity";

import { createLogger, Logger } from "@zerodao/logger";
const logger = createLogger(require('../package').name);

export const hashWebhookMessage = (serialized: any) =>
  keccak256(["string", "bytes"], ["/zero/1.1.0/webhook", serialized]);

type IZeroWebhookProps = {
  signer: Signer | Wallet | any;
  baseUrl: string;
};

export class ZeroWebhook {
  public signer: Signer;
  public baseUrl: string;
  public logger: Logger;
  
  constructor({ signer, baseUrl }: IZeroWebhookProps) {
    this.signer = signer;
    this.baseUrl = baseUrl;
    this.logger = logger;
  }

  async send(endpoint: string, request: Request) {
    this.logger.debug(endpoint);
    const result = await axios.post(
      this.baseUrl + endpoint,
      request.toPlainObject(),
      {
        headers: {
          "Content-Type": "application/json",
	  "X-Signature": await this.signer.signMessage(hashWebhookMessage(request.serialize()))
        }
      }
    );
    this.logger.debug(result);
    return result;
  }
}
