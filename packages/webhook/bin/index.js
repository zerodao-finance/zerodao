const { ZeroWebhook } = require("../lib/index");

(async () => {
  const webhook = new ZeroWebhook({});
})().catch(console.error);
