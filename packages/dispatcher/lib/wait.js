"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFlashbotsWait = void 0;
const axios_1 = __importDefault(require("axios"));
function makeFlashbotsWait(tx, logger) {
  const { wait, hash } = tx;
  return async () => {
    while (true) {
      try {
        const result = await axios_1.default.get(
          "https://protect.flashbots.net/tx/" + hash
        );
        switch (result.data.status) {
          case "INCLUDED":
            return await wait.call(tx);
          case "FAILED":
          case "CANCELLED":
            return null;
        }
      } catch (e) {
        logger.debug(e);
      }
      await new Promise((resolve) =>
        setTimeout(resolve, makeFlashbotsWait.POLL_INTERVAL)
      );
    }
  };
}
exports.makeFlashbotsWait = makeFlashbotsWait;
makeFlashbotsWait.POLL_INTERVAL = 6000;
//# sourceMappingURL=wait.js.map
