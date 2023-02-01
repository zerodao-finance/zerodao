"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrappedTx = void 0;
const ethers_1 = require("ethers");
const lodash_1 = __importDefault(require("lodash"));
function WrappedTx(tx, timestamp, height) {
    this.tx = tx;
    this.timestamp = timestamp;
    this.height = height;
    this.hash = ethers_1.ethers.utils.keccak256(tx);
}
exports.WrappedTx = WrappedTx;
WrappedTx.prototype.toBuffer = function () {
    return this.tx;
};
WrappedTx.prototype.Bytes = function () {
    return this.tx.length;
};
WrappedTx.prototype.Copy = function () {
    return lodash_1.default.cloneDeep(this);
};
WrappedTx.prototype.Hash = function () {
    return this.hash;
};
WrappedTx.prototype.CheckBytes = function (compareBytes) {
    if (this.Bytes() > compareBytes)
        return false;
    return true;
};
//# sourceMappingURL=tx.js.map