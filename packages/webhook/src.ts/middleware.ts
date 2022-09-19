import { Buffer } from 'buffer';
import { recoverAddress } from '@ethersproject/transactions';
import { hashWebhookMessage } from './webhook';
import { decode } from '@ethersproject/rlp';

export const zeroWebhookMiddleware = (req, res, next) => {
  return (req, res, next) => {
    req.signerAddress = recoverAddress(hashWebhookMessage(req.body.data), req.body.signature);
    const decoded = decode(Buffer.from(req.body.data.substr(2), 'hex').toString('utf8'));
    console.log("BEFORE DESERIALIZING:", decode(Buffer.from(req.body.data.substr(2), 'hex').toString('utf8')))
    req.deserialized = JSON.parse(Buffer.from(req.body.data.substr(2), 'hex').toString('utf8'));
    next();
  }
}
