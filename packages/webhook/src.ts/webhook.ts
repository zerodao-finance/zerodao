"use strict";

import axios from "axios";
import { Signer } from "@ethersproject/abstract-signer";
import { Wallet } from "@ethersproject/wallet";
import { Request } from "@zerodao/request";
import { keccak256 } from "@ethersproject/solidity";
import { Logger } from "@zerodao/logger";

export const hashWebhookMessage = (serialized: any) =>
  keccak256(["string", "bytes"], ["/zero/1.1.0/webhook", serialized]);

type IZeroWebhookProps = {
  signer: Signer | Wallet | any;
  baseUrl: string;
  logger?: Logger;
};

export class ZeroWebhook {
  public signer: Signer;
  public baseUrl: string;
  public logger: Logger;
  constructor({ signer, baseUrl, logger }: IZeroWebhookProps) {
    this.signer = signer;
    this.baseUrl = baseUrl;
    this.logger = logger;
  }

  async send(request: Request) {
    const serialized = "0x" + request.serialize().toString("hex");
    return await axios.post(
      this.baseUrl,
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
  }
}
