import axios from "axios";

export function makeFlashbotsWait(tx, logger) {
  const { wait, hash } = tx;
  return async () => {
    while (true) {
      try {
        const result = await axios.get(
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

makeFlashbotsWait.POLL_INTERVAL = 6000;
