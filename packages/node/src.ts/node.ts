'use strict';

import { Consensus } from "./consensus";

import { ethers } from "ethers";
import chalk = require('chalk');
import { logger } from "./logger";
import { ZeroP2P } from "@zerodao/p2p";
import { protobuf } from "protobufjs";


export class ZeroNode {

  _buf = protobuf.load('../proto/ZeroProtocol.proto');
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
  
  //send message
  //@param topic: string topic p2p topic 
  //@param messageType: string messageType for protobuf validation
  //@param message: javascript object
  _sendMessage(topic: string, messageType: string, message: any) {
    const data = await this.encodeMsg(message, messageType);
    await (this.pubsub as any).publish(topic, data);
  }

  //decode message from buffer to json
  static async _decodeMsg(message: Buffer, type: string) {
   const _type = this._buf.lookupType(`${type}`)
   return _type.decode(message);
  }

  //encode message to protobuf type
  static async _encodeMsg(message: any, type: string) {
    const _type = this._buf.lookupType(`${type}`);
    return _type.encode(message).finish();
  }
 
}
