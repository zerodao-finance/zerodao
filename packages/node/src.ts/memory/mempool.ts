import { ethers } from "ethers";
import * as _ from "lodash";
import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { Message } from "protobufjs";
import { Minisketch } from "libminisketch-wasm";
import { Transaction } from "../core/types";
import { validateTransaction } from "../transaction";
export interface MempoolConfig {
  _len: number;
  _cleanupInterval: any;
  _gossipInterval: any;
  peer: any;
  protocol: any;
  sketch: Minisketch;

  POOL_GOSSIP_TIME: number;
  MAX_POOL_SIZE: number;
  MAX_MSG_BYTES: number; // 1kb max message limit;
  POOL_STORAGE_TIME_LIMIT: number;
  POOL_GOSSIP_TOPIC: string;
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
  }

  async start() {
    if (this.running) return;
    this.running = true;

    await (this.peer.pubsub.subscribe as any)(
      this.POOL_GOSSIP_TOPIC,
      async (msg) => {
        await this.ackGossip(msg);
      }
    );

    this._cleanupInterval = setInterval(
      this.cleanup.bind(this),
      this.MEMORY_CLEANUP_TIME * 1000 * 60
    );

    this._gossipInterval = setInterval(
      this.broadcast.bind(this),
      this.POOL_GOSSIP_TIME * 1000 * 60
    );

    return true;
  }

  async close() {
    if (!this.running) return;
    await this.cleanup();
    this.peer.pubsub.unsubscribe(this.POOL_GOSSIP_TOPIC);
    this.running = false;
    clearInterval(this._gossipInterval);
    clearInterval(this._cleanupInterval);
  }

  async validate(tx: Buffer) {
    if (tx.length > this.MAX_MSG_BYTES) {
      throw new Error("Transaction exceeded memory limit");
    }
    await validateTransaction(tx);
    //TODO: pass transaction to vm or equivilant
  }

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
}
