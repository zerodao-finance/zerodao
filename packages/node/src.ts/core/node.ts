import { ethers } from "ethers";
import chalk = require("chalk");
import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { Mempool, MempoolConfig } from "../memory";
import { protocol } from "../proto";
import { Consensus } from "../consensus";
import { Proposer } from "../proposal";
import { RPCServer } from "../rpc";

const timeout = async (time) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};

const timeoutWithCallback = async (time, callback) => {
  await new Promise((resolve) => setTimeout(callback(resolve), time));
};

export class ZeroNode {
  public _clientTopic: string = "zeronode.v1.inbound";
  private pool: Mempool;
  private peer: ZeroP2P;
  private signer: ethers.Signer;
  private propser: typeof Proposer;
  private protocol: any;
  private rpc: RPCServer;

  static PRESETS = {
    DEVNET: "",
  };

  static async fromSigner(signer: ethers.Signer, multiaddr?: any) {
    logger.info("generating seed from secp256k1 signature");
    const seed = await signer.signMessage(
      ZeroP2P.toMessage(await signer.getAddress())
    );
    logger.info("creating peer from seed, wait for complete ...");
    const peer = await ZeroP2P.fromSeed({
      signer,
      seed: Buffer.from(seed.substring(2), "hex"),
      multiaddr: multiaddr || ZeroNode.PRESETS.DEVNET,
    } as any);

    await new Promise((resolve) => {
      peer.start();
      peer.on("peer:discover", async (peerInfo) => {
        logger.info(`found peer \n ${peerInfo}`);
      });
      resolve(console.timeLog("node:start-up"));
    });

    await timeout(5000);

    logger.info("done!");
    logger.info("zerop2p address " + chalk.bold(peer.peerId.toB58String()));
    console.timeEnd("node:start-up");
    return new this({
      consensus: new Consensus(),
      peer,
      signer,
    });
  }

  constructor({ consensus, signer, peer }) {
    const pool = Mempool.init({ peer: this.peer });
    const rpc = RPCServer.init()
    Object.assign(this, {
      consensus,
      signer,
      peer,
      rpc,
      protocol: protocol,
      pool,
    });
  }

  /**
   *
   * initializes mempool and starts peer pubsub
   *
   */
  async init(
    poolConfig: Partial<MempoolConfig> = {
      peer: this.peer,
    }
  ) {
    this.pool = Mempool.init(poolConfig);
    logger.info("\n networking stack starting \n");
    await this.peer.start();
    await new Promise((resolve) => {
      this.peer.start();
      this.peer.on("peer:discovery", async (peerInfo) => {
        logger.info(`found peer \n ${peerInfo}`);
      });
      resolve(undefined);
    });

    await timeout(10000);
    await this.rpc.start();
  }

  

  async ping(time) {
    await (this.peer.pubsub.subscribe as any)(
      "zerodao.V1.pingpong",
      async (msg) => {
        logger.info(`heard message ${msg}`);
        if (msg == "ping") {
          await this.peer.pubsub.publish(
            "zerodao.V1.pingong",
            new TextEncoder().encode("pong")
          );
        }
      }
    );
    logger.info("\n gossiping ping to the network");
    await this.peer.pubsub.publish(
      "zerodao.V1.pingpong",
      new TextEncoder().encode("ping")
    );
  }
}
