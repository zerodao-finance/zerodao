const { TransferRequest } = require("@zerodao/request");
const { Wallet } = require("@ethersproject/wallet");
const { ZeroWebhook } = require('./lib/index');

var transferRequest = new TransferRequest({
  to: "0xD94cdF48ce7eA571003C5EC5Ae6c5A8f99538Bac",
  module: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  data: "0x000000000000000000000000000000000000000000000000000000001933bad5",
  amount:"0x240f40",
  nonce: "0x2241b3705d6f1d4e325a807a67b71e0696d70de369397b2e809b37dad0ffd2fe",
  pNonce: "0x46a09b4636ce4afdfd5969a0d2be257f5d5d88afa29586c90a29415aff40adc2",
  contractAddress: "0xa8bd3ffebf92538b3b830dd5b2516a5111db164d",
  asset: "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
  underwriter: "0xa8bd3ffebf92538b3b830dd5b2516a5111db164d"
});

var webhookClient = new ZeroWebhook({
  baseUrl: 'http://localhost:3000',
  signer: Wallet.createRandom()
});