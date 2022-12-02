import { ethers } from "ethers";
import { ZeroNode } from "../src.ts/index";

describe("node", () => {
  let node: ZeroNode, signer: ethers.Signer;
  before(async () => {
    let node = await ZeroNode.fromSigner(signer, "DEV-MAINNET");
    signer = ethers.Wallet.createRandom();
  });
  it("should test the node", async () => {
    await node.init();
    await node.startNode();
  });
});
