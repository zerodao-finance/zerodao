"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function BlockID(hash, psh) {
    this.PartSetHeader = psh;
    this.Hash = hash;
}
BlockID.prototype.isEquals = function (other) {
    if (this.hash === other.hash && this.PartSetHeader === other.PartSetHeader)
        return true;
    return false;
};
BlockID.prototype.isZero = function () { };
BlockID.prototype.isComplete = function () { };
BlockID.prototype.toKey = function () { };
BlockID.prototype.toProto = function () { };
BlockID.prototype.toString = function () { };
function BlockIDFromProto(blockID) {
}
//# sourceMappingURL=block.js.map