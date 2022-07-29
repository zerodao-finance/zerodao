import BaseTransferRequest from "./request";
import { randomBytes } from "@ethersproject/random";
import { hexlify, arrayify } from "@ethersproject/bytes";
import { BigNumberish } from "@ethersproject/bignumber";
import { EthArgs } from "@renproject/interfaces";
import type { Transaction } from "./types";

export class TransferRequestV2 extends BaseTransferRequest {
    static PROTOCOL: "/zero/2.0.0/dispatch"

    public module: string;
    public to: string;
    public amount: BigNumberish;
    public nonce: BigNumberish;
    public pNonce: BigNumberish;
    public contractAddress?: string;
    public data: string;
    private _contractParams?: EthArgs;
    constructor(params: {
        module: string;
        to: string;
        amount: BigNumberish;
        nonce: BigNumberish;
        pNonce: BigNumberish;
        contractAddress?: string;
        data: string;
        network?: "mainnet" | "testnet";
    }) {
        super({ network: params.network })
        this.module = params.module;
        this.to = params.to;
        this.amount = params.amount;
        this.nonce = params.nonce
            ? hexlify(params.nonce)
            : hexlify(randomBytes(32));
        this.pNonce = params.pNonce
            ? hexlify(params.pNonce)
            : hexlify(randomBytes(32));
        this.data = params.data;
    }


    serialize(): Buffer {
        return Buffer.from(JSON.stringify({
            module: this.module,
            borrower: this.to,
            borrowAmount: this.amount,
            nonce: this.nonce,
            data: this.data
        }))
    }

    buildLoanTransaction(): Transaction {
        return
    }

    buildRepayTransaction(): Transaction {
        return
    }


}