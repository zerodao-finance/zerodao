import grpc from "grpc";
import { Transaction, TransactionReply } from "../../../protobuf/generated";
declare type UnaryCallHandler = (call: grpc.ServerUnaryCall<Transaction>, callback: grpc.sendUnaryData<TransactionReply>) => void;
interface ITransactionService {
    handleTransaction: UnaryCallHandler;
}
export declare const TransactionService: ITransactionService;
export {};
