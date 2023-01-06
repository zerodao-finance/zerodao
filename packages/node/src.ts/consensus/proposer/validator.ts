import _ from "lodash";

type Validator = {
	address: string,
	pubkey: Uint8Array,
	power: number,
	priority: number
}

export interface IValidatorSet {
	validators: Validator[];
	proposer: Validator;
	onInit(): void;
	onUpdate(): void;
}

interface ValidatorConstructor {
	new (validator: Validator[], proposer: Validator): ValidatorSet;
}


export class ValidatorSet implements IValidatorSet {
	validators: Validator[];
	proposer: Validator;

	totalVotingPower: number;

	static init(
		validators: Validator[],
		proposer: Validator,
		ctor?: ValidatorConstructor,
	): ValidatorSet {
		if (ctor) return new ctor(validators, proposer);
		return Validator(validators, proposer);
	}

	static fromBuffer(_vBuffer: Buffer) {
		let validatorMessage = protocol.ValidatorSet.decode(_vBuffer);
		var { validators, proposer } = protocol.ValidatorSet.toObject(validatorMessage, {
			longs: String,
			enums: String,
			bytes: String
		})
		return Validator.init(validators, proposer);
	}

	constructor(validators, proposer) {
		this.validators = validators;
		this.proposer = proposer;
		this.initTotalVotingPower(validators);
	}

	add(validator: Validator) {
		validator.priority = (_.sumBy(this.validators, (v: Validator) => v.power) + validator.power) * (this as any).constructor.INIT_PENALTY;
		this.validators.push(validator);
	}
	
	update(vSet: Validator[]) {
		this.peers = _.union(this.validators, vSet);
	}

	// returns Buffer
	toBuffer = function () {
		let _message = this.protocol.Validator.create({ validators: this.validators, proposer: this.proposer });
		return protocol.ValidatorSet.encode(_message).finish();
	}

	initTotalVotingPower(validators) {
		this.totalVotingPower = _.sumBy(validators, (v: Validator) => v.power);
	}

	rebuild() {
		//scale priority values
		let max: any = _.maxBy(this.validators, (v: Validator) => v.priority);
		let min: any = _.minBy(this.validators, (v: Validator) => v.priority);
		let diff = max - min;
		let threshold = 2 * _.sumBy(this.validators, (v: Validator) => v.power);
		if (diff > threshold) {
			let scale = diff / threshold;
			this.validators = this.validators.map((v: Validator) => {
				v.priority /= scale;
				return v;
			});
		}

		//center priority values around zero
		let avg = _.meanBy(this.validators, (v: Validator) => v.priority);
		this.validators = this.validators.map((v: Validator) => {
			v.priority -= avg;
			return v;
		});
		
		//compute priority and elect proposer
		this.validators = this.validators.map((v: Validator) => {
			v.priority += v.power;
			return v;
		});	
		
		// resort validator set
		this.validators = _.orderBy(this.validators, ['priority'], ['asc']);

		this.proposer = _.head(this.validators);
		this.validators[0].priority -= this.totalVotingPower;
		return proposer;
	}

	next () {
		this.rebuild();
		return this.proposer;
	}
}
