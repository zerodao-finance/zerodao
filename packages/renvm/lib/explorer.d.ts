export declare const explorer: (provider: any, asset: any, fromChain: any, toChain: any, from: any, to: any, nonce: any) => Promise<void>;
export declare const memoize: <Params extends unknown[], Result>(fn: (...params: Params) => Promise<Result>, { expiry, entryLimit }?: {
    expiry?: number | false;
    entryLimit?: number;
}) => (...params: Params) => Promise<Result>;
export declare const sleep: {
    (ms: number): Promise<void>;
    SECONDS: number;
    MINUTES: number;
};
