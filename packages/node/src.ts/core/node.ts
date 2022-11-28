'use strict';

import { Consensus } from "./consensus";

import { ethers } from "ethers";
import chalk = require('chalk');
import { logger } from "./logger";
import { ZeroP2P } from "@zerodao/p2p";
import { protobuf } from "protobufjs";
import { ZeroPool } from "../memory";

export class ZeroNode extends ZeroP2P {
  public buf: any;
  public _clientTopic: string = "zeronode.v1.inbound";
  private _pool: ZeroPool;
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
      peer
    });
    this.buf = protobuf.load("../proto/ZeroProtocol.proto");
    this._pool = ZeroPool.initialize({
      config: {},
      peer: peer,
      buffer: this._buf
    });
  }

  async startNode() {

  }

  async stopNode() {

  }

  async cleanup() {

  }
 
}
