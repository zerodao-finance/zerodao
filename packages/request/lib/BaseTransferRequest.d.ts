import type { Transaction, QueryTXResult } from "./types";
import { Gateway } from "@renproject/ren";
import { type BytesLike } from "@ethersproject/bytes";
import { BigNumberish } from "@ethersproject/bignumber";
declare abstract class BaseTransferRequest {
    _mint: any;
    requestType: string;
    contractAddress: string;
    to: string;
    amount: BigNumberish;
    nonce?: BytesLike | BigNumberish;
    pNonce?: BytesLike | BigNumberish;
    private _ren;
    private bitcoin;
    private _contractFn;
    private _contractParams;
    private _queryTxResult;
    buildLoanTransaction(): Transaction;
    buildRepayTransaction(): Transaction;
    submitToRenVM(): Promise<Gateway>;
    getChainId(): string;
    destination(contractAddress?: string, chainId?: number, signature?: string): void;
    waitForSignature(): Promise<QueryTXResult>;
    testInherit(): void;
    toGatewayAddress(): Promise<string>;
}
export default BaseTransferRequest;
