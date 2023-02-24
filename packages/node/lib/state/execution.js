function BlockExecutor(proxyApp, evBus, store, evPool, mempool, logger) {
    this.store = store;
    this.evPool = evPool;
    this.mempool = mempool;
    this.logger = logger;
    this.proxy = proxyApp;
    this.evBus = eventBus;
}
BlockExecutor.prototype.createProposal = function (height, state, proposerAddr) {
    evidence, evSize = this.evpool.pendingEv();
    txs = this.mempool.reapMaxTxs(number);
    return state.MakeBlock(height, txs, commit, evidence, proposerAddr);
};
//# sourceMappingURL=execution.js.map