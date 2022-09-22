import { recoverAddress } from "@ethersproject/transactions";
import { hexlify } from "@ethersproject/bytes";
import { fromPlainObject, deserialize } from "@zerodao/request";
import { hashWebhookMessage } from "./webhook";

const getSignatureHeader = (headers) => {
  return headers['X-Signature'] || headers['X-signature'] || headers['x-signature'];
};
export const zeroWebhookMiddleware = (req, res, next) => {
  return (req, res, next) => {
    const signature = getSignatureHeader(req.headers);
    if (!signature || typeof signature !== 'string' || signature.length !== 132) req.signerAddress = null;
    else req.signerAddress = recoverAddress(hashWebhookMessage(hexlify(fromPlainObject(req.body).serialize())), req.headers['X-Signature']);
    next();
  }
}
