import type { Transaction } from "./types";
import { TransferRequest } from "./TransferRequest";
export declare class TransferRequestV2 extends TransferRequest {
    static get PROTOCOL(): string;
    static get FIELDS(): string[];
    buildLoanTransaction(): Transaction;
    buildRepayTransaction(): Transaction;
}
