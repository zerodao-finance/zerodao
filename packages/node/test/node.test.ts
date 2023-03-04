import { ethers } from "ethers";
import { ZeroNode } from "../src.ts/index";

describe("node", () => {
  let node = Node.initNode({
    peer: await Peer.fromMultiaddr({ "mainnet", "first" })
  });

  await node.startNode({
    height: 0,
    port: "4545"
  });
});
