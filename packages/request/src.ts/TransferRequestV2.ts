import BaseTransferRequest from "./BaseTransferRequest";
import { randomBytes } from "@ethersproject/random";
import { hexlify, type BytesLike } from "@ethersproject/bytes";
import { BigNumberish } from "@ethersproject/bignumber";
import { Interface } from "@ethersproject/abi";
import { EthArgs } from "@renproject/interfaces";
import type { Transaction } from "./types";

export class TransferRequestV2 extends BaseTransferRequest {

    static get PROTOCOL() { return "/zero/2.0.0/dispatch" }
    public module: string;
    public to: string;
    public amount: BigNumberish;
    public nonce: BytesLike | BigNumberish;
    public pNonce: BytesLike | BigNumberish;
    public contractAddress?: string;
    public data: string;

    constructor(params: {
        module: string;
        to: string;
        amount: BigNumberish;
        nonce: BytesLike | BigNumberish;
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
        const _iface = new Interface([
            "function loan(address, address, uint256, uint256, bytes)"
        ])
        const data = _iface.encodeFunctionData("loan", [
            this.module,
            this.to,
            this.amount,
            this.nonce,
            this.data
        ])
        return {
            chainId: this.getChainId(),
            to: this.contractAddress,
            data: data
        }
    }

    buildRepayTransaction(): Transaction {
        const _iface = new Interface([
            "function repay(address, address, uint256, uint256, bytes, address, bytes32, bytes)"
        ])

        const data = _iface.encodeFunctionData("repay", [
            this.module,
            this.to,
            this.amount,
            this.nonce,
            this.data
        ])
        return {
            chainId: this.getChainId(),
            to: this.contractAddress,
            data: data
        }
    }



}
