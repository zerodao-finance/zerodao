import { Transaction } from "../proto/Transaction";
import { TransactionReply } from "../proto/TransactionReply";
export declare class Client {
    service: any;
    static PROTO_PATH: string;
    static URL: string;
    constructor(url?: string);
    handleTransaction(data: Transaction): Promise<TransactionReply>;
}
