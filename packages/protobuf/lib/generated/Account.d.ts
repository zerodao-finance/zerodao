/// <reference types="node" />
/// <reference types="long" />
import type { Long } from "@grpc/proto-loader";
export interface Account {
    address?: Buffer | Uint8Array | string;
    balance?: number | string | Long;
    nonce?: number | string | Long;
}
export interface Account__Output {
    address: Buffer;
    balance: string;
    nonce: string;
}
