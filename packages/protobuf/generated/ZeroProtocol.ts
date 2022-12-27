import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { RpcServiceClient as _RpcServiceClient, RpcServiceDefinition as _RpcServiceDefinition } from './RpcService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Account: MessageTypeDefinition
  BalanceQuery: MessageTypeDefinition
  BalanceReply: MessageTypeDefinition
  BlockHeader: MessageTypeDefinition
  Mempool: MessageTypeDefinition
  RpcService: SubtypeConstructor<typeof grpc.Client, _RpcServiceClient> & { service: _RpcServiceDefinition }
  Transaction: MessageTypeDefinition
  TransactionReply: MessageTypeDefinition
}

