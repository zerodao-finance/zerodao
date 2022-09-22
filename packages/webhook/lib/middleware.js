"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zeroWebhookMiddleware = void 0;
const transactions_1 = require("@ethersproject/transactions");
const bytes_1 = require("@ethersproject/bytes");
const request_1 = require("@zerodao/request");
const webhook_1 = require("./webhook");
const zeroWebhookMiddleware = (req, res, next) => {
    return (req, res, next) => {
        if (!req.headers['X-Signature'] || req.headers['X-Signature'].length !== 132)
            req.signerAddress = null;
        else
            req.signerAddress = (0, transactions_1.recoverAddress)((0, webhook_1.hashWebhookMessage)((0, bytes_1.hexlify)((0, request_1.fromPlainObject)(req.body).serialize())), req.headers['X-Signature']);
        next();
    };
};
exports.zeroWebhookMiddleware = zeroWebhookMiddleware;
//# sourceMappingURL=middleware.js.map