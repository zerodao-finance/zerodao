import { recoverAddress } from "@ethersproject/transactions";
import { hexlify } from "@ethersproject/bytes";
import { fromPlainObject, deserialize } from "@zerodao/request";
import { hashWebhookMessage } from "./webhook";

export const zeroWebhookMiddleware = (req, res, next) => {
  return (req, res, next) => {
    if (!req.headers['X-Signature'] || req.headers['X-Signature'].length !== 132) req.signerAddress = null;
    else req.signerAddress = recoverAddress(hashWebhookMessage(hexlify(fromPlainObject(req.body).serialize())), req.headers['X-Signature']);
    next();
  }
}
