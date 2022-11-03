import RenJS, { Gateway } from "@renproject/ren";
import { Request } from "./Request";
import { Transaction } from "./types";
export declare class BaseTransferRequest extends Request {
    module: string;
    to: string;
    asset: string;
    nonce: string;
    pNonce: string;
    amount: string;
    data: string;
    contractAddress: string;
    underwriter: string;
    protected _queryTxResult: any;
    protected _mint: any;
    protected _deposit: any;
    static get PROTOCOL(): string;
    static get FIELDS(): string[];
    buildLoanTransaction(): void;
    buildRepayTransaction(): Transaction;
    hash(): string;
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
