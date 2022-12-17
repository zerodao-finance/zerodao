import { ethers } from "ethers";
import { ZeroNode } from "../lib";

(async () => {
  const signer = ethers.Wallet.createRandom();
  let node = await ZeroNode.fromSigner(signer);
})();
