/// <reference types="node" />
import type { BatchDBOp, DB } from "@ethereumjs/trie";
import type { AbstractLevel } from "abstract-level";
export declare class LevelDB implements DB {
    readonly _leveldb: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer>;
    constructor(leveldb?: AbstractLevel<string | Buffer | Uint8Array, string | Buffer, string | Buffer> | null);
    get(key: Buffer): Promise<Buffer | null>;
    put(key: Buffer, val: Buffer): Promise<void>;
    del(key: Buffer): Promise<void>;
    batch(opStack: BatchDBOp[]): Promise<void>;
    copy(): DB;
}
