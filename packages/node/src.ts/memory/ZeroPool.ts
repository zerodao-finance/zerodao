import { ethers } from "ethers";
import * as _ from "lodash";
import { logger } from "../logger";
import { ZeroP2P } from "@zerodao/p2p";
import { Message } from "protobufjs";

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
  public running: boolean = false;
  public state: Map<string, Buffer>;
  public handled: Map<string, any>;
  public buffer: any;
  public txPool: any;

  private _len: number = 0;
  private _cleanupInterval: any;
  private _gossipInterval: any;
  private peer: ZeroP2P;
  private protocol: any;

  private POOL_GOSSIP_TIME: number = 5;
  private MAX_POOL_SIZE: number = 10000;
  private MAX_MSG_BYTES: number = 1000; // 1kb max message limit;
  private POOL_STORAGE_TIME_LIMIT: number;
  private PEER_GOSSIP_TOPIC: any;

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
  }

  async start() {
    if (this.running) return;
    this.running = true;

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
      this.POOL_GOSSIP_TIME * 1000 * 60
    );

    return true;
  }

  get length() {
    return this._len;
  }

  async close() {
    if (!this.running) return;
    await this.cleanup();
    this.peer.pubsub.unsubscribe(this.PEER_GOSSIP_TOPIC);
    this.running = false;
  }

  getPoolHashes() {
    let values = Array.from(this.txPool.keys());
    return this.buffer.HashBlock.encode({ hashes: values });
  }

  getPoolState() {
    let values = Array.from(this.txPool.values());
    return this.buffer.TransactionBlock.encode({ transactions: values });
  }

  getHandledHashes() {
    return Array.from(this.handled.keys());
  }

  getHandledLogs() {
    return Array.from(this.handled.values());
  }

  async addTx(tx: any) {
    const timestamp = Date.now();
    let _tx = this.buffer.Transaction.encode(tx);
    const hash: string = ethers.utils.keccak256(_tx);
    try {
      await this.validateTx(tx);
      this.txPool.set(hash, { tx: tx, hash: hash });
    } catch (error) {
      this.handled.set(hash, {
        tx: tx,
        timestamp,
        hash: hash,
        error: error as Error,
      });
    }
  }

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
  }

  async validateTx(tx: any) {
    // Validate TX logic
    // ensure valid chain is selected
    // ensure addresses are valid
  }

  async cleanup() {
    await this.txPool.clear();
    await this.handled.clear();
  }

  getThash() {
    const vals = Array.from(this.txPool.values());
    const buff: Buffer = this.buffer.TransactionBlock({ transactions: vals });
    const hash: string = ethers.utils.keccak256(buff.toString("hex"));
    return hash;
  }
}
