"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* import { ZeroP2P } from "@zerodao/p2p";
import { Mempool } from "../lib/memory";
import { ethers } from "ethers";

/*
 * Transaction:
 * type: number
 * to: Uint8Array
 * data: Uint8Array
 * nonce: number
 * signature: Uint8Array
 * chain: number
describe("Mempool Test", () => {
  const signer = ethers.Wallet.createRandom();
  const peer = new Promise(async (resolve) => {
    let seed = await signer.signMessage(
      ZeroP2P.toMessage(await signer.getAddress())
    );
    let peer = await ZeroP2P.fromSeed({
      signer,
      seed: Buffer.from(seed.substr(2), "hex"),
    } as any);
    resolve(peer);
  });

  peer.then((peer) => peer);

  (async () => await new Promise((resolve) => setTimeout(resolve, 5000)))();

  it("should test add tx to a mempool", async () => {
    let state = Mempool.init({ peer });
    console.log(state);
  });
});

 
//# sourceMappingURL=mempool.test.js.map