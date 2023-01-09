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

  protected logger: unknown;
  protected txsByte: number;

  protected height: number = 0;
  protected sketch: any;
  


  constructor() {
    this.sketch = await Sketch.init(20);
  }

  lock() {}
  unlock() {}
  reapMaxTxs() {}
  reapMaxBytes() {}
  flush() {}
  removeTxByElement() {}
  removeTxByKey() {}
  checkTx() {}

  update(
    newHeight: number,
    blockTxs: Map<types.TxKey, types.TX>,
  ) {
    this.height = newHeight;


  }

  addNewTransaction(tx: Tx, key: TxKey) {
    
  }

  recheckTransactions() {}

  canAddTx() {}

  purgeExpiredTxs() {}

  notifyTxsAvailable() {}

  
}

