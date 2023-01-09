/// <reference types="node" />
/// <reference types="long" />
import type { Long } from "@grpc/proto-loader";
export declare const _Transaction_Chain: {
    readonly ETHEREUM: "ETHEREUM";
    readonly MONERO: "MONERO";
};
export type _Transaction_Chain = "ETHEREUM" | 0 | "MONERO" | 1;
export type _Transaction_Chain__Output = typeof _Transaction_Chain[keyof typeof _Transaction_Chain];
export declare const _Transaction_Type: {
    readonly TRANSFER: "TRANSFER";
    readonly SLASH: "SLASH";
};
export type _Transaction_Type = "TRANSFER" | 0 | "SLASH" | 1;
export type _Transaction_Type__Output = typeof _Transaction_Type[keyof typeof _Transaction_Type];
export interface Transaction {
    type?: _Transaction_Type;
    to?: Buffer | Uint8Array | string;
    data?: Buffer | Uint8Array | string;
    nonce?: number | string | Long;
    signature?: Buffer | Uint8Array | string;
    chain?: _Transaction_Chain;
}
export interface Transaction__Output {
    type: _Transaction_Type__Output;
    to: Buffer;
    data: Buffer;
    nonce: string;
    signature: Buffer;
    chain: _Transaction_Chain__Output;
}
