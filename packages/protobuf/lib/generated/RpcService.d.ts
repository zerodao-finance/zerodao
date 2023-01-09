import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type { Transaction as _Transaction, Transaction__Output as _Transaction__Output } from "./Transaction";
import type { TransactionReply as _TransactionReply, TransactionReply__Output as _TransactionReply__Output } from "./TransactionReply";
export interface RpcServiceClient extends grpc.Client {
    handleTransaction(argument: _Transaction, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_TransactionReply__Output>): grpc.ClientUnaryCall;
    handleTransaction(argument: _Transaction, metadata: grpc.Metadata, callback: grpc.requestCallback<_TransactionReply__Output>): grpc.ClientUnaryCall;
    handleTransaction(argument: _Transaction, options: grpc.CallOptions, callback: grpc.requestCallback<_TransactionReply__Output>): grpc.ClientUnaryCall;
    handleTransaction(argument: _Transaction, callback: grpc.requestCallback<_TransactionReply__Output>): grpc.ClientUnaryCall;
    handleTransaction(argument: _Transaction, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_TransactionReply__Output>): grpc.ClientUnaryCall;
    handleTransaction(argument: _Transaction, metadata: grpc.Metadata, callback: grpc.requestCallback<_TransactionReply__Output>): grpc.ClientUnaryCall;
    handleTransaction(argument: _Transaction, options: grpc.CallOptions, callback: grpc.requestCallback<_TransactionReply__Output>): grpc.ClientUnaryCall;
    handleTransaction(argument: _Transaction, callback: grpc.requestCallback<_TransactionReply__Output>): grpc.ClientUnaryCall;
}
export interface RpcServiceHandlers extends grpc.UntypedServiceImplementation {
    handleTransaction: grpc.handleUnaryCall<_Transaction__Output, _TransactionReply>;
}
export interface RpcServiceDefinition extends grpc.ServiceDefinition {
    handleTransaction: MethodDefinition<_Transaction, _TransactionReply, _Transaction__Output, _TransactionReply__Output>;
}
