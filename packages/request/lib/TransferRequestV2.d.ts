/// <reference types="node" />
import { TransferRequest } from "./TransferRequest";
import type { Transaction } from "./types";
export declare class TransferRequestV2 extends TransferRequest {
    static get PROTOCOL(): string;
    serialize(): Buffer;
    buildLoanTransaction(): Transaction;
    buildRepayTransaction(): Transaction;
}
