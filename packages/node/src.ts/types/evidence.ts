import { Vote } from "../core/types";
import { ValidatorSet } from "./validator-set";

export class DuplicateVoteEvidence {
  VoteA: Vote;
  VoteB: Vote;
  TotalVotingPower: number;
  ValidatorPower: number;
  Timestamp: number;

  static fromProto(Buffer) {}

  static create(
    vote1: Vote,
    vote2: Vote,
    blockTime: string | number,
    valSet: ValidatorSet
  ) {
    var val = valSet.getByAddress(vote1.ValidatorAddress); // @returns (index, address)

    if (!valSet.has(vote1.ValidatorAddress)) return null;

    //TODO implement compare?

    let power = val.TotalVotingPower();
    let totalPower = valSet.totalVotingPower();

    return new DuplicateVoteEvidence({
      VoteA: vote1,
      VoteB: vote2,
      TotalVotingPower: totalPower,
      ValidatorPower: power,
      Timestamp: blockTime,
    });
  }

  toObject() {
    return {
      VoteA: this.VoteA,
      VoteB: this.VoteB,
      TotalVotingPower: this.TotalVotingPower,
      ValidatorPower: this.ValidatorPower,
      Timestamp: this.Timestamp,
    };
  }

  constructor({
    VoteA: Vote,
    VoteB: Vote,
    TotalPower: number,
    ValidatorPower: number,
    Timestamp: number,
  }) {
    Object.assign(this, {
      VoteA,
      VoteB,
      TotalPower,
      ValidatorPower,
      Timestamp,
    });
  }
}

export type Evidence = Buffer[][];
