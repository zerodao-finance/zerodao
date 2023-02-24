/// <reference types="node" />
type Validator = {
    address: string;
    pubkey: Uint8Array;
    power: number;
    priority: number;
};
export interface IValidatorSet {
    validators: Validator[];
    proposer: Validator;
    onInit(): void;
    onUpdate(): void;
}
interface ValidatorConstructor {
    new (validator: Validator[], proposer: Validator): ValidatorSet;
}
export declare class ValidatorSet implements IValidatorSet {
    validators: Validator[];
    proposer: Validator;
    totalVotingPower: number;
    static init(validators: Validator[], proposer: Validator, ctor?: ValidatorConstructor): ValidatorSet;
    static fromBuffer(_vBuffer: Buffer): any;
    constructor(validators: any, proposer: any);
    add(validator: Validator): void;
    update(vSet: Validator[]): void;
    toBuffer: () => any;
    initTotalVotingPower(validators: any): void;
    rebuild(): any;
    next(): Validator;
}
export {};
