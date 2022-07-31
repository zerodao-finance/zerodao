import { type BytesLike } from "@ethersproject/bytes";
export type Transaction = {
    chainId: string,
    to: string,
    data: string
}

export type QueryTXResult = {
    amount: string,
    nHash: BytesLike,
    pHash: BytesLike,
    signature: BytesLike
}