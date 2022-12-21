import grpc from "grpc";
<<<<<<< HEAD
import { Transaction, TransactionReply } from "../../../protobuf/generated";
declare type UnaryCallHandler = (call: grpc.ServerUnaryCall<Transaction>, callback: grpc.sendUnaryData<TransactionReply>) => void;
=======
import { Transaction, TransactionReply } from "../../../provider/proto";
type UnaryCallHandler = (
  call: grpc.ServerUnaryCall<Transaction>,
  callback: grpc.sendUnaryData<TransactionReply>
) => void;
>>>>>>> aed/node
interface ITransactionService {
  handleTransaction: UnaryCallHandler;
}
export declare const TransactionService: ITransactionService;
export {};
