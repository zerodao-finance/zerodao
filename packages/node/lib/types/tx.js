"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Tx({ type, to, data, nonce, signature, chain } = {}) {
    this.type = type;
    this.to = to;
    this.data = data;
    this.nonce = nonce;
    this.signature = signature;
    this.chain = chain;
}
Tx.prototype.fromProto = function (_buff) {
    let body = this.protocol.Transaction.decode(_buff).toObject();
    Object.assign(this, ...body);
};
//# sourceMappingURL=tx.js.map