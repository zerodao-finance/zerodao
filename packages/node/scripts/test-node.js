const ethers = require("ethers");
const { ZeroNode } = require("../lib");

(async () => {
  const signer = ethers.Wallet.createRandom();
  let node = await ZeroNode.init({ signer });
})();
