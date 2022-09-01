import { Buffer } from 'buffer';
import { recoverAddress } from '@ethersproject/transactions';
import { hashWebhookMessage } from './webhook';

export const zeroWebhookMiddleware = (req, res, next) => {
  return (req, res, next) => {
    req.signerAddress = recoverAddress(hashWebhookMessage(req.body.serialized), req.body.signature);
    req.deserialized = JSON.parse(Buffer.from(req.body.serialized.substr(2), 'hex').toString('utf8'));
    next();
  }
}