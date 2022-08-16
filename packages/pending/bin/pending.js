const { PendingProcess } = require('../lib/pending');
const redis = new (require('ioredis'))();

const { createLogger } = require('@zerodao/logger');
const logger = createLogger(require('../package').name);

(async () => {
  const pendingProcess = new PendingProcess({
    redis,
    logger
  });
  logger.info('pending process started');
  await pendingProcess.runLoop();
})().catch(console.error);
