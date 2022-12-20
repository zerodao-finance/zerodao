import { ethers } from "ethers";
import * as _ from "lodash";
import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { Message } from "protobufjs";
import { Transaction } from "../core/types";
import { EventEmitter } from "events";

export interface MempoolConfig {
  protocol: any;

  MAX_BLOCK_SIZE: number;
  MAX_MSG_BYTES: number; // 1kb max message limit;
}

export class Mempool extends EventEmitter {
  public state: Map<string, Buffer>;
  public handled: Map<string, any>;

  private protocol: any;
  private MAX_BLOCK_SIZE: number = 10000;
  private MAX_MSG_BYTES: number = 1000; // 1kb max message limit;

  static init(config: Partial<MempoolConfig>) {
    return new Mempool(config);
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

    //TODO: pass transaction to vm or equivilant
  }

}
