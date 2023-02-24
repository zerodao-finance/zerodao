/// <reference types="node" />
export declare class ValidatorSet {
    validators: Validator[];
    proposer: Validator;
    protected totalVotingPower: number;
    private priorityWindowSizeFactor;
    build(validators: Validator[], proposer: Validator): ValidatorSet;
    constructor(validators: Validator[], proposer: Validator);
    incrementProposerPriority(times: number): Validator;
    incrementAndElect(): Validator;
    rescalePriorities(diffMax: number): void;
    computeAvgProposerPriority(): number;
    computeMaxMinPriorityDiff(): number;
    getValWithMostPriority(): Validator;
    shiftByAvgProposerPriority(): void;
    validatorListCopy(): Validator[];
    copy(): ValidatorSet;
    hasAddress(): boolean;
    getByIndex(): any;
    size(): number;
    updateTotalVotingPower(): number;
    getProposer(): Validator;
    findProposer(): Validator;
    hash(): Uint8Array | Buffer;
}
