"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.CHAINS = exports.TRANSACTIONS_TYPE = void 0;
exports.TRANSACTIONS_TYPE = {
    TRANSFER: 0,
    SLASH: 1,
};
exports.CHAINS = {
    ETHEREUM: 'https://rpc.flashbots.net'
};
class Transaction {
    constructor({ type, to, data, nonce, signature, chain, }) {
        Object.assign(this, {
            type,
            to,
            data,
            nonce,
            signature,
            chain
        });
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map