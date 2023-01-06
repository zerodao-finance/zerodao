import _ from "lodash";

class ValidatorSet {
	Validators: Validator[];
	Proposer: Validator;

	//cached (unexported);
	totalVotingPower number;
	
	constructor(validators: Validator[]) {
		
	}

	rescalePriorities(): void {}

	incrementProposerPriority(): Validator {}

	computeAvgProposerPriority(): number {}

	computeMaxMinPriorityDiff(): number {}

	getValWithMostPriority(): Validator {}
	
	shiftByAvgProposerPriority(): void {}

	validatorListCopy(): Validator[] {}

	copy(): ValidatorSet {}

	hasAddress(): boolean {}

	getByIndex(): <number, Validator> {}

	size(): number {}

	updateTotalVotingPower(): number {}

	getProposer(): Validator {}

	findProposer(): Validator {}

	hash(): Uint8Array | Buffer {}

	

}
