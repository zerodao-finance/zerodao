import { TransferRequest } from "./TransferRequest";
import type { Transaction } from "./types";
export declare class TransferRequestV2 extends TransferRequest {
    static get PROTOCOL(): string;
    static get FIELDS(): string[];
    buildLoanTransaction(): Transaction;
    buildRepayTransaction(): Transaction;
}
