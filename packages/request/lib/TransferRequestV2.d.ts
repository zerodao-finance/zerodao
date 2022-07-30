/// <reference types="node" />
import BaseTransferRequest from "./request";
import { BigNumberish } from "@ethersproject/bignumber";
import type { Transaction } from "./types";
export declare class TransferRequestV2 extends BaseTransferRequest {
    static PROTOCOL: "/zero/2.0.0/dispatch";
    module: string;
    to: string;
    amount: BigNumberish;
    nonce: BigNumberish;
    pNonce: BigNumberish;
    contractAddress?: string;
    data: string;
    private _contractParams?;
    constructor(params: {
        module: string;
        to: string;
        amount: BigNumberish;
        nonce: BigNumberish;
        pNonce: BigNumberish;
        contractAddress?: string;
        data: string;
        network?: "mainnet" | "testnet";
    });
    serialize(): Buffer;
    buildLoanTransaction(): Transaction;
    buildRepayTransaction(): Transaction;
}
