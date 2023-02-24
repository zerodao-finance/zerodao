enum VoteType {
  A, // finish
  B
}

export class Vote {
  public Type: VoteType;
  public Height: number;
  public Round: number;
  public BlockID: any;
  public Timestamp: number;
  public ValidatorAddress: Uint8Array | Buffer | string;
  public ValidatorIndex: number;
  public Signature: Uint8Array | Buffer;
  constructor(
    type,
    height,
    round,
    blockID,
    timestamp,
    validatorAddress,
    validatorIndex?,
    signature
  ) {
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
    if (this.BlockID.IsComplete()) return; // unfinished
  }
  /*
   * returns proto-encoding of vote for signing
   */
  voteSignBytes() {}

  copy() {
    //TODO
    return copy;
  }

  /*
   * returns string representation of a vote
   */
  verify() {}

  toProto() {}

  fromProto(): Vote | Error {}
}
