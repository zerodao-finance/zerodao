const redis = new (require("ioredis"))();

const { createLogger } = require('@zerodao/logger');
const packageJson = require('../package');
const logger = createLogger(packageJson.name);
import { WatcherProcess } from '../lib/watcher';


(async () => {
  const watcherProcess = new WatcherProcess({
    redis,
    logger
  });
  logger.info('watcher process started');
  await watcherProcess.runLoop();
})().catch(console.error);
