abstract class BaseMempool {

  constructor() {}

  abstract addNewTransaction(tx: TX) {}
  abstract insertTx() {}
  abstract handleRecheckResult() {}
  abstract recheckTransactions() {}
}
