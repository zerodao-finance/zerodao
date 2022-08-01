/// <reference types="node" />
import BaseTransferRequest from "./BaseTransferRequest";
import { type BytesLike } from "@ethersproject/bytes";
import { BigNumberish } from "@ethersproject/bignumber";
import type { Transaction } from "./types";
export declare class TransferRequestV2 extends BaseTransferRequest {
    static get PROTOCOL(): string;
    module: string;
    to: string;
    amount: BigNumberish;
    nonce: BytesLike | BigNumberish;
    pNonce: BytesLike | BigNumberish;
    contractAddress?: string;
    data: string;
    constructor(params: {
        module: string;
        to: string;
        amount: BigNumberish;
        nonce: BytesLike | BigNumberish;
        pNonce: BigNumberish;
        contractAddress?: string;
        data: string;
        network?: "mainnet" | "testnet";
    });
    serialize(): Buffer;
    buildLoanTransaction(): Transaction;
    buildRepayTransaction(): Transaction;
}
