import { ethers } from "ethers";
import { Peer } from "../lib/p2p";


describe("Testing the Peer functionality", () => {
  const test_Peer = await Peer.fromMultiaddr("mainnet", "first");
  
  await test_Peer.start();
});
