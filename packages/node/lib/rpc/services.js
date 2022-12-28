"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
function validateTransaction(transaction) {
    return true;
}
function handleTransactionMessage(call, callback) {
    callback(null, ackTransactionMessage(call));
}
function ackTransactionMessage(message) {
    try {
        validateTransaction(message);
        return { status: 0 };
    }
    catch (error) {
        return { status: 1, errorMsg: new TextEncoder().encode(error.message) };
    }
}
exports.TransactionService = {
    handleTransaction: handleTransactionMessage,
};
//# sourceMappingURL=services.js.map