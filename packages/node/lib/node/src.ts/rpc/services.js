"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
function validateTransaction(transaction) {
<<<<<<< HEAD
    return true;
=======
  return true;
>>>>>>> aed/node
}
function handleTransactionMessage(call, callback) {
  callback(null, ackTransactionMessage(call));
}
function ackTransactionMessage(message) {
<<<<<<< HEAD
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
=======
  try {
    validateTransaction(message); //TODO: implement validateTransaction()
    return { status: 0 };
  } catch (error) {
    return { status: 1, errorMsg: new TextEncoder().encode(error.message) };
  }
}
exports.TransactionService = {
  handleTransaction: handleTransactionMessage,
>>>>>>> aed/node
};
//# sourceMappingURL=services.js.map
