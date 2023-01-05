/*
 *
 * State is a description of the latest committed block from the consensus engine
 * it holds all information required to validate new blocks
 * includes the last validator set and the consensus params
 * fields can be easily serialized.
 * State can be overridden with a new State instance but can't be directly mutated
 * use state.copy() or state.nextState();
 */

import _ from "lodash";
import { protocol } from "@zerodao/protobuf";
import * as types from "../types";

interface IState {
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
};

type Version = {
	version_number: number;
	software_vers: string;
}

abstract class State {
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
		appHash
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
			appHash
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
			appHash: this.appHash
		}).finish();

		return _buffer;
	}

	fromProto(_buffer: Buffer) {
		let message = protocol.State.decode(_buffer);
		return protocol.State.toObject(message, {
			longs: String,
			enums: String,
			bytes: String
		});
	}

	makeBlock() {}

	medianTime() {}

	makeGenesisStateFromFile(doc: GenesisDoc) {}

	makeGenesisState(doc): State {}
}



