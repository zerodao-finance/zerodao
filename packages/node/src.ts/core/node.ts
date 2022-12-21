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
  private peer: ZeroP2P;
  private signer: ethers.Signer;
  private proposer: typeof Proposer;
  private protocol: any;
  private pool: Mempool;
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
    Object.assign(this, {
      consensus,
      signer,
      peer,
      protocol: protocol,
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
    this.pool = await Mempool.init(poolConfig);
    this.rpc = RPCServer.init();
    await this.rpc.start();
  }

  async __rpc() {
    //start rpc server listening
  }

  async __handle_tx() {
    //handle rpc server messages
  }

  // implement mempool interface

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
