"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroWebhook = void 0;
const axios_1 = __importDefault(require("axios"));
const redis = new (require('ioredis'))();
const keccak256_1 = require("@ethersproject/keccak256");
const hashWebhookMessage = (serialized) => (0, keccak256_1.keccak256)(['/zero/1.1.0/webhook', serialized]);
const serialize = (obj) => {
    let serialized = '';
    Object.keys(obj).forEach(function (key) {
        serialized += encodeURIComponent(key).replace(/%20/g, '+') + '=' + encodeURIComponent(obj[key]).replace(/%20/g, '+') + '&';
    });
    return serialized.slice(0, -1);
};
class ZeroWebhook {
    constructor({ signer, baseUrl }) {
        this.signer = signer;
        this.baseUrl = baseUrl;
    }
    async run() {
        // process first item in list
        for (let i = 0; i < await redis.llen('/zero/watch'); i++) {
        }
    }
    async send(request) {
        const serialized = '0x' + serialize(request).toString();
        await axios_1.default.post(this.baseUrl, {
            data: serialized,
            signature: await this.signer.signMessage(hashWebhookMessage(serialized))
        });
    }
}
exports.ZeroWebhook = ZeroWebhook;
//# sourceMappingURL=webhook.js.map