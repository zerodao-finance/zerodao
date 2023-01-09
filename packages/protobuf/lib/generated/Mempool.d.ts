/// <reference types="node" />
export interface Mempool {
    tx?: (Buffer | Uint8Array | string)[];
    hash?: Buffer | Uint8Array | string;
}
export interface Mempool__Output {
    tx: Buffer[];
    hash: Buffer;
}
