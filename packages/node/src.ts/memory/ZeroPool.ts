import { ethers } from "ethers";
import _ from "lodash";
import { logger } from "../logger";
import { Message } from "protobufjs";

type Transaction = {
  tx: any;
  hash: any;
}

type HandledTransaction = {
  tx: Transaction,
  timestamp: number,
  hash: string,
  error?: Error | string;
}

export class ZeroPool {
 public running: boolean = false;
 public txPool: Map<string, Transaction>;
 public handled: Map<String, HandledTransaction>

 private _len: number = 0;
 private _cleanupInterval: any;
 private _gossipInterval: any;
 private config: any;
 private buffer: any;
 private peer: any;

 static init(config, peer, buffer) { 
   return new this({config, peer, buffer}) 
 }

 constructor({config, peer, buffer}: any) {
    Object.bind(this, {
      config: config,
      peer: peer,
      buffer: buffer
   })

 }

 start() {
   if (this.running) return;
   this.running = true;
   // this.peer.subscribe() // handle new transactions 
   // this.peer.subscribe() // handle peer gossip
   
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

 get length() {
   return this._len;
 }

 async close() {
  await this.cleanup()
  // TODO: close pool conn logic 
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

 async addTx(tx:any) {
   const timestamp = Date.now();
   let _tx = this.buffer.Transaction.encode(tx)
   const hash: string = ethers.utils.keccak256(_tx);
   try {
     await this.validateTx(tx);
     this.txPool.set(hash, { tx: tx, hash: hash });
   } catch (error) {
     this.handled.set(hash, {tx: tx, timestamp: Date.now(), hash: hash, error: error as Error})
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
  let tBuf: Buffer = this.buffer.TransactionBlock.encode({ transactions: txs });
  this.peer.pubsub(this.config.topic, tBuf); 
 }

 async validateTx(tx: any) {
   // Validate TX logic
   // ensure valid chain is selected
   // ensure addresses are valid
 }

 cleanup() {
  //TODO: cleanup logic
 }

 getThash() {
  const vals = Array.from(this.txPool.values());
  const buff: Buffer = this.buffer.TransactionBlock({ transactions: vals });
  const hash: string = (ethers.utils.keccak256(buff.toString('hex')));
  return hash;
 }

}
