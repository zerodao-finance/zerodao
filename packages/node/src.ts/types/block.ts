export interface Block {
	Header: any; // TODO: define header type
	Data: ArrayBuffer[]; // TODO: define data type
	Evidence: any; //TODO: define Evidence data type
	LastCommit: any; //TODO: Define LastCommit data type
}


// Wrapper for list of signatures
// one for each participating validator
export type Commit = {
	Height: number; // Height at which the commit was created ( must be > 0 )
	Round: number; // Round that commit corresponds to ( must be > 0 )
	BlockID: any; // TODO: define BlockID type
	Signatures: any[]; //TODO: define CommitSig[] type
}
