import { ethers } from "ethers";
import * as _ from "lodash";
import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { Message } from "protobufjs";
import { Transaction } from "../core/types";

export interface MempoolConfig {
  protocol: any;

  MAX_POOL_SIZE: number;
  MAX_MSG_BYTES: number; // 1kb max message limit;
}

export class Mempool {
  public running: boolean = false;
  public state: Map<string, Buffer>;
  public handled: Map<string, any>;

  private protocol: any;
  private MAX_POOL_SIZE: number = 10000;
  private MAX_MSG_BYTES: number = 1000; // 1kb max message limit;

  static init(config: Partial<MempoolConfig>) {
    return new Mempool(config);
  }

  constructor(
    config: Partial<MempoolConfig> = {
      protocol: null,

      MAX_POOL_SIZE: 10000,
      MAX_MSG_BYTES: 1000, // 1kb max message limit;
    }
  ) {
    Object.assign(this, config);
  }

  get queryState() {
    return this.state.entries();
  }

  get length() {
    return this.state.size;
  }

  async set(tx: any) {
    let _buff = this.protocol.Transaction.encode(tx).finish();
    const hash = ethers.utils.keccak256(_buff);
    try { 
      this._validate(tx: Buffer);
      this.state.set(hash, _buff);
      return { status: 1 };
    } catch (error) {
      this.handled.set(hash, {
        tx: _buff,
        timestamp: Date.now(),
        error: error as Error
      });
      throw error;
    }
  }

  async constructBlock() {
    this
    //remove subset of state to block transaction field
  }

  async mergeState(newState: Buffer) {
    this._xor(newState);
  }

  async resolveCommit(commitedBlocks: Buffer) {
    this._xnot(commitedBlocks);
  }

  //Resolve set difference between two Mempool states 
  
  _xor(subset: Map<>) {

  }
  
  _xnot(subset: Map<>) {
     
  }
 
  _validate(tx: Buffer) {
    if (tx.length > this.MAX_MSG_BYTES) {
      throw new Error("Transaction exceeded memory limit");
    }

    //TODO: pass transaction to vm or equivilant
  }

}
