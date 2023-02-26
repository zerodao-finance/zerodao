/// <reference types="node" />
import * as types from "../types";
export interface IState {
    version: Version;
    chainID: string;
    initialHeight: number;
    lastBlockHeight: number;
    lastBlockID: types.BlockID;
    lastBlockTime: number | string;
    nextValidator: types.ValidatorSet;
    validators: types.ValidatorSet;
    lastValidators: types.ValidatorSet;
    lastHeightValidatorsChanged: number;
    consensusParams: types.ConsensusParams;
    lastHeightConsensusParamsChanged: number;
    lastResultsHash: Uint8Array;
    appHash: Uint8Array;
}
type Version = {
    version_number: number;
    software_vers: string;
};
export declare abstract class State {
    version: Version;
    chainID: string;
    initialHeight: number;
    lastBlockHeight: number;
    lastBlockID: types.BlockID;
    lastBlockTime: number | string;
    nextValidator: types.ValidatorSet;
    validators: types.ValidatorSet;
    lastValidators: types.ValidatorSet;
    lastHeightValidatorsChanged: number;
    consensusParams: types.ConsensusParams;
    lastHeightConsensusParamsChanged: number;
    lastResultsHash: Uint8Array;
    appHash: Uint8Array;
    constructor({ version, chainID, lastBlockHeight, lastBlockID, lastBlockTime, nextValidator, validators, lastValidators, lastHeightValidatorsChanged, consensusParams, lastHeightCOnsensusParamsChanged, lastResultsHash, appHash, }: Partial<IState>);
    equals(_state: State): boolean;
    isEmpty(): boolean;
    bytes(): any;
    toProto(): any;
    fromProto(_buffer: Buffer): any;
    makeBlock(height: number, txs: types.Tx[], commit: types.Commit, evidence: types.Evidence[], proposerAddress: Uint8Array | string): any;
    static medianTime(commit: types.Commit, validators: types.ValidatorSet): void;
    makeGenesisStateFromFile(doc: any): void;
    makeGenesisState(doc: any): State;
}
export {};
