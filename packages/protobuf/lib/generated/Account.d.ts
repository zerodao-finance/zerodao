/// <reference types="node" />
/// <reference types="long" />
import type { Long } from "@grpc/proto-loader";
export interface Account {
    address?: Buffer | Uint8Array | string;
    unStakedBalance?: number | string | Long;
    stakedBalance?: number | string | Long;
    nonce?: number | string | Long;
}
export interface Account__Output {
    address: Buffer;
    unStakedBalance: string;
    stakedBalance: string;
    nonce: string;
}
