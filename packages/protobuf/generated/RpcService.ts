// Original file: proto/ZeroProtocol.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type {
  BalanceQuery as _BalanceQuery,
  BalanceQuery__Output as _BalanceQuery__Output,
} from "./BalanceQuery";
import type {
  BalanceReply as _BalanceReply,
  BalanceReply__Output as _BalanceReply__Output,
} from "./BalanceReply";
import type { Stake as _Stake, Stake__Output as _Stake__Output } from "./Stake";
import type {
  Transaction as _Transaction,
  Transaction__Output as _Transaction__Output,
} from "./Transaction";
import type {
  TransactionReply as _TransactionReply,
  TransactionReply__Output as _TransactionReply__Output,
} from "./TransactionReply";

export interface RpcServiceClient extends grpc.Client {
  zero_getBalance(
    argument: _BalanceQuery,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_BalanceReply__Output>
  ): grpc.ClientUnaryCall;
  zero_getBalance(
    argument: _BalanceQuery,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_BalanceReply__Output>
  ): grpc.ClientUnaryCall;
  zero_getBalance(
    argument: _BalanceQuery,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_BalanceReply__Output>
  ): grpc.ClientUnaryCall;
  zero_getBalance(
    argument: _BalanceQuery,
    callback: grpc.requestCallback<_BalanceReply__Output>
  ): grpc.ClientUnaryCall;
  zeroGetBalance(
    argument: _BalanceQuery,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_BalanceReply__Output>
  ): grpc.ClientUnaryCall;
  zeroGetBalance(
    argument: _BalanceQuery,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_BalanceReply__Output>
  ): grpc.ClientUnaryCall;
  zeroGetBalance(
    argument: _BalanceQuery,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_BalanceReply__Output>
  ): grpc.ClientUnaryCall;
  zeroGetBalance(
    argument: _BalanceQuery,
    callback: grpc.requestCallback<_BalanceReply__Output>
  ): grpc.ClientUnaryCall;

  zero_sendTransaction(
    argument: _Transaction,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zero_sendTransaction(
    argument: _Transaction,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zero_sendTransaction(
    argument: _Transaction,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zero_sendTransaction(
    argument: _Transaction,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zeroSendTransaction(
    argument: _Transaction,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zeroSendTransaction(
    argument: _Transaction,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zeroSendTransaction(
    argument: _Transaction,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zeroSendTransaction(
    argument: _Transaction,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;

  zero_stakeTransaction(
    argument: _Stake,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zero_stakeTransaction(
    argument: _Stake,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zero_stakeTransaction(
    argument: _Stake,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zero_stakeTransaction(
    argument: _Stake,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zeroStakeTransaction(
    argument: _Stake,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zeroStakeTransaction(
    argument: _Stake,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zeroStakeTransaction(
    argument: _Stake,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
  zeroStakeTransaction(
    argument: _Stake,
    callback: grpc.requestCallback<_TransactionReply__Output>
  ): grpc.ClientUnaryCall;
}

export interface RpcServiceHandlers extends grpc.UntypedServiceImplementation {
  zero_getBalance: grpc.handleUnaryCall<_BalanceQuery__Output, _BalanceReply>;

  zero_sendTransaction: grpc.handleUnaryCall<
    _Transaction__Output,
    _TransactionReply
  >;

  zero_stakeTransaction: grpc.handleUnaryCall<
    _Stake__Output,
    _TransactionReply
  >;
}

export interface RpcServiceDefinition extends grpc.ServiceDefinition {
  zero_getBalance: MethodDefinition<
    _BalanceQuery,
    _BalanceReply,
    _BalanceQuery__Output,
    _BalanceReply__Output
  >;
  zero_sendTransaction: MethodDefinition<
    _Transaction,
    _TransactionReply,
    _Transaction__Output,
    _TransactionReply__Output
  >;
  zero_stakeTransaction: MethodDefinition<
    _Stake,
    _TransactionReply,
    _Stake__Output,
    _TransactionReply__Output
  >;
}
