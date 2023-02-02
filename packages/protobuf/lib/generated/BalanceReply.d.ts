/// <reference types="long" />
/// <reference types="node" />
import type { Long } from "@grpc/proto-loader";
export declare const _BalanceReply_STATUS: {
    readonly SUCCESS: "SUCCESS";
    readonly ERROR: "ERROR";
};
export declare type _BalanceReply_STATUS = "SUCCESS" | 0 | "ERROR" | 1;
export declare type _BalanceReply_STATUS__Output = typeof _BalanceReply_STATUS[keyof typeof _BalanceReply_STATUS];
export interface BalanceReply {
    status?: _BalanceReply_STATUS;
    balance?: number | string | Long;
    address?: Buffer | Uint8Array | string;
    errorMsg?: Buffer | Uint8Array | string;
    _balance?: "balance";
    _address?: "address";
    _errorMsg?: "errorMsg";
}
export interface BalanceReply__Output {
    status: _BalanceReply_STATUS__Output;
    balance?: string;
    address?: Buffer;
    errorMsg?: Buffer;
    _balance: "balance";
    _address: "address";
    _errorMsg: "errorMsg";
}
