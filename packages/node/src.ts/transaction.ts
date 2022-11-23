export const TRANSACTIONS_TYPE = {
    TRANSFER: 0,
    SLASH: 1,
};

export const CHAINS = {
    ETHEREUM: 'https://rpc.flashbots.net'
}

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
