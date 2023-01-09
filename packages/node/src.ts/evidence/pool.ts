type EvidencePool = {
	evidenceStore: unknown;
	evidenceList: unknown;
	evidenceSize: number;
	staetDB: Store;
	blockStore: BlockStore;
	state: State; // latestState
	consensusBuffer: duplicateVoteSet;
	pruningHeight: number;
	pruningTime: number;
}
