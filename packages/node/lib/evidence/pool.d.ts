/// <reference types="node" />
import { ZeroP2P } from "@zerodao/p2p";
import { EventEmitter } from "node:events";
import { DuplicateVoteEvidence } from "../types/evidence";
import { ValidatorSet } from "../types/validator-set";
import { Vote } from "../types/vote";
export declare class EvidencePool extends EventEmitter {
    height: string | number;
    evidenceList: DuplicateVoteEvidence[];
    p2p: ZeroP2P;
    protected _reactors: Map<string, any>;
    static init(height: string | number): EvidencePool;
    constructor(height: string | number);
    createEvidence(vote1: Vote, vote2: Vote, blockTime: string | number, valSet: ValidatorSet): any;
    setHeightAndFlush(height: string | number): void;
    flush(): void;
    addEvidence(evidence: DuplicateVoteEvidence): void;
    getEvidenceList(): DuplicateVoteEvidence[];
}
