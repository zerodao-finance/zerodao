import grpc from "grpc";
import { Transaction, TransactionReply } from "../../../protobuf/generated";
function validateTransaction(transaction) {
  return true;
}

function handleTransactionMessage(
  call: grpc.ServerUnaryCall<Transaction>,
  callback: grpc.sendUnaryData<TransactionReply>
) {
  callback(null, ackTransactionMessage(call));
}

function ackTransactionMessage(message): { status: 0 | 1; errorMsg?: any } {
  try {
    validateTransaction(message);
    return { status: 0 };
  } catch (error) {
    return { status: 1, errorMsg: new TextEncoder().encode(error.message) };
  }
}

type UnaryCallHandler = (
  call: grpc.ServerUnaryCall<Transaction>,
  callback: grpc.sendUnaryData<TransactionReply>
) => void;

interface ITransactionService {
  handleTransaction: UnaryCallHandler;
}

export const TransactionService: ITransactionService = {
  handleTransaction: handleTransactionMessage,
};
