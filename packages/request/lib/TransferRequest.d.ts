/// <reference types="node" />
import { Buffer } from "buffer";
import { BigNumberish } from "ethers";
import RenJS, { Gateway } from "@renproject/ren";
import { Request } from "./Request";
export declare class TransferRequest extends Request {
    module: string;
    to: string;
    underwriter: string;
    asset: string;
    nonce: string;
    pNonce: string;
    amount: string;
    data: string;
    contractAddress: string;
    protected _queryTxResult: any;
    protected _mint: any;
    protected _deposit: any;
    static get PROTOCOL(): string;
    constructor(params: {
        module: string;
        to: string;
        underwriter?: string;
        asset: string;
        amount: BigNumberish;
        data: string;
        nonce?: BigNumberish;
        pNonce?: BigNumberish;
        contractAddress: string;
    });
    buildLoanTransaction(): void;
    buildRepayTransaction(): {
        to: string;
        data: string;
        chainId: number;
    };
    serialize(): Buffer;
    _getRemoteChain(): any;
    _getRemoteChainName(): "BTC" | "ZEC";
    _getRenVM(): RenJS;
    _getContractParams(): {
        to: string;
        method: string;
        params: {
            name: string;
            type: string;
            value: string;
        }[];
        withRenParams: boolean;
    };
    submitToRenVM(): Promise<Gateway>;
    waitForDeposit(): Promise<any>;
    getTransactionHash(): Promise<any>;
    waitForSignature(): Promise<any>;
    toGatewayAddress(): Promise<string>;
    fallbackMint(signer: any): Promise<any>;
}
