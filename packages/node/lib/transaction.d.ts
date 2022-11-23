export declare const TRANSACTIONS_TYPE: {
    TRANSFER: number;
    SLASH: number;
};
export declare const CHAINS: {
    ETHEREUM: string;
};
export declare class Transaction {
    constructor({ type, to, data, nonce, signature, chain, }: any);
}
