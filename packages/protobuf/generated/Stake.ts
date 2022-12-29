// Original file: proto/ZeroProtocol.proto

import type { Long } from "@grpc/proto-loader";

export interface Stake {
  from?: Buffer | Uint8Array | string;
  data?: Buffer | Uint8Array | string;
  Balance?: number | string | Long;
  signature?: Buffer | Uint8Array | string;
}

export interface Stake__Output {
  from: Buffer;
  data: Buffer;
  Balance: string;
  signature: Buffer;
}
