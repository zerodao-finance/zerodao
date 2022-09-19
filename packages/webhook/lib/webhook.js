"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroWebhook = exports.hashWebhookMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const solidity_1 = require("@ethersproject/solidity");
const logger_1 = require("@zerodao/logger");
const logger = (0, logger_1.createLogger)(require('../package').name);
const hashWebhookMessage = (serialized) => (0, solidity_1.keccak256)(["string", "bytes"], ["/zero/1.1.0/webhook", serialized]);
exports.hashWebhookMessage = hashWebhookMessage;
class ZeroWebhook {
    constructor({ signer, baseUrl }) {
        this.signer = signer;
        this.baseUrl = baseUrl;
        this.logger = logger;
    }
    async send(endpoint, request) {
        const serialized = "0x" + request.serialize().toString("hex");
        console.log("AFTER SERIALIZE:", serialized);
        this.logger.debug(endpoint);
        const result = await axios_1.default.post(this.baseUrl + endpoint, {
            data: serialized,
            signature: await this.signer.signMessage((0, exports.hashWebhookMessage)(serialized)),
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        this.logger.debug(result);
        return result;
    }
}
exports.ZeroWebhook = ZeroWebhook;
//# sourceMappingURL=webhook.js.map