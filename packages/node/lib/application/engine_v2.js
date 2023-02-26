"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionEngine = void 0;
const protobuf_1 = require("@zerodao/protobuf");
function TransactionEngine(trie) {
    this.trie = trie;
    this.receipts = [];
    this.messages = [];
}
exports.TransactionEngine = TransactionEngine;
TransactionEngine.prototype.checkTx = async function (txBuff) {
    let _decoded = protobuf_1.protocol.Transaction.decode(txBuff);
    let tx = protobuf_1.protocol.Transaction.toObject(_decoded, { longs: String, bytes: String, enums: String }); // javascript object notation of transaction
    let res = await this.validateTransaction(tx); // get response object from validate transaction call
};
TransactionEngine.prototype.validateTransaction = async function (tx) {
    // validate if an account exists 
};
//# sourceMappingURL=engine_v2.js.map