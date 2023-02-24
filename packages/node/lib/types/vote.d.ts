/// <reference types="node" />
declare enum VoteType {
    A = 0,
    B = 1
}
export declare class Vote {
    Type: VoteType;
    Height: number;
    Round: number;
    BlockID: any;
    Timestamp: number;
    ValidatorAddress: Uint8Array | Buffer | string;
    ValidatorIndex: number;
    Signature: Uint8Array | Buffer;
    constructor(type: any, height: any, round: any, blockID: any, timestamp: any, validatorAddress: any, validatorIndex?: any, signature: any);
    commitSig(): void;
    voteSignBytes(): void;
    copy(): any;
    verify(): void;
    toProto(): void;
    fromProto(): Vote | Error;
}
export {};
