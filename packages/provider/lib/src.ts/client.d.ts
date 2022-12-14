import { Transaction } from "../proto/Transaction";
import { TransactionReply } from "../proto/TransactionReply";
export declare class Client {
    service: any;
    static PROTO_PATH: string;
    static PORT: string;
    static SERVER: string;
    constructor({ port, server }?: any);
    handleTransaction(data: Transaction): Promise<TransactionReply>;
}
