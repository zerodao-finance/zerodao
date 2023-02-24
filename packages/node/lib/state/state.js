"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const lodash_1 = __importDefault(require("lodash"));
const protobuf_1 = require("@zerodao/protobuf");
const types = __importStar(require("../types"));
class State {
    constructor({ version, chainID, lastBlockHeight, lastBlockID, lastBlockTime, nextValidator, validators, lastValidators, lastHeightValidatorsChanged, consensusParams, lastHeightCOnsensusParamsChanged, lastResultsHash, appHash, }) {
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
    equals(_state) {
        return lodash_1.default.isMatch(this, _state);
    }
    isEmpty() {
        return lodash_1.default.isEmpty(this.validators);
    }
    bytes() {
        return this.toProto();
    }
    toProto() {
        let _buffer = protobuf_1.protocol.State.encode({
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
    fromProto(_buffer) {
        let message = protobuf_1.protocol.State.decode(_buffer);
        return protobuf_1.protocol.State.toObject(message, {
            longs: String,
            enums: String,
            bytes: String,
        });
    }
    makeBlock(height, txs, commit, evidence, proposerAddress) {
        var block = types.MakeBlock(height, txs, commit, evidence);
        var timestamp = Date.now();
        if (height == state.InitialHeight) {
            timestamp = state.LastBlockTime; // genesis time
        }
        else {
            timestamp = State.MedianTime(commit, state.LastValidator);
        }
        block.Header.Populate(state.Version.Consensus, state.ChainID, timestamp, state.LastBlockID, state.Validators.Hash(), state.NextValidators.Hash(), types.HsahConsensusParams(state.ConsensusParams), state.AppHash, state.LastResultsHash, proposerAddress);
        return block, block.MakePartSet(types.BlockPartSizeBytes);
    }
    /*
     * compute a median time for a given Commit (based on timestamp field of votes messages)
     * computed time is between timestamps of the votes sent by honest processes
     */
    static medianTime(commit, validators) {
        // TODO: implement median time
    }
    makeGenesisStateFromFile(doc) { }
    makeGenesisState(doc) { }
}
exports.State = State;
//# sourceMappingURL=state.js.map