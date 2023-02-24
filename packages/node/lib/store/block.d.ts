import { Block } from "../types";
export declare class BlockStore {
    private _base;
    private _height;
    private _db;
    blockType: any;
    constructor(path: string);
    get base(): number;
    get height(): number;
    saveBlock(block: Block, seenCommit: any): Promise<void>;
    getBlock(height: number): Promise<void>;
}
