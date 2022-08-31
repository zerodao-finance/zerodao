"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroWebhook = void 0;
class ZeroWebhook {
    constructor({ redis }) {
        this.redis = redis;
    }
    async run() {
        // process first item in list
        for (let i = 0; i < await this.redis.llen('/zero/watch'); i++) {
        }
    }
    async timeout(ms) {
        return await new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.ZeroWebhook = ZeroWebhook;
//# sourceMappingURL=webhook.js.map