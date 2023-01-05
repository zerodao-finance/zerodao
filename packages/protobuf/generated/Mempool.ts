// Original file: proto/ZeroProtocol.proto

import type { Transaction as _Transaction, Transaction__Output as _Transaction__Output } from './Transaction';

export interface Mempool {
  'data'?: ({[key: string]: _Transaction});
}

export interface Mempool__Output {
  'data': ({[key: string]: _Transaction__Output});
}
