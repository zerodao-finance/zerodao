last;
ResultsHash: Uint8Array;
appHash: Uint8Array;
// methods
new ();
State;
equals(_state, State);
boolean;
isEmpty();
boolean;
toProto();
Buffer;
fromProto(buf, Buffer);
State;
makeBlock();
Block;
;
function State() {
    this.version;
    this.chainId;
    this.initialHeight;
    this.lastBlockHeight;
    this.lastBlockId;
    this.nextValidator;
    this.validators;
    this.lastHeightValidatorsChanged;
    this.consensusParams;
    this.lastHeightConsensusParamsChanged;
    this.lastResultsHash;
    this.appHash;
}
State.prototype.serialize = function () { };
//# sourceMappingURL=state_v2.js.map