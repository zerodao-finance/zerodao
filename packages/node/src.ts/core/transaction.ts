export const TRANSACTIONS_TYPE = {
    TRANSFER: 0,
    SLASH: 1,
} as const;

export const CHAINS = {
    ETHEREUM: 'https://rpc.flashbots.net'
} as const;

export class Transaction {
    constructor({
        type,
        to,
        data,
        nonce,
        signature,
        chain,
    }: any) {
        Object.assign(this, {
            type,
            to,
            data,
            nonce,
            signature,
            chain
        })
    }
}
