/// <reference types="node" />
import { Vote } from "../core/types";
import { ValidatorSet } from "./validator-set";
export declare class DuplicateVoteEvidence {
    VoteA: Vote;
    VoteB: Vote;
    TotalVotingPower: number;
    ValidatorPower: number;
    Timestamp: number;
    static fromProto(Buffer: any): void;
    static create(vote1: Vote, vote2: Vote, blockTime: string | number, valSet: ValidatorSet): DuplicateVoteEvidence;
    toObject(): {
        VoteA: Vote;
        VoteB: Vote;
        TotalVotingPower: number;
        ValidatorPower: number;
        Timestamp: number;
    };
    constructor({ VoteA, VoteB, TotalPower, ValidatorPower, Timestamp, }: {
        VoteA: any;
        VoteB: any;
        TotalPower: any;
        ValidatorPower: any;
        Timestamp: any;
    });
}
export type Evidence = Buffer[][];
