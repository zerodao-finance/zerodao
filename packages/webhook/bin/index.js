const { ZeroWebhook } = require('../lib/index');
const redis = new (require('ioredis'))();

(async () => {
  const webhook = new ZeroWebhook({
    redis,
  });
})().catch(console.error);
