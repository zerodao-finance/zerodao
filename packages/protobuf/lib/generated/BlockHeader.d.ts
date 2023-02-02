/// <reference types="node" />
/// <reference types="long" />
import type { Long } from "@grpc/proto-loader";
export declare const _BlockHeader_BlockType: {
    readonly STANDARD: "STANDARD";
    readonly BASE: "BASE";
    readonly REBASE: "REBASE";
};
export declare type _BlockHeader_BlockType = "STANDARD" | 0 | "BASE" | 1 | "REBASE" | 2;
export declare type _BlockHeader_BlockType__Output = typeof _BlockHeader_BlockType[keyof typeof _BlockHeader_BlockType];
export interface BlockHeader {
    type?: _BlockHeader_BlockType;
    parentHash?: Buffer | Uint8Array | string;
    baseHash?: Buffer | Uint8Array | string;
    txRoot?: Buffer | Uint8Array | string;
    planRoot?: Buffer | Uint8Array | string;
    prevStateRoot?: Buffer | Uint8Array | string;
    height?: number | string | Long;
    round?: number | string | Long;
    timestamp?: number | string | Long;
    signatories?: Buffer | Uint8Array | string;
    fee?: number | string | Long;
    _txRoot?: "txRoot";
    _planRoot?: "planRoot";
    _signatories?: "signatories";
}
export interface BlockHeader__Output {
    type: _BlockHeader_BlockType__Output;
    parentHash: Buffer;
    baseHash: Buffer;
    txRoot?: Buffer;
    planRoot?: Buffer;
    prevStateRoot: Buffer;
    height: string;
    round: string;
    timestamp: string;
    signatories?: Buffer;
    fee: string;
    _txRoot: "txRoot";
    _planRoot: "planRoot";
    _signatories: "signatories";
}
