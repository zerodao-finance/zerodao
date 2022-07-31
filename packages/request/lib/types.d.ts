import { type BytesLike } from "@ethersproject/bytes";
export declare type Transaction = {
    chainId: string;
    to: string;
    data: string;
};
export declare type QueryTXResult = {
    amount: string;
    nHash: BytesLike;
    pHash: BytesLike;
    signature: BytesLike;
};
