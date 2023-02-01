"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Vote(type, height, round, blockID, timestamp, validatorAddress, validatorIndex, signature) {
    this.Type = type;
    this.Height = height;
    this.Round = round;
    this.BlockID = blockID;
    this.Timestamp = timestamp;
    this.ValidatorAddress = validatorAddress;
    this.ValidatorIndex = validatorIndex;
    this.Signature = signature;
}
Vote.prototype.commitSig = function () {
    if (this.BlockID.IsComplete())
        ;
};
/*
 * returns proto-encoding of vote for signing
 */
Vote.prototype.voteSignBytes = function () {
};
Vote.prototype.copy = function () {
    //TODO
    return copy;
};
/*
 * returns string representation of a vote
 */
Vote.prototype.toString = function () {
};
Vote.prototype.verify = function () {
};
Vote.prototype.toProto = function () {
};
Vote.prototype.fromProto = function () {
};
//# sourceMappingURL=vote.js.map