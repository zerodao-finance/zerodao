import { ethers } from "ethers";
import _ from "lodash";
import { logger } from "../logger";
import { Message } from "protobufjs";

export class ZeroPool {
 public running: boolean = false;
 public txPool: Map<string, Transaction>;
 public handled: Map<String, HandledTransaction>

 private _len: number = 0;
 private _cleanupInterval: (func, timeout) => _.throttle(func, timeout);
 private _gossipInterval: (func, timeout) => _.throttle(func, timeout);

 private Transaction: Message = this.buffer.lookupType("Transaction")
 private TransactionWithHash: Message = this.buffer.lookupType("TransactionWithHash");
 private TransactionBlock: Message = this.buffer.lookupType("TransactionBlock");
 private HashBlock: Message = this.buffer.lookupType("HashBlock");
 private buffer: any;
 private peer: any;

 static init:(config, peer, buffer) => ZeroPool { 
   return this({config, peer, buffer}) 
 }

 constructor({config, peer, buffer}: any) {
    super();
    Object.bind(this, {
      config: config,
      peer: peer,
      buffer: buffer
   }
 }

 public start() {
   if (this.running) return;
   this.running = true;
   // this.peer.subscribe() // handle new transactions 
   // this.peer.subscribe() // handle peer gossip
   
   this._cleanupInterval = setInterval(
     this.cleanup.bind(this),
     this.config.POOL_STORAGE_TIME_LIMIT * 1000 * 60;
   );

   this._gossipInterval = setInterval(
     this.gossipToPeers.bind(this),
     this.config.POOL_GOSSIP_TIME_LIMIT * 1000 * 60;
   );

   return true; 
 }

 public length() {
   return this._len;
 }

 public close() {
  await this.cleanup()
  // TODO: close pool conn logic 
 }


 public getPoolHashes() {
  let values = Array.from(this.txPool.keys());
  return this.HashBlock.encode({ hashes: values });
 }

 public getPoolState() {
   let values = Array.from(this.txPool.values());
   return this.TransactionBlock.encode({ transactions: values });
 }

 public getHandledHashes() {
   return Array.from(this.handled.keys());
 }

 public getHandledLogs() {
   return Array.from(this.handled.values());
 }

 public async addTx(tx: any) {
   const timestamp = Date.now();
   const hash: string = ethers.utils.keccak256(this.Transaction.encode(tx)).toString('hex');
   try {
     await this.validateTx(tx);
     this.txPool.set(hash, { tx: tx, hash: hash });
   } catch (error) {
     this.handled.set(hash, {tx: tx, timestamp: Date.now(), error: error as Error})
   }
 }


 private async handleGossip(txs: Buffer) {
   let txs = this.TransactionBlock.decode(txs);
   for (let i of txs.transactions) {
    this.txPool.set(i.hash, i.tx);
   } 
 }


 private async gossipToPeers() {
  let txs = Array.from(this.txPool.values());
  let tBuf: Buffer = this.TransactionBlock.encode({ transactions: txs });
  this.peer.pubsub(this.config.topic, tBuf); 
 }

 private async validateTx(): boolean {
   // Validate TX logic
   // ensure valid chain is selected
   // ensure addresses are valid
 }

 private async cleanup() {
  //TODO: cleanup logic
 }

 private async getThash() {
  const vals = Array.from(this.txPool.values());
  const buff: Buffer = this.buffer.TransactionBlock({ transactions: vals });
  const hash: string = ethers.utils.keccak256(buff).toString('hex');
  return hash;
 }

}
