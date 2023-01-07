
type VoteSet = {
	chainId: string;
	height: number;
	round: number;
	signedMsgType: unknown;
	valSet: ValidatorSet; 

	votes: Vote[];
	maj23: BlockID; // first 2/3 majority seen
	votesByBlock: Map<string, BlockVotes>;
	peerMaj23s: Map<p2pid, BlockID>
}
