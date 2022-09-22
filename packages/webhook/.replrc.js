const { TransferRequest, BurnRequest } = require("@zerodao/request");
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
var burnRequest = new BurnRequest(JSON.parse("{\"asset\":\"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\",\"data\":\"0x000000000000000000000000000000000000000000000000000000000005989f\",\"owner\":\"0x0235175496c649b9af7c78f7550d6d7cb453f0fa\",\"destination\":\"0x052d77bd8f90b85ac920dccf55b513ebba7c065924825b9f91\",\"deadline\":\"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff\",\"amount\":\"0x05f5e100\",\"contractAddress\":\"0xa8bd3ffebf92538b3b830dd5b2516a5111db164d\",\"signature\":\"0x69d8a2a2b1ab2322ba605f5db0c546743f1c91dbf23bfd5d1df09d16a0f5696e2d55246051bf7c7f3cfab81fe8ca07aac334a70d150f7b8fa01a9a036a07b2a61c\"}"))


var webhookClient = new ZeroWebhook({
  baseUrl: 'http://localhost:3000',
  signer: Wallet.createRandom()
});
