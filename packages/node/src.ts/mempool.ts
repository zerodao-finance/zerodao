import { ethers } from "ethers";
import { CHAINS, TRANSACTIONS_TYPE } from "./transaction";
import { protobuf } from "protobuf";

type TxHash = string;
interface typedTransaction {
  type: TRANSACTIONS_TYPE;
  to: string;
  data: Buffer;
  nonce: number;
  signature: Buffer;
  chain: CHAINS
}

export class ZeroPool {
  
 public _running: boolean = false; //if the mempool is running or not
 public _pool: Map<string, any[]>; // maps an hash to a transaction pool Object
 public _length: number; // current size of the memPool
 public opened: boolean;
 private _buffer: protobuf.load('../proto/ZeroProtocol.proto');
 private _pending: TxHash[] = [];
 private _gossipInterval: number;

 constructor(config){
   Object.assign(this, config);
   //TODO: constructor logic
 }

  /**
   * open a pool
   */
 public open(): boolean {
   if (this.opened) {
     return false
   }

   this.open = true
   return true;
 }

 /**
  * start tx processing
  */
 start(): boolean {
  if (this._running) return false;
  
  this._cleanupInterval == setInterval(
    this.cleanup.bind(this),
    this.POOL_STORAGE_TIME_LIMIT * 1000 * 60
  );

  this._running = true;
  return true;
 }

 public async initialize(config) {
  return this(config);
 }

 public async _addTx(tx: typedTransaction) {
  if (!await this._validate(tx)) return
  this._pending

   //TODO: add a typed transaction to the mempool
 }

 public async _handleAnnouncedTx(txHashes: Buffer[])  {
   //TODO: handle transaction hashes annouced via gossip
 }

 private async _gossipMemPool() {
  new Promise((resolve) => {
    setTimeout(() => this.annouceTxs, this._gossipInterval);
    resolve()
  })
 }

 private async _validate(tx: typedTransaction){
   //TODO: transaction validation logic
 }


 private async _cleanupPool() {
   //TODO: cleanup current mempool
 }
}
