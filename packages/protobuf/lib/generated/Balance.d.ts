/// <reference types="node" />
/// <reference types="long" />
import type { Long } from "@grpc/proto-loader";
export interface Balance {
    hash?: Buffer | Uint8Array | string;
    balance?: number | string | Long;
}
export interface Balance__Output {
    hash: Buffer;
    balance: string;
}
