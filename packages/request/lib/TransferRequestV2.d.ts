import { type BytesLike } from "@ethersproject/bytes";
import type { Transaction } from "./types";
import { TransferRequest } from "./TransferRequest";
export declare class TransferRequestV2 extends TransferRequest {
    loanId: BytesLike;
    static get PROTOCOL(): string;
    static get FIELDS(): string[];
    constructor(o: any);
    buildLoanTransaction(): Transaction;
    buildRepayTransaction(): Transaction;
}
