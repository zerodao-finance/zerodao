import { ethers } from "ethers";
import * as _ from "lodash";
import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { Message } from "protobufjs";
import { Transaction } from "../core/types";

<<<<<<< HEAD
export class Mempool {
=======
export interface ZeroPoolConfig {
  _len: number;
  _cleanupInterval: any;
  _gossipInterval: any;
  peer: any;
  protocol: any;

  POOL_GOSSIP_TIME: number;
  MAX_POOL_SIZE: number;
  MAX_MSG_BYTES: number; // 1kb max message limit;
  POOL_STORAGE_TIME_LIMIT: number;
  PEER_GOSSIP_TOPIC: any;
}

export class ZeroPool {
>>>>>>> ac4ad871be2b64b207358e17fd9dfef2693522a8
  public running: boolean = false;
  public state: Map<string, Buffer>;
  public handled: Map<string, any>;
  public buffer: any;
  public txPool: any;

  private _len: number = 0;
  private _cleanupInterval: any;
  private _gossipInterval: any;
<<<<<<< HEAD
  private peer: any;
=======
  private peer: ZeroP2P;
>>>>>>> ac4ad871be2b64b207358e17fd9dfef2693522a8
  private protocol: any;

  private POOL_GOSSIP_TOPIC: string = "zerodao:xnode:gossip:v1";
  private POOL_GOSSIP_TIME: number = 5;
  private MEMORY_CLEANUP_TIME: number = 10;
  private MAX_POOL_SIZE: number = 10000;
  private MAX_MSG_BYTES: number = 1000; // 1kb max message limit;
  private POOL_STORAGE_TIME_LIMIT: number;
  private PEER_GOSSIP_TOPIC: any;

<<<<<<< HEAD
  static init(peer) {
    logger.info("Mempool has been initialized");
    return new this({ peer });
  }

  constructor({ peer }: any) {
    Object.bind(this, {
      peer: peer,
    });
=======
  static init(config: Partial<ZeroPoolConfig>) {
    return new ZeroPool(config);
  }

  constructor(
    config: Partial<ZeroPoolConfig> = {
      _len: 0,
      _cleanupInterval: 3600,
      _gossipInterval: 3600,
      peer: null,
      protocol: null,

      POOL_GOSSIP_TIME: 5,
      MAX_POOL_SIZE: 10000,
      MAX_MSG_BYTES: 1000, // 1kb max message limit;
      POOL_STORAGE_TIME_LIMIT: 3600,
      PEER_GOSSIP_TOPIC: "/zeropool/0.0.1",
    }
  ) {
    Object.assign(this, config);
    console.log(this.peer);
>>>>>>> ac4ad871be2b64b207358e17fd9dfef2693522a8
  }

  async start() {
    if (this.running) return;
    this.running = true;

<<<<<<< HEAD
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
=======
    /**
     *
     * start listening to peer gossip topic
     *
     */

    this.peer.pubsub.subscribe(this.PEER_GOSSIP_TOPIC);
    this.peer.pubsub.on(this.PEER_GOSSIP_TOPIC, this.handleGossip);

    this._cleanupInterval = setInterval(
      this.cleanup.bind(this),
      this.POOL_STORAGE_TIME_LIMIT * 1000 * 60
    );

    this._gossipInterval = setInterval(
      this.gossipToPeers.bind(this),
>>>>>>> ac4ad871be2b64b207358e17fd9dfef2693522a8
      this.POOL_GOSSIP_TIME * 1000 * 60
    );

    return true;
  }

  async close() {
    if (!this.running) return;
<<<<<<< HEAD
=======
    await this.cleanup();
    this.peer.pubsub.unsubscribe(this.PEER_GOSSIP_TOPIC);
>>>>>>> ac4ad871be2b64b207358e17fd9dfef2693522a8
    this.running = false;
    clearInterval(this._gossipInterval);
    clearInterval(this._cleanupInterval);
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

  async addTx(tx: Transaction) {
    const timestamp = Date.now();
    let tBuf = this.protocol.Transaction.encode(tx);
    const hash: string = ethers.utils.keccak256(tBuf);
    try {
      await this.validate(tBuf);
      this.state.set(hash, tBuf);
    } catch (error) {
      this.handled.set(hash, {
<<<<<<< HEAD
        tx: tBuf,
=======
        tx: tx,
        timestamp,
>>>>>>> ac4ad871be2b64b207358e17fd9dfef2693522a8
        hash: hash,
        timestamp: Date.now(),
        error: error as Error,
      });
    }
  }

<<<<<<< HEAD
  async cleanup() {
    //TODO:
=======
  async handleGossip(txs: Buffer) {
    let _txs = this.buffer.TransactionBlock.decode(txs);
    for (let i of _txs.transactions) {
      this.txPool.set(i.hash, i.tx);
    }
  }

  async gossipToPeers() {
    let txs = Array.from(this.txPool.values());
    let tBuf: Buffer = this.buffer.TransactionBlock.encode({
      transactions: txs,
    });
    this.peer.pubsub.publish(this.PEER_GOSSIP_TOPIC, tBuf);
>>>>>>> ac4ad871be2b64b207358e17fd9dfef2693522a8
  }

  async ackGossip(message: Buffer) {
    let msg = this.protocol.Mempool.decode(message).toObject();
    // set recieved message items with current state
  }

<<<<<<< HEAD
  async broadcast() {
    let m = Array.from(this.state.values());
    let mbuf = this.protocol.Mempool.encode({ txs: m }).finish();
    this.peer.pubsub.publish(this.POOL_GOSSIP_TOPIC, mbuf);
=======
  async cleanup() {
    await this.txPool.clear();
    await this.handled.clear();
>>>>>>> ac4ad871be2b64b207358e17fd9dfef2693522a8
  }

  // to save memory and time broadcasts will include a temporary tHash of the current state of the mempool
  // this can be checked against the stored hash in the mempool. when recieving gossip from peers. if the mHash matches your current mHash
  // the message from that peer can be safely ignored without losing information.
  async _hashMempool() {
    //TODO: implement
  }
}
