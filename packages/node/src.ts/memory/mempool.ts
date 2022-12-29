import { ethers } from "ethers";
import * as _ from "lodash";
import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { Message } from "protobufjs";
import { Sketch } from "./sketch";
import { protocol } from "../proto";
import { Transaction } from "../core/types";

export interface MempoolConfig {
  _len: number;
  _cleanupInterval: any;
  _gossipInterval: any;
  peer: any;
  protocol: any;
  sketch: Sketch;
  POOL_GOSSIP_TIME: number;
  MAX_POOL_SIZE: number;
  MAX_MSG_BYTES: number; // 1kb max message limit;
  POOL_STORAGE_TIME_LIMIT: number;
  POOL_GOSSIP_TOPIC: string;
}

export interface MempoolMessage {
  messageType: "SKETCH" | "MEMORY" | "TX";
  data: Buffer & Buffer[];
}

export class Mempool {
  public running: boolean = false;
  public state: Map<string, Buffer>;
  public handled: Map<string, any>;

  private _len: number = 0;
  private _cleanupInterval: any;
  private _gossipInterval: any;
  private peer: ZeroP2P;
  private protocol: any;
  private sketch: Sketch;
  private POOL_GOSSIP_TOPIC: string = "zerodao:xnode:gossip:v1";
  private POOL_GOSSIP_TIME: number = 5;
  private MEMORY_CLEANUP_TIME: number = 10;
  private MAX_POOL_SIZE: number = 10000;
  private MAX_MSG_BYTES: number = 1000; // 1kb max message limit;
  private POOL_STORAGE_TIME_LIMIT: number;

  static async init(config: Partial<MempoolConfig>) {
    const sketch = await Sketch.init(20);
    return new Mempool({ ...config, sketch });
  }

  constructor(
    config: Partial<MempoolConfig> = {
      _len: 0,
      _cleanupInterval: 3600,
      _gossipInterval: 3600,
      peer: null,
      protocol: null,

      POOL_GOSSIP_TIME: 5,
      MAX_POOL_SIZE: 10000,
      MAX_MSG_BYTES: 1000, // 1kb max message limit;
      POOL_STORAGE_TIME_LIMIT: 3600,
      POOL_GOSSIP_TOPIC: "/zeropool/0.0.1",
    }
  ) {
    Object.assign(this, config);
    this.protocol = protocol;
  }

  async validate(tx: Buffer) {
    if (tx.length > this.MAX_MSG_BYTES) {
      throw new Error("Transaction exceeded memory limit");
    }

    //TODO: pass transaction to vm or equivilant
  }

  get length() {
    return Array.from(this.state.keys()).length;
  }

  async addTransaction(tx: Buffer) {
    const timestamp = Date.now();
    const hash: string = ethers.utils.keccak256(tx);
    try {
      await this.validate(tx);
      this.state.set(hash, tx);
      this.sketch.storeTx(hash);
    } catch (error) {
      this.handled.set(hash, {
        tx,
        timestamp,
        hash: hash,
        error: error as Error,
      });
    }
  }

  cleanup() {
    this.sketch.clear();
    this.state.clear();
    this.handled.clear();
  }

  async synchronize(serializedSketch: Buffer) {
    return await this.sketch.calculateDifferences(serializedSketch);
  }

  async resetMempool(mempool: Buffer[]) {
    this.cleanup();
    await mempool.reduce(async (a, d) => {
      await a;
      await this.addTransaction(d);
    }, Promise.resolve());
  }

  handlers = {
    SKETCH: this.synchronize,
    TX: this.addTransaction,
    MEMORY: this.resetMempool,
  };

  async handleBroadcast(msg: MempoolMessage) {
    this.handlers[msg.messageType](msg.data);
  }

  async broadcastValues() {
    let m = Array.from(this.state.values());
    return this.protocol.Mempool.encode({ txs: m }).finish();
  }

  _hashMempool() {
    return this.sketch.serialize();
  }
}