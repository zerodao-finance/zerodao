import { ethers } from "ethers";
import _ from "lodash";
import { logger } from "../logger";
import { Message } from "protobufjs";



export class ZeroPool {
  public running: boolean = false;
  public state: Map<string, Buffer>;
  public handled: Map<string, any>;

  private _len: number = 0;
  private _cleanupInterval: any;
  private _gossipInterval: any;
  private peer: any; 
  private protocol: any;

  private POOL_GOSSIP_TIME: number = 5;
  private MAX_POOL_SIZE: number = 10000;
  private MAX_MSG_BYTES: number = 1000; // 1kb max message limit;

  static init(config: ZeroPoolConfig, peer, buffer) {
    return new this({ config, peer, buffer });
  }

  constructor({ config, peer, buffer }: any) {
    Object.bind(this, {
      config: config,
      peer: peer,
      buffer: buffer,
    });
  }

  async start() {
    if (this.running) return;
    this.running = true;

    /**
     *
     * start listening to peer gossip topic
     *
     */
    await (this.peer.pubsub.subscribe as any)(
      this.config.PEER_GOSSIP_TOPIC,
      async (msg) => {
        await this.handleGossip(msg);
      }
    );

    this._cleanupInterval = setInterval(
      this.cleanup.bind(this),
      this.config.POOL_STORAGE_TIME_LIMIT * 1000 * 60
    );

    this._gossipInterval = setInterval(
      this.gossipToPeers.bind(this),
      this.config.POOL_GOSSIP_TIME_LIMIT * 1000 * 60
    );

    return true;
  }

  
  async close() {
    if (!this.running) return;
    await this.cleanup();
    await this.peer.pubsub.unsubscribe(this.config.PEER_GOSSIP_TOPIC);
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

  async validate(tx: any) {
    let tx_buffer: Buffer = this.protocol.Transaction.encode(tx).finish(); // buffer
    if (tx_buffer.length > this.MAX_MSG_BYTES) {
      throw new Error("Transaction exceeded memory limit");     
    }

    // pass transaction to vm or equivilant
    
    
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
        timestamp: Date.now(),
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
    this.peer.pubsub.publish(this.config.PEER_GOSSIP_TOPIC, tBuf);
  }

  async validateTx(tx: any) {
    // Validate TX logic
    // ensure valid chain is selected
    // ensure addresses are valid
  }

  cleanup() {
    this.txPool.clear();
    this.handled.clear();
  }

  getThash() {
    const vals = Array.from(this.txPool.values());
    const buff: Buffer = this.buffer.TransactionBlock({ transactions: vals });
    const hash: string = ethers.utils.keccak256(buff.toString("hex"));
    return hash;
  }
}
