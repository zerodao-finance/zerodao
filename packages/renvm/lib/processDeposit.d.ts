export declare const processDeposit: (fromChain: any, toChain: any, inputTx: any, asset: any, to: any, shard: any, _nonce: any, amount: any) => Promise<"" | {
    tx: {
        version: number;
        hash: any;
        selector: any;
        in: any;
        out: any;
    };
    txStatus: any;
}>;
export declare const getPack: (selector: any, params: any, config: any, txHash: any) => Promise<"" | {
    tx: {
        version: number;
        hash: any;
        selector: any;
        in: any;
        out: any;
    };
    txStatus: any;
}>;
export declare const sendToRPC: (params: any, txHash: any, config?: any) => Promise<"" | {
    tx: {
        version: number;
        hash: any;
        selector: any;
        in: any;
        out: any;
    };
    txStatus: any;
}>;
export declare type JSONRPCResponse<T> = {
    jsonrpc: string;
    version: string;
    result: T;
    error: undefined;
    id: number;
} | {
    jsonrpc: string;
    version: string;
    result: undefined;
    error: any;
    id: number;
};
