import { Request } from "./Request";
import type { Transaction, QueryTXResult } from "./types";
import { Gateway } from "@renproject/ren";
import { type BytesLike } from "@ethersproject/bytes";
import { BigNumberish } from "@ethersproject/bignumber";
declare abstract class BaseTransferRequest extends Request {
    static get PROTOCOL(): string | void;
    _mint: any;
    requestType: string;
    contractAddress?: string;
    to: string;
    amount: BigNumberish;
    nonce?: BytesLike | BigNumberish;
    pNonce?: BytesLike | BigNumberish;
    private _ren;
    private bitcoin;
    private _contractFn;
    private _contractParams;
    private _queryTxResult;
    constructor(params: {
        network?: "mainnet" | "testnet";
    });
    buildLoanTransaction(): Transaction;
    buildRepayTransaction(): Transaction;
    submitToRenVM(): Promise<Gateway>;
    destination(contractAddress?: string, chainId?: number, signature?: string): void;
    waitForSignature(): Promise<QueryTXResult>;
    toGatewayAddress(): Promise<string>;
}
export default BaseTransferRequest;
