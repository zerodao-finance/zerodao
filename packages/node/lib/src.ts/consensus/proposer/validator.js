"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorSet = void 0;
const lodash_1 = __importDefault(require("lodash"));
class ValidatorSet {
    static init(validators, proposer, ctor) {
        if (ctor)
            return new ctor(validators, proposer);
        return Validator(validators, proposer);
    }
    static fromBuffer(_vBuffer) {
        let validatorMessage = protocol.ValidatorSet.decode(_vBuffer);
        var { validators, proposer } = protocol.ValidatorSet.toObject(validatorMessage, {
            longs: String,
            enums: String,
            bytes: String
        });
        return Validator.init(validators, proposer);
    }
    constructor(validators, proposer) {
        // returns Buffer
        this.toBuffer = function () {
            let _message = this.protocol.Validator.create({ validators: this.validators, proposer: this.proposer });
            return protocol.ValidatorSet.encode(_message).finish();
        };
        this.validators = validators;
        this.proposer = proposer;
        this.initTotalVotingPower(validators);
    }
    add(validator) {
        validator.priority = (lodash_1.default.sumBy(this.validators, (v) => v.power) + validator.power) * this.constructor.INIT_PENALTY;
        this.validators.push(validator);
    }
    update(vSet) {
        this.peers = lodash_1.default.union(this.validators, vSet);
    }
    initTotalVotingPower(validators) {
        this.totalVotingPower = lodash_1.default.sumBy(validators, (v) => v.power);
    }
    rebuild() {
        //scale priority values
        let max = lodash_1.default.maxBy(this.validators, (v) => v.priority);
        let min = lodash_1.default.minBy(this.validators, (v) => v.priority);
        let diff = max - min;
        let threshold = 2 * lodash_1.default.sumBy(this.validators, (v) => v.power);
        if (diff > threshold) {
            let scale = diff / threshold;
            this.validators = this.validators.map((v) => {
                v.priority /= scale;
                return v;
            });
        }
        //center priority values around zero
        let avg = lodash_1.default.meanBy(this.validators, (v) => v.priority);
        this.validators = this.validators.map((v) => {
            v.priority -= avg;
            return v;
        });
        //compute priority and elect proposer
        this.validators = this.validators.map((v) => {
            v.priority += v.power;
            return v;
        });
        // resort validator set
        this.validators = lodash_1.default.orderBy(this.validators, ['priority'], ['asc']);
        this.proposer = lodash_1.default.head(this.validators);
        this.validators[0].priority -= this.totalVotingPower;
        return proposer;
    }
    next() {
        this.rebuild();
        return this.proposer;
    }
}
exports.ValidatorSet = ValidatorSet;
//# sourceMappingURL=validator.js.map