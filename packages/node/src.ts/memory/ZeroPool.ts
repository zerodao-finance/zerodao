import { ethers } from "ethers";
import _ from "lodash";
import { logger } from "../logger";
import { Message } from "protobufjs";
import { Transaction } from "../core/types";


export class Mempool{
  public running: boolean = false;
  public state: Map<string, Buffer>;
  public handled: Map<string, any>;

  private _len: number = 0;
  private _cleanupInterval: any;
  private _gossipInterval: any;
  private peer: any; 
  private protocol: any;

  private POOL_GOSSIP_TOPIC: string = "";
  private POOL_GOSSIP_TIME: number = 5;
  private MEMORY_CLEANUP_TIME: number = 10;
  private MAX_POOL_SIZE: number = 10000;
  private MAX_MSG_BYTES: number = 1000; // 1kb max message limit;

  static init(peer) {
    logger.info("Mempool has been initialized");
    return new this({ peer });
  }

  constructor({ peer }: any) {
    Object.bind(this, {
      peer: peer,
    });
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
    //TODO:
  }


  async validate(tx: Buffer) {
    if (tx.length > this.MAX_MSG_BYTES) {
      throw new Error("Transaction exceeded memory limit");     
    }

    //TODO: pass transaction to vm or equivilant
    
    
  } 
  
  get length() {
    return (Array.from(this.state.keys())).length;
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
        tx: tBuf,
        hash: hash,
        timestamp: Date.now(),
        error: error as Error,
      });
    }
  }

  async cleanup() {
    //TODO:
  }

  async ackGossip(message: Buffer) {
    
    let msg = (this.protocol.Mempool.decode(message)).toObject();
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
    
    //TODO: implement
  }
}
