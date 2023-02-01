"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
/*
class ValidatorSet {
    public validators: Validator[];
    public proposer: Validator;

    //cached (unexported);
    protected totalVotingPower number;

    //constant
    private priorityWindowSizeFactor: number = 2;
    
    build(validators: Validator[], proposer: Validator) {
        return new ValidatorSet(validators, proposer);
    }

    constructor(validators: Validator[], proposer: Validator) {
        this.validators = validators;
        this.proposer = proposer;
        this.totalVotingPower = _.sumBy(validators, (v: Validator) => v.power); // calculate the sum of validators power
    }


    /*
     * increment proposer priority of each validator and update proposer
     * throw if validator set is empty
     *
     * @param: times (must be a positive number)
     *
    incrementProposerPriority(times: number): Validator {
        if (_.isEmpty(this.validatorSet)) throw new Error("validator set cannot be empty");
    
        if (times <= 0) throw new Error("times must be a positive non-zero integer");

        var diffMax = this.priorityWindowSizeFactor * this.totalVotingPower;
        this.rescalePriorities(diffMax);
        this.shiftByAvgProposerPriority();
        
        var proposer;

        for (let i = 0; i < times; i++) {
            proposer = this.incrementAndElect()
        }

        return proposer;
    }

    function incrementAndElect() {
        this.validators = this.validators.map((v: Validator) => {
            v.priority += v.power;
            return v;
        });
        
        // sort validator by priority
        this.validators = _.orderBy(this.validators, ['priority'], ['asc']);
        this.validators[0].priority -= this.totalVotingPower;
        return this.validators[0];
    }

    /*
     * rescale priorities such that: ( max - min ) < diffMax
     * panic if validator set is empty
     *
     * @param: diffMax ( 2 * totalVotingPower);
     */
rescalePriorities(diffMax, number);
void {
    if(_) { }, : .isEmpty(this.validators), throw: new Error("validator set cannot be empty"),
    if(diffMax) { }
} <= 0;
return;
//calculate ceil (diff / diffMax );
var diff = lodash_1.default.maxBy(this.validators, (v) => v.priority) - lodash_1.default.minBy(this.validators, (v) => v.priority);
var ratio = (diff + diffMax - 1) / diffMax;
if (diff > diffMax) {
    this.validators = this.validators.map((v) => {
        v.priority /= ratio;
        return v;
    });
}
computeAvgProposerPriority();
number;
{
    return;
}
computeMaxMinPriorityDiff();
number;
{
    return;
}
getValWithMostPriority();
Validator;
{
    return;
}
shiftByAvgProposerPriority();
void {
    // center priority values around zero
    var: avg = lodash_1.default.meanBy(this.validators, (v) => v.priority),
    this: .validators = this.validators.map((v) => {
        v.priority -= avg;
    })
};
validatorListCopy();
Validator[];
{
    return;
}
copy();
ValidatorSet;
{
    return;
}
hasAddress();
boolean;
{
    return;
}
getByIndex();
, Validator > {
    return: 
};
size();
number;
{
    return;
}
updateTotalVotingPower();
number;
{
    return;
}
getProposer();
Validator;
{
    return;
}
findProposer();
Validator;
{
    return;
}
hash();
Uint8Array | Buffer;
{
    return;
}
    * /;
//# sourceMappingURL=validator-set.js.map