"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zeroWebhookMiddleware = void 0;
const buffer_1 = require("buffer");
const transactions_1 = require("@ethersproject/transactions");
const webhook_1 = require("./webhook");
const zeroWebhookMiddleware = (req, res, next) => {
    return (req, res, next) => {
        req.signerAddress = (0, transactions_1.recoverAddress)((0, webhook_1.hashWebhookMessage)(req.body.data), req.body.signature);
        req.deserialized = JSON.parse(buffer_1.Buffer.from(req.body.data.substr(2), 'hex').toString('utf8'));
        next();
    };
};
exports.zeroWebhookMiddleware = zeroWebhookMiddleware;
//# sourceMappingURL=middleware.js.map