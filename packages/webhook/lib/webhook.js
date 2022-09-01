"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroWebhook = exports.hashWebhookMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const keccak256_1 = require("@ethersproject/keccak256");
const hashWebhookMessage = (serialized) => (0, keccak256_1.keccak256)(['/zero/1.1.0/webhook', serialized]);
exports.hashWebhookMessage = hashWebhookMessage;
class ZeroWebhook {
    constructor({ signer, baseUrl }) {
        this.signer = signer;
        this.baseUrl = baseUrl;
    }
    async send(request) {
        const serialized = '0x' + request.serialize().toString('hex');
        await axios_1.default.post(this.baseUrl, {
            data: serialized,
            signature: await this.signer.signMessage((0, exports.hashWebhookMessage)(serialized))
        });
    }
}
exports.ZeroWebhook = ZeroWebhook;
//# sourceMappingURL=webhook.js.map