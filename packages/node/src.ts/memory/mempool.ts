import { ethers } from "ethers";
import * as _ from "lodash";
import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { Message } from "protobufjs";
import { Minisketch } from "libminisketch-wasm";
import { Transaction } from "../core/types";
import { validateTransaction } from "../transaction";
export interface MempoolConfig {
  protocol: any;
  sketch: Minisketch;

  MAX_BLOCK_SIZE: number;
  MAX_MSG_BYTES: number; // 1kb max message limit;
}

export class Mempool {
  public state: Map<string, Buffer>;
  public handled: Map<string, any>;

  private protocol: any;
  private sketch: Minisketch;
  private POOL_GOSSIP_TOPIC: string = "zerodao:xnode:gossip:v1";
  private POOL_GOSSIP_TIME: number = 5;
  private MEMORY_CLEANUP_TIME: number = 10;
  private MAX_POOL_SIZE: number = 10000;
  private MAX_MSG_BYTES: number = 1000; // 1kb max message limit;
  private POOL_STORAGE_TIME_LIMIT: number;

  static async init(config: Partial<MempoolConfig>) {
    const sketch = await Minisketch.create({ fieldSize: 64, capacity: 20 });
    return new Mempool({ ...config, sketch });
  }

  constructor(
    config: Partial<MempoolConfig> = {
      protocol: null,

      MAX_BLOCK_SIZE: 10000,
      MAX_MSG_BYTES: 1000, // 1kb max message limit;
    }
  ) {
    Object.assign(this, config);
  }
  
  get length() {
    return this.state.size;
  }
  
  

  async addTransaction(tx: any) {
    
    let _buff = this.protocol.Transaction.encode(tx).finish(); //encode transaction
    const hash = ethers.utils.keccak256(_buff); // generate arbitrary hash string 

    try { 
      this._validate(_buff);
      this.state.set(hash, _buff); //set valid transaction to the state set
    } catch (error) {
      this.handled.set(hash, {
        tx: _buff,
        timestamp: Date.now(),
        error: error as Error
      });
      throw error;
    }
  }
  
  /**
   * retrieves max bytes for a proposal block,
   * order of items is not garunteed due to the nature
   * of javascript maps forEach iteration order
   *
   */
  reapMaxBytes() {
    let acc = [];
    this.state.forEach((tx, hash) => {
      if (acc.length > this.MAX_BLOCK_SIZE) {
        acc.append([tx, hash]); 
        this.state.delete(hash);
      }
      return;
    });
    return acc;
  } 

  merge(_message: Buffer) {
    let message = this.protocol.Mempool.decode(_message);
    this._xor(message);
  }

  resolve(_message: Buffer) {
    let message = this.protocol.Mempool.decode(_message);
    this._xnot(message);
  }

  
  _xor(subset: Map<string, Buffer>) {
    subset.forEach((tx, hash) => {
     this.state.set(hash, tx); 
    });
  }
  
  _xnot(subset: Map<string, Buffer>) {
    subset.forEach((tx, hash) => {
      this.state.delete(hash);
    });
  }
 
  _validate(tx: Buffer) {
    if (this.protocol.Transaction.verify(tx)) {
      throw new Error("Check transaction params");
    }

    if (Buffer.byteLength(tx, "hex") > this.MAX_MSG_BYTES) {
      throw new Error("Transaction exceeded memory limit");
    }
    await validateTransaction(tx);
    //TODO: pass transaction to vm or equivilant
  }

<<<<<<< HEAD
=======
  get length() {
    return Array.from(this.state.keys()).length;
  }

  async addTransaction(tx: Transaction) {
    const timestamp = Date.now();
    let tBuf = this.protocol.Transaction.encode(tx).finish();
    const hash: string = ethers.utils.keccak256(tBuf);
    try {
      await this.validate(tBuf);
      this.state.set(hash, tBuf);
      this.sketch.addUint(ethers.utils.hexlify(hash).slice(23, 32));
    } catch (error) {
      this.handled.set(hash, {
        tx: tBuf,
        timestamp,
        hash: hash,
        error: error as Error,
      });
    }
  }

  async cleanup() {
    //TODO:
    this.sketch.destroy();
    this.sketch = await Minisketch.create({ fieldSize: 64, capacity: 20 });
  }

  async ackGossip(message: Buffer) {
    let msg = this.protocol.Mempool.decode(message).toObject();
    // set recieved message items with current state
  }

  async broadcast() {
    let m = Array.from(this.state.values());
    let mbuf = this.protocol.Mempool.encode({ txs: m }).finish();
    this.peer.pubsub.publish(this.POOL_GOSSIP_TOPIC, mbuf);
  }

  // to save memory and time broadcasts will include a temporary tHash of the current state of the mempool
  // this can be checked against the stored hash in the mempool. when recieving gossip from peers. if the mHash matches your current mHash
  // the message from that peer can be safely ignored without losing information.
  async _hashMempool() {
    return this.sketch.serialize();
  }
>>>>>>> aed/node
}
