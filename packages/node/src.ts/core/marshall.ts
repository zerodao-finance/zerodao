import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { Mempool } from "../memory";
import { ethers } from "ethers";
import { RPCServer } from "../rpc";

export class Marshaller {
  private rpc: RPCServer;
  private peer: ZeroP2P;
  private memory: Mempool;

  static async init(signer: ethers.Signer, multiaddr?: any) {
    console.time("marshall:start");

    // initialize Mempool and rpc server
    let rpc = RPCServer.init();
    let memory = await Mempool.init({});

    // start peer process
    const seed = await signer.signMessage(
      ZeroP2P.toMessage(await signer.getAddress())
    );

    const peer = await ZeroP2P.fromSeed({
      signer,
      seed: Buffer.from(seed.substring(2), "hex"),
      multiaddr: multiaddr,
    } as any);

    await new Promise((resolve) => {
      peer.start();
      peer.on("peer:discover", async (peerInfo) => {
        logger.info(`found peer \n ${peerInfo}`);
      });
      resolve(console.timeLog("marshall:start:"));
    });

    // await timeout(5000);
    logger.info(
      `marshall process startup in ${console.timeEnd("marshall:start")}`
    );

    return new this({
      rpc,
      memory,
      peer,
    });
  }

  constructor({ rpc, memory, peer }) {
    Object.assign(this, {
      rpc,
      memory,
      peer,
    });
  }

  async startService() {
    this.rpc.start();
    logger.info("rpc server started");
    await this._handleInboundTransactions();
  }

  async stopService() {}
  async sync() {}
  async proposeBlockFromMemory(height: number) {}

  async _handleInboundTransactions() {
    this.rpc.on("zero_sendTransaction", (message) => {
      this.memory.addTransaction(message);
    });
  }

  //gossip current state of mempool to peers
  async _gossipMempool() {}

  // cleanup stale transactions in mempool
  async _cleanupMempool() {}
}
