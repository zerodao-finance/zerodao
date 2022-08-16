const redis = new (require('ioredis'))();
const { Wallet } = require('@ethersproject/wallet');
const { Dispatcher } = require('../lib/dispatcher');

(async () => {
  const wallet = (process.env.WALLET ? new Wallet(process.env.WALLET) : Wallet.createRandom());
  await new Dispatcher({
    redis,
    signer: wallet,
    gasLimit: 8e5
  }).runLoop();
})().catch(console.error);
