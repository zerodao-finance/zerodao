"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorSet = void 0;
const lodash_1 = __importDefault(require("lodash"));
class ValidatorSet {
    build(validators, proposer) {
        return new ValidatorSet(validators, proposer);
    }
    constructor(validators, proposer) {
        //constant
        this.priorityWindowSizeFactor = 2;
        this.validators = validators;
        this.proposer = proposer;
        this.totalVotingPower = lodash_1.default.sumBy(validators, (v) => v.power); // calculate the sum of validators power
    }
    /*
     * increment proposer priority of each validator and update proposer
     * throw if validator set is empty
     *
     * @param: times (must be a positive number)
     */
    incrementProposerPriority(times) {
        if (lodash_1.default.isEmpty(this.validatorSet))
            throw new Error("validator set cannot be empty");
        if (times <= 0)
            throw new Error("times must be a positive non-zero integer");
        var diffMax = this.priorityWindowSizeFactor * this.totalVotingPower;
        this.rescalePriorities(diffMax);
        this.shiftByAvgProposerPriority();
        var proposer;
        for (let i = 0; i < times; i++) {
            proposer = this.incrementAndElect();
        }
        return proposer;
    }
    incrementAndElect() {
        this.validators = this.validators.map((v) => {
            v.priority += v.power;
            return v;
        });
        // sort validator by priority
        this.validators = lodash_1.default.orderBy(this.validators, ["priority"], ["asc"]);
        this.validators[0].priority -= this.totalVotingPower;
        return this.validators[0];
    }
    /*
     * rescale priorities such that: ( max - min ) < diffMax
     * panic if validator set is empty
     *
     * @param: diffMax ( 2 * totalVotingPower);
     */
    rescalePriorities(diffMax) {
        if (lodash_1.default.isEmpty(this.validators))
            throw new Error("validator set cannot be empty");
        if (diffMax <= 0)
            return;
        //calculate ceil (diff / diffMax );
        var diff = lodash_1.default.maxBy(this.validators, (v) => v.priority) -
            lodash_1.default.minBy(this.validators, (v) => v.priority);
        var ratio = (diff + diffMax - 1) / diffMax;
        if (diff > diffMax) {
            this.validators = this.validators.map((v) => {
                v.priority /= ratio;
                return v;
            });
        }
    }
    computeAvgProposerPriority() {
        return;
    }
    computeMaxMinPriorityDiff() {
        return;
    }
    getValWithMostPriority() {
        return;
    }
    shiftByAvgProposerPriority() {
        // center priority values around zero
        var avg = lodash_1.default.meanBy(this.validators, (v) => v.priority);
        this.validators = this.validators.map((v) => {
            v.priority -= avg;
        });
    }
    validatorListCopy() {
        return;
    }
    copy() {
        return;
    }
    hasAddress() {
        return;
    }
    getByIndex() {
        return;
    }
    size() {
        return;
    }
    updateTotalVotingPower() {
        return;
    }
    getProposer() {
        return;
    }
    findProposer() {
        return;
    }
    hash() {
        return;
    }
}
exports.ValidatorSet = ValidatorSet;
//# sourceMappingURL=validator-set.js.map