const redis = new (require('ioredis'))();
const ethers = require("ethers");
const { Dispatcher } = require('../lib/dispatcher');

(async () => {
  const wallet = (process.env.WALLET ? new ethers.Wallet(process.env.WALLET) : ethers.Wallet.createRandom());
  await new Dispatcher({
    redis,
    signer: wallet,
    gasLimit: 8e5
  }).runLoop();
})().catch(console.error);
