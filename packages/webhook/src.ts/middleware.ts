import { Buffer } from 'buffer';
import { recoverAddress } from '@ethersproject/transactions';
import { hashWebhookMessage } from './webhook';
import { deserialize } from '../../request/lib/deserialize'

export const zeroWebhookMiddleware = (req, res, next) => {
  return async (req, res, next) => {
    req.signerAddress = recoverAddress(hashWebhookMessage(req.body.data), req.body.signature);
    req.deserialized = await deserialize(req.body.data);
    next();
  }
}
