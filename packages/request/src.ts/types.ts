export type Transaction = {
    chainId: string,
    to: string,
    data: string
}

export type QueryTXResult = {
    amount: string,
    nHash: HexString,
    pHash: HexString,
    signature: HexString
}