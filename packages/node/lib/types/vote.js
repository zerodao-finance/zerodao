"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vote = void 0;
var VoteType;
(function (VoteType) {
    VoteType[VoteType["A"] = 0] = "A";
    VoteType[VoteType["B"] = 1] = "B";
})(VoteType || (VoteType = {}));
class Vote {
    constructor(type, height, round, blockID, timestamp, validatorAddress, validatorIndex, signature) {
        this.Type = type;
        this.Height = height;
        this.Round = round;
        this.BlockID = blockID;
        this.Timestamp = timestamp;
        this.ValidatorAddress = validatorAddress;
        this.ValidatorIndex = validatorIndex;
        this.Signature = signature;
    }
    commitSig() {
        if (this.BlockID.IsComplete())
            return; // unfinished
    }
    /*
     * returns proto-encoding of vote for signing
     */
    voteSignBytes() { }
    copy() {
        //TODO
        return copy;
    }
    /*
     * returns string representation of a vote
     */
    verify() { }
    toProto() { }
    fromProto() { }
}
exports.Vote = Vote;
//# sourceMappingURL=vote.js.map