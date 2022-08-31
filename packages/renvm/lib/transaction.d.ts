export declare const getTxDetails: (chain: any, params: any, asset: any, selector: any) => Promise<"" | {
    tx: {
        version: number;
        hash: any;
        selector: any;
        in: any;
        out: any;
    };
    txStatus: any;
}>;
