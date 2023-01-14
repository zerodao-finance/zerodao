import { WrappedTx } from "./tx";
import { Sketch } from "../sketch";

class Mempool {
  public txs: Map<string, Buffer>;
  protected cache: Set = new Set();
  protected height: number = 0;
  
  public length: number;
  protected size: number;
  
  protected logger: unknown;


  static init() {
    return new Mempool();
  }

  constructor() {
    
  }

  lock() {

  }

  unlock() {

  }

  /*
   * returns a list of transaction objects from the mempool
   * used to construct a block
   * @param max: number
   * if max < 0 or max > size of tx pool. returns the whole pool
   */
  async reapMaxTxs(max: number) {  
    if (max < 0 || max > this.txs.size ) {
      return _.map(this.txs.values(), (x) => x.tx);
    }
    
    
    var vals = _.map([...this.txs.values()], (x) => x.tx);
    return _.take(vals, max);
  }

  flush() {
    this.txs.clear();
    this.cache.clear();
  }

  async removeTxByKey(key: string) {
    let wtx = this.txs.get(key); 
    if ( wtx ) {
      this.cache.delete(wtx.tx);
      this.txs.delete(key);
    }
  }

  async checkTx(tx: Buffer) {
    
    // check bytes in Buffer
    // rejects buffer that is greater than config.MAX_TX_BYTES
    if (tx.length > this.config.MAX_TX_BYTES) return new Error("transaction exceeds max bytes");
    
    var txKey = ethers.utils.keccak256(tx); //generate key for transaction
    
    if (this.cache.has(txKey)) {
      // tx is in cache 
      if (this.txs.has(txKey)) {
        // tx is in cache and pool   
        // TODO
      }
      return new Error("error: transaction in cache"); 
    }
    this.cache.add(tx);
    
    
    let rsp, err = this.appProxy.checkTxSync(tx);
    if (err != null) {
      this.cache.delete(txKey);
      return err;
    }

    var wtx = WrappedTX.fromBytes(tx, txKey, Date.now(), height: this.height); 
    this.txs.addNewTransaction(wtx, rsp);
    logger.info(`adding new tx ${txKey} to mempool`);
  }


  /*
   * adds new wrapped transaction to the mempool,
   * use wrapped transactions as they include height at which the transaction was checked
   * if update is called in the case of a tendermint (Commit) message then recheck can be called
   * on transactions that are a height lower than the current height
   */
  async addNewTransaction(wtx: WrappedTx, checkResponse) {
    let tx_size = wtx.tx.length
    if (checkResponse.Code != abci.CodeTypeOK) {
      logger.info(` rejected bad transacation `);
      //TODO implement metrics cache with badTransaction incrementer
      //remove bad transaction from cache
      this.cache.delete(wtx.tx);
    }
    
    // transaction can be considered valid at this point

    this.txs.set(wtx.hash, wtx);
  }

  update(
    newHeight: number,
    blockTxs: Map<types.TxKey, types.TX>,
  ) {
    this.height = newHeight;


  }

  async recheckTransactions() {
    /*
     * pop transactions that are of height < this.height
     * run checkTx() on each popped txs
     */
    _recheck = _.filter([...this.txs.values()], (t) => t.height < this.height) 
    for (let wtx in _recheck) {
      let rsp, err = this.appProxy.checkTxSync(wtx.tx);
      if (checkResponse.Code != abci.CodeTypeOK) {
        this.cache.delete(wtx.hash);
        this.txs.delete(wtx.hash);
      }
      var _wtx = WrapedTX.fromBytes(wtx.tx, wtx.hash, wtx.timestamp, this.height);
      this.txs.set(_wtx.hash, _wtx);
    }
  }

  /*
   * creates a serialized sketch of the transaction mempool
   */
  async serialize() {
    var txs = [...this.txs.values()];
    let _s = Sketch.fromTxs(txs);
    return _s.serialize()
  }

  purgeExpiredTxs() {}

  notifyTxsAvailable() {}

  proxy() {
    return new Proxy(this, {});
  }
  
}

