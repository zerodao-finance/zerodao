
type Vote = {
	// properties 
	Type: VoteType;
	Height: number;
	Round: number;
	BlockID: BlockID;
	Timestamp: number;
	ValidatorAddress: Uint8Array | Buffer | string;
	ValidatorIndex: number;
	Signature: Uint8Array | Buffer;

	// functions
	commitSig(): void;
	voteSignBytes(): void;
	toString(): void;
	verify(): boolean;
	toProto(): void;
	fromProto(): void;
	copy(): Vote;

	//constructor
	new(type: VoteType, height: number, round: number, blockID: BlockID, timestamp: number, validatorAddress: Uint8Array | Buffer, validatorIndex: number, signature: Uint8Array | Buffer): Vote;
}

function Vote(
	type,
	height,
	round,
	blockID,
	timestamp,
	validatorAddress,
	validatorIndex?,
	signature
) {
	this.Type = type
	this.Height = height
	this.Round = round
	this.BlockID = blockID
	this.Timestamp = timestamp
	this.ValidatorAddress = validatorAddress
	this.ValidatorIndex = validatorIndex
	this.Signature = signature
}

Vote.prototype.commitSig = function () {
	if this.BlockID.IsComplete();
}

/*
 * returns proto-encoding of vote for signing
 */
Vote.prototype.voteSignBytes = function () {
}

Vote.prototype.copy = function () { 
	//TODO
	return copy
}

/* 
 * returns string representation of a vote
 */
Vote.prototype.toString = function () {
	
}

Vote.prototype.verify = function () {
}

Vote.prototype.toProto = function () {
}

Vote.prototype.fromProto = function (): Vote | Error {

}


