/// <reference types="node" />
/// <reference types="long" />
type Stake = {
    from: Buffer | Uint8Array | string;
    data: Buffer | Uint8Array | string;
    amount: number | string | Long;
    signature: Buffer | Uint8Array | string;
    nonce: number;
    asset: string;
};
declare function Stake({ from, data, nonce, signature, asset }?: Partial<Stake>): void;
