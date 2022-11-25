import { ethers } from "ethers";
import { CHAINS, TRANSACTIONS_TYPE } from "./transaction";

type TxHash = string;
interface typedTransaction {
  type: TRANSACTIONS_TYPE;
  to: string;
  data: Buffer;
  nonce: number;
  signature: Buffer;
  chain: CHAINS
}

class ZeroPool {
 public _running: boolean = false; //if the mempool is running or not
 public _pool: Map<string, any[]>; // maps an hash to a transaction pool Object
 public _length: number; // current size of the memPool
 private _pending: TxHash[] = [];
 private _gossipInterval: number;

 constructor(config){
   Object.assign(this, config);
   //TODO: constructor logic
 }

 public async initialize(config) {
  return this(config);
 }

 public async _addTx(tx: typedTransaction) {
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
