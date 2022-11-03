import { BigNumberish } from "@ethersproject/bignumber";
import type { Transaction } from "./types";
import { Request } from "./Request";
export declare class TransferRequestV2 extends Request {
    contractAddress: string;
    borrower: string;
    asset: string;
    borrowAmount: string;
    module: string;
    loanId: string;
    nonce: string;
    data: string;
    underwriter: string;
    protected _queryTxResult: any;
    protected _mint: any;
    protected _deposit: any;
    static get FIELDS(): string[];
    static get PROTOCOL(): string;
    constructor(params: {
        contractAddress: string;
        borrower: string;
        asset: string;
        borrowAmount: BigNumberish;
        module: string;
        loanId?: BigNumberish;
        nonce?: BigNumberish;
        data: string;
        underwriter?: string;
    });
    buildLoanTransaction(): Transaction;
    buildRepayTransaction(): Transaction;
}
//# sourceMappingURL=TransferRequestV2.d.ts.map