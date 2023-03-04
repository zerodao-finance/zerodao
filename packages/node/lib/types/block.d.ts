export interface Block {
    Header: any;
    Data: ArrayBuffer[];
    Evidence: any;
    LastCommit: any;
}
export type Commit = {
    Height: number;
    Round: number;
    BlockID: any;
    Signatures: any[];
};
