import { recoverAddress } from '@ethersproject/transactions';
import { hashWebhookMessage } from './webhook';
import { deserialize } from '@zerodao/request'

export const zeroWebhookMiddleware = (req, res, next) => {
  return (req, res, next) => {
    req.signerAddress = recoverAddress(hashWebhookMessage(req.body.data), req.body.signature);
    req.deserialized = deserialize(req.body.data);
    next();
  }
}
