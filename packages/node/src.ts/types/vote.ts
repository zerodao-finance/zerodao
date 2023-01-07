
type Vote = {
	Type: VoteType;
	Height: number;
	Round: number;
	BlockID: BlockID;
	Timestamp: number;
	ValidatorAddress: Uint8Array | Buffer | string;
	ValidatorIndex: number;
	Signature: Uint8Array | Buffer;
}
 
// implement function with constructor init that implements Vote type
