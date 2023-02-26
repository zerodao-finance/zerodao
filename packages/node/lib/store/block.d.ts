export declare class BlockStore {
    private _base;
    private _height;
    private _db;
    blockType: any;
    constructor(path: string);
    get base(): number;
    get height(): number;
    saveBlock(block: any, seenCommit: any): Promise<void>;
    getBlock(height: number): Promise<void>;
}
