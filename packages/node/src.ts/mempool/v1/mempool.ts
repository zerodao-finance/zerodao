type Mempool = {
  // methods
  checkTx(tx: types.Tx, txInfo: TxInfo): void | Error;
  removeTxByKey(txKey: types.TxKey): void | Error;
  reapMaxBytesMaxGas(maxBytes: number, maxGas: number) types.Txs;
  lock(): void;
  unlock(): void;
  update(
    blockHeight: number,
    blockTxs: types.Txs,
  );
  flush(): void;
  txsAvailable(): void;
  size(): number;
  sizeBytes(): number;
  height: number;
}

class Mempool {
  public txs: Map<types.TxKey, Buffer>;
  
  public size: number;

  protected mempoolBytes: number;
  
  protected cache: Set = new Set();
  protected logger: unknown;
  protected txsByte: number;

  protected height: number = 0;
  protected sketch: any;
  
  

  constructor() {
    this.sketch = await Sketch.init(20);
  }

  lock() {

  }

  unlock() {}

  reapMaxTxs(limit: number) {

  }

  reapMaxBytes() {}
  flush() {}
  removeTxByElement() {}
  removeTxByKey() {}

  checkTx(tx: Buffer) {
    
    // check bytes in Buffer
    // rejects buffer that is greater than config.MAX_TX_BYTES
    if (tx.length > this.config.MAX_TX_BYTES) return new Error("transaction exceeds max bytes");
    
    var txKey = ethers.utils.keccak256(tx); //generate key for transaction
    
    if (this.cache.has(tx)) {
      // tx is in cache 
      if (this.txs.has(txKey)) {
        // tx is in cache and pool   
        // TODO
      }
      return new Error("error: transaction in cache"); 
    }
    this.cache.add(tx);
    
    
    let rsp, err = this.appProxy.checkTxSync(abci.RequestCheckTx{Tx: tx});
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
  addNewTransaction(wtx: WrappedTx, checkResponse) {
    let tx_size = wtx.tx.length
    if (checkResponse.Code != abci.CodeTypeOK) {
      logger.info(` rejected bad transacation `);
      //TODO implement metrics cache with badTransaction incrementer
      //remove bad transaction from cache
      this.cache.delete(wtx.tx);
    }
    
    // transaction can be considered valid at this point

    this.txs.set(wtx.txKey, wtx);
  }

  update(
    newHeight: number,
    blockTxs: Map<types.TxKey, types.TX>,
  ) {
    this.height = newHeight;


  }

  addNewTransaction(tx: Tx, key: TxKey) {
    
  }

  recheckTransactions() {
    if (_.isEmpty(this.txs.values())) return new Error("cannot run recheck on an empty mempool");
    

  }

  purgeExpiredTxs() {}

  notifyTxsAvailable() {}

  
}

