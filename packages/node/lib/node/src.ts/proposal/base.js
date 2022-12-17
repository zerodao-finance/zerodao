"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proposer = void 0;
const proto_1 = require("../proto");
const ethers_1 = require("ethers");
const lodash_1 = __importDefault(require("lodash"));
function Proposer() {
  this.peers = [];
  this.hash = undefined;
  this.PENALTY = -1.125;
  this.protocol = proto_1.protocol;
}
exports.Proposer = Proposer;
Proposer.prototype._hash = function () {
  let buf = this.protocol.ProposerProposer.encode({ peers: this.peers });
  this.hash = ethers_1.ethers.utils.keccak256(buf);
};
Proposer.prototype.initialize = function (peers, hash) {
  this.peers = peers;
  this._hash();
};
Proposer.prototype.add = function (new_peer) {
  // add a way of verifying the initial priority of a peer
  new_peer.priority =
    (lodash_1.default.sumBy(this.peers, (o) => o.weight) + new_peer.weight) *
    this.PENALTY;
  this.peers.push(new_peer);
};
Proposer.prototype.update = function (connected_peers) {
  this.peers = lodash_1.default.filter(this.peers, function (o) {
    return lodash_1.default.includes(connected_peers, o.peerId);
  });
};
Proposer.prototype.toBuffer = function () {
  let buf = this.protocol.ProposerPool.encode({
    peers: this.peers,
    hash: this.hash,
  });
  return buf;
};
Proposer.prototype.next = function () {
  // scale priority values
  let max = lodash_1.default.maxBy(this.peers, (o) => o.priority);
  let min = lodash_1.default.minBy(this.peers, (o) => o.priority);
  let diff = max - min;
  let threshold = lodash_1.default.sumBy(this.peers, (o) => o.weight);
  if (diff > threshold) {
    let scale = diff / threshold;
    this.peers = this.peers.map((i) => {
      i.priority /= scale;
      return i;
    });
  }
  //center priorities around zero
  let avg = lodash_1.default.sumBy(this.peers, (o) => o.priority) / this._len();
  this.peers = this.peers.map((i) => {
    i.priority -= avg;
    return i;
  });
  //compute priorities and elect proposer
  this.peers = this.peers.map((i) => {
    i.priority += i.weight;
  });
  let proposer = lodash_1.default.maxBy(this.peers, (o) => o.priority);
  this.peers = this.peers.map((o) => {
    if (o.peerId == proposer.peerId) {
      o.priority -= lodash_1.default.sumBy(this.peers, (o) => o.weight);
      return o;
    }
    return o;
  });
  return proposer;
};
//# sourceMappingURL=base.js.map
