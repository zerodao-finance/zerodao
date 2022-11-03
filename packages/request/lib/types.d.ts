import { type BytesLike } from "@ethersproject/bytes";
export declare type Transaction = {
    chainId: number;
    to: string;
    data: string;
};
export declare type QueryTXResult = {
    amount: string;
    nHash: BytesLike;
    pHash: BytesLike;
    signature: BytesLike;
};
//# sourceMappingURL=types.d.ts.map