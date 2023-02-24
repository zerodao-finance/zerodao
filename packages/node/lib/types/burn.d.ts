/// <reference types="node" />
/// <reference types="long" />
type Burn = {
    data: Buffer | Uint8Array | string;
    amount: number | string | Long;
    signature: Buffer | Uint8Array | string;
    nonce: number;
    asset: string;
};
declare function Burn({ data, nonce, signature, asset }?: Partial<Burn>): void;
