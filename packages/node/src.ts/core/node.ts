'use strict';

import { ethers } from "ethers";
import chalk = require('chalk');
import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { ZeroPool } from "../memory";
import { protocol } from "../proto";
import { Consensus } from "../consensus";
export class ZeroNode {
  public _clientTopic: string = "zeronode.v1.inbound";
  private pool: ZeroPool;
  private peer: ZeroP2P;
  private protocol: any;
  
  static PRESETS = {
    DEVNET: "",
  }

  static async fromSigner(signer, multiaddr?) {
    logger.info('generating seed from secp256k1 signature');
    const seed = await signer.signMessage(ZeroP2P.toMessage(await signer.getAddress()));
    logger.info('creating peer from seed, wait for complete ...');
    const peer = await ZeroP2P.fromSeed({
      signer,
      seed: Buffer.from(seed.substr(2), 'hex'),
      multiaddr: (multiaddr || ZeroNode.PRESETS.DEVNET)
    } as any);
    logger.info('done!');
    logger.info('zerop2p address ' + chalk.bold(peer.peerId.toB58String()));
    return new this({
      consensus: new Consensus(),
      peer,
      signer
    });
  }

  constructor({
    consensus,
    signer,
    peer
  }) {
    Object.assign(this, {
      consensus,
      signer,
      peer, 
      protocol: protocol
    });
    
  }

  async init() {
    this.pool = ZeroPool.init({}, this.peer, this.protocol);
    await this.peer.start();
    await this.peer.pubsub.start();
  }
    
  async startNode() {
    //TODO: implement
  }

  async stopNode() {
    //TODO: implement
  }

  async cleanup() {
    //TODO: implement
  }
 
  async ping() {
    await this.peer.pubsub.subscribe("zerodao.V1.pingpong");
    this.peer.on("zerodao.V1.pingpong", async (message) => {
      let msg = new TextDecoder().decode(message);
      logger.info(`heard message ${msg}`);
      if (msg == "ping") {
        await this.peer.pubsub.publish("zerodao.V1.pingong", new TextEncoder().encode("pong"))
      }
    });
    logger.info("\n gossiping ping to the network");
    await this.listenForPing();
  }

  async listenForPing() {
    logger.info(`\n saying ping`);
    await this.peer.pubsub.publish("zerodao.V1.pingpong", new TextEncoder().encode("ping"));
  }

}
