"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DuplicateVoteEvidence {
    static fromProto(Buffer) {
    }
    ;
    static create(vote1, vote2, blockTime, valSet) {
        var val = valSet.getByAddress(vote1.ValidatorAddress); // @returns (index, address)
        if (!valSet.has(vote1.ValidatorAddress))
            return null;
        //TODO implement compare?
        let power = val.TotalVotingPower();
        let totalPower = valSet.totalVotingPower();
        return new DuplicateVoteEvidence({
            VoteA: vote1,
            VoteB: vote2,
            TotalVotingPower: totalPower,
            ValidatorPower: power,
            Timestamp: blockTime
        });
    }
    toObject() {
        return {
            this: .VoteA,
            this: .VoteB,
            this: .TotalVotingPower,
            this: .ValidatorPower,
            this: .Timestamp
        };
    }
    constructor({ VoteA: Vote, VoteB: Vote, TotalPower: number, ValidatorPower: number, Timestamp: number }) {
        Object.assign(this, {
            VoteA,
            VoteB,
            TotalPower,
            ValidatorPower,
            Timestamp
        });
    }
}
//# sourceMappingURL=evidence.js.map