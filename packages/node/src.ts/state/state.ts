/*
 *
 * State is a description of the latest committed block from the consensus engine
 * it holds all information required to validate new blocks
 * includes the last validator set and the consensus params
 * fields can be easily serialized.
 * State can be overridden with a new State instance but can't be directly mutated
 * use state.copy() or state.nextState();
 *
 * Transaction Engine should take instance of State and Block and validate a block.
 * this validated block is the content of a proposal that will be voted on in consensus rounds
 */

import _ from "lodash";
import { protocol } from "@zerodao/protobuf";
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

export abstract class State {
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

  constructor({
    version,
    chainID,
    lastBlockHeight,
    lastBlockID,
    lastBlockTime,
    nextValidator,
    validators,
    lastValidators,
    lastHeightValidatorsChanged,
    consensusParams,
    lastHeightCOnsensusParamsChanged,
    lastResultsHash,
    appHash,
  }: Partial<IState>) {
    Object.assign(this, {
      version,
      chainID,
      lastBlockHeight,
      lastBlockID,
      lastBlockTime,
      nextValidator,
      validators,
      lastValidators,
      lastHeightValidatorsChanged,
      consensusParams,
      lastHeightCOnsensusParamsChanged,
      lastResultsHash,
      appHash,
    });
  }

  equals(_state: State) {
    return _.isMatch(this, _state);
  }

  isEmpty() {
    return _.isEmpty(this.validators);
  }

  bytes() {
    return this.toProto();
  }

  toProto() {
    let _buffer = protocol.State.encode({
      version: this.version,
      chainID: this.chainID,
      initialHeight: this.initialHeight,
      lastBlockHeight: this.lastBlockHeight,
      lastBlockID: this.lastBlockID,
      lastBlockTime: this.lastBlockTime,
      nextValidator: this.nextValidator,
      validators: this.validators,
      lastValidators: this.lastValidators,
      lastHeightValidatorsChanged: this.lastHeightValidatorsChanged,
      consensusParams: this.consensusParams,
      lastHeightConsensusParamsChanged: this.lastHeightCOnsensusParamsChanged,
      lastResultsHash: this.lastResultsHash,
      appHash: this.appHash,
    }).finish();

    return _buffer;
  }

  fromProto(_buffer: Buffer) {
    let message = protocol.State.decode(_buffer);
    return protocol.State.toObject(message, {
      longs: String,
      enums: String,
      bytes: String,
    });
  }

  makeBlock(
    height: number,
    txs: types.Tx[],
    commit: types.Commit,
    evidence: types.Evidence[],
    proposerAddress: Uint8Array | string
  ) {
    var block = types.MakeBlock(height, txs, commit, evidence);

    var timestamp = Date.now();
    if (height == state.InitialHeight) {
      timestamp = state.LastBlockTime; // genesis time
    } else {
      timestamp = State.MedianTime(commit, state.LastValidator);
    }

    block.Header.Populate(
      state.Version.Consensus,
      state.ChainID,
      timestamp,
      state.LastBlockID,
      state.Validators.Hash(),
      state.NextValidators.Hash(),
      types.HsahConsensusParams(state.ConsensusParams),
      state.AppHash,
      state.LastResultsHash,
      proposerAddress
    );

    return block, block.MakePartSet(types.BlockPartSizeBytes);
  }

  /*
   * compute a median time for a given Commit (based on timestamp field of votes messages)
   * computed time is between timestamps of the votes sent by honest processes
   */
  static medianTime(commit: types.Commit, validators: types.ValidatorSet) {
    // TODO: implement median time
  }

  makeGenesisStateFromFile(doc: GenesisDoc) {}

  makeGenesisState(doc): State {}
}
