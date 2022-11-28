'use strict';

import { Consensus } from "./consensus";

import { ethers } from "ethers";
import chalk = require('chalk');
import { logger } from "./logger";
import { ZeroP2P } from "@zerodao/p2p";
import { protobuf } from "protobufjs";
import { ZeroPool } from "memory";

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
    this._pool = ZeroPool.initialize({});
  }

  async _listenForClient() {
    if (!this._isValidator) return;

    await _this.pubsub.subscribe(this._clientTopic, async (message: Buffer) => {
      await this._decodeMsg(message, 'Transaction');
      await this._pool._addTx(message);
    })
  } 
  
  async _sendMessage(topic: string, messageType: string, message: any) {
    const data = await this._encodeMsg(message, messageType);
    await (this.pubsub as any).publish(topic, data);
  }

  //decode message from buffer to json
  public async _decodeMsg(message: Buffer, type: string) {
   const _type = this.buf.lookupType(`${type}`)
   return _type.decode(message);
  }

  //encode message to protobuf type
  public async _encodeMsg(message: any, type: string) {
    const _type = this.buf.lookupType(`${type}`);
    return _type.encode(message).finish();
  }
 
}
