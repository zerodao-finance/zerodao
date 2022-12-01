"use strict";

import { ethers } from "ethers";
import chalk = require("chalk");
import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { ZeroPool, ZeroPoolConfig } from "../memory";
import { protocol } from "../proto";
import { Consensus } from "../consensus";
import { Proposer } from "../proposal";

const timeout = async (time) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};

export class ZeroNode {
  public _clientTopic: string = "zeronode.v1.inbound";
  private pool: ZeroPool;
  private peer: ZeroP2P;
  private propser: typeof Proposer;
  private protocol: any;

  static PRESETS = {
    DEVNET: "",
  };

  static async fromSigner(signer, multiaddr?) {
    logger.info("generating seed from secp256k1 signature");
    const seed = await signer.signMessage(
      ZeroP2P.toMessage(await signer.getAddress())
    );
    logger.info("creating peer from seed, wait for complete ...");
    const peer = await ZeroP2P.fromSeed({
      signer,
      seed: Buffer.from(seed.substr(2), "hex"),
      multiaddr: multiaddr || ZeroNode.PRESETS.DEVNET,
    } as any);
    logger.info("done!");
    logger.info("zerop2p address " + chalk.bold(peer.peerId.toB58String()));
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
  async init(poolConfig: ZeroPoolConfig) {
    
    this.pool = ZeroPool.init(poolConfig, this.peer, this.protocol);
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

    
  }

  async startNode() {
    logger.info("\n starting mempool \n");
    await this.pool.start(); // starts mempool
  }

  async stopNode() {
    await this.pool.close(); // closes mempool
    await this.cleanup();
  }

  async cleanup() {
    await this.peer.stop();
  }

  async ping() {
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
