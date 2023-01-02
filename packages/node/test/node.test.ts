import { ethers } from "ethers";
import { ZeroNode } from "../src.ts/index";

describe("node", () => {
  let node: ZeroNode, signer: ethers.Signer;
  before(async () => {
    //signer = ethers.Wallet.createRandom();
    //node = await ZeroNode.fromSigner(signer, "DEV-MAINNET");
  });
  it("should test the node", async () => {
    //await node.init();
  });
});
