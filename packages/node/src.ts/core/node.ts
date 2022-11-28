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
  private _pool: ZeroPool;
  private peer: ZeroP2P;
  private protocol: any;

  static async fromSigner(signer) {
    logger.info('generating seed from secp256k1 signature');
    const seed = await signer.signMessage(ZeroP2P.toMessage(await signer.getAddress()));
    logger.info('creating peer from seed, wait for complete ...');
    const peer = await ZeroP2P.fromSeed({
      signer,
      seed: Buffer.from(seed.substr(2), 'hex')
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
    this._pool = ZeroPool.init(
      {}, 
      peer,
      this.protocol
    );
  }

  async startNode() {

  }

  async stopNode() {

  }

  async cleanup() {

  }
 
}
