// only run one of these

const { UnderwriterTransferRequest } = require("@zerodao/sdk");
const ethers = require('ethers');
const encodeTransferRequestRepay = (transferRequest, queryResult) => {
  const contractInterface = new ethers.utils.Interface([
    "function repay(address, address, address, uint256, uint256, uint256, address, bytes32, bytes, bytes)",
  ]);
  return contractInterface.encodeFunctionData("repay", [
    transferRequest.underwriter,
    transferRequest.destination(),
    transferRequest.asset,
    transferRequest.amount,
    queryResult.amount,
    transferRequest.pNonce,
    transferRequest.module,
    queryResult.nHash,
    transferRequest.data,
    queryResult.signature,
  ]);
};
const CONTROLLER_DEPLOYMENTS = {
  "0x9880fCd5d42e8F4c2148f2c1187Df050BE3Dbd17": 42161,
  "0x951E0dDe1fbe4AD1E9C027F46b653BAD2D99828d": 137,
  "0xa8BD3FfEbF92538b3b830DD5B2516A5111DB164D": 1,
  "0x1ec2Abe3F25F5d48567833Bf913f030Ec7a948Ba": 43114
};


const getChainId = (request) => {
  return (
    CONTROLLER_DEPLOYMENTS[ethers.utils.getAddress(request.contractAddress)] ||
    (() => {
      throw Error("no controller found: " + request.contractAddress);
    })()
  );
};

export class WatcherProcess {
  Error = false;
  redis: any;
  logger: any;
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
        const transferRequest = new UnderwriterTransferRequest(tr.transferRequest);
        const { signature, amount, nHash, pHash } =
          await transferRequest.waitForSignature();
        await this.redis.rpush("/zero/dispatch", JSON.stringify({
          to: transferRequest.contractAddress,
          data: encodeTransferRequestRepay(transferRequest, {
            signature,
            amount,
            nHash,
            pHash,
          }),
          chainId: getChainId(transferRequest),
        }, null, 2));
        await this.redis.lpop("/zero/watch");
      }
    } catch (error) {
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
};
