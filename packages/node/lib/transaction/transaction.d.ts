export declare class Transaction {
    constructor();
    runBlock(): Promise<void>;
    runTransaction(): Promise<void>;
    validateTransaction(tx: any): Promise<void>;
}
