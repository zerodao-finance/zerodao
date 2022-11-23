'use strict';

import { Consensus } from "./consensus";

import { ethers } from "ethers";
import chalk = require('chalk');
import { logger } from "./logger";
import { ZeroP2P } from "@zerodao/p2p";
  
export class ZeroNode {
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
  }
}
