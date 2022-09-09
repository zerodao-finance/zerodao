"use strict";

import axios from "axios";
import { Signer } from "@ethersproject/abstract-signer";
import { Wallet } from "@ethersproject/wallet";
import { Request } from "@zerodao/request";
import { keccak256 } from "@ethersproject/solidity";

import { createLogger, Logger } from "@zerodao/logger";
import url from 'url';
import path from 'path';
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
    const serialized = "0x" + request.serialize().toString("hex");
    this.logger.debug(endpoint);
    const result = await axios.post(
      this.baseUrl + endpoint,
      {
        data: serialized,
        signature: await this.signer.signMessage(
          hashWebhookMessage(serialized)
        ),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    this.logger.debug(result);
    return result;
  }
}
