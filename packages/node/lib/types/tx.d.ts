/// <reference types="node" />
export type TX = {
    type: number;
    to: Uint8Array | string;
    data: Buffer | Uint32Array;
    nonce: number;
    signature: string | Buffer | Uint8Array | Uint16Array;
    chain?: number;
};
