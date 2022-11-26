import { ETHERS } from "ethers";
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
  /**
   * 
   * remember to clear the interval in the cleanup code
   */
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

 async addTx(tx: typedTransaction) {
  const hash: string = tx.hash.toString(hex);
  const timestamp = Date.now();
  try {
    await (this._validate(tx));
    if (this._pool.has(hash)) return // disregard duplicate transaction
    this._pool.set(hash, { tx, added, hash }); // set the added tx with the hash as the key
    this._handled.set(hash, { hash, added });
    this._length++ // increase _length property by 1 transaction
  } catch (error) {
    this._handled.set(hash, { hash, added, error: error as Error});
    throw error;
  }

 }

 private _generateTHash() {
  let keys: string[] = new Array.from(this._pool.keys()) 
  // create buffer from keys
  // hash buffer keccak256
  // return hash
 }

 public async _handlePeerGossip(txHashes: string[])  {
   
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
