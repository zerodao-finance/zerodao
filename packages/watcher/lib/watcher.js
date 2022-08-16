"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatcherProcess = void 0;
// only run one of these
const address_1 = require("@ethersproject/address");
const constants_1 = require("@ethersproject/constants");
const request_1 = require("@zerodao/request");
const VAULT_DEPLOYMENTS = {
    [constants_1.AddressZero]: 1337,
};
class WatcherProcess {
    constructor({ logger, redis }) {
        Object.assign(this, {
            logger,
            redis,
        });
    }
    async run() {
        try {
            if (await this.redis.llen("/zero/watch")) {
                const request = await this.redis.lindex("/zero/watch", 0);
                const tr = JSON.parse(request);
                const contractAddress = (0, address_1.getAddress)(tr.transferRequest.contractAddress);
                const transferRequest = VAULT_DEPLOYMENTS[contractAddress] ? new request_1.TransferRequestV2(tr.transferRequest) : new request_1.TransferRequest(tr.transferRequest);
                const { signature, amount, nHash, pHash } = await transferRequest.waitForSignature();
                await this.redis.rpush("/zero/dispatch", JSON.stringify(transferRequest.buildRepayTransaction()));
                await this.redis.lpop("/zero/watch");
            }
        }
        catch (error) {
            this.logger.error(error);
            return;
        }
    }
    async runLoop() {
        while (true) {
            await this.run();
            await this.timeout(1000);
        }
    }
    async timeout(ms) {
        return await new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.WatcherProcess = WatcherProcess;
//# sourceMappingURL=watcher.js.map