"use strict"

import { protocol } from "../proto";

interface Peer {
  peerId: string;
  weight: number;
  priority: number;
}

export function Proposer() {
  this.peers = Peer[];
  this.hash = undefined;
  this.PENALTY = -1.125;
  this.protocol = protocol;
}



Proposer.prototype._hash = function () {
  let buf = this.protocol.ProposerProposer.encode({ peers: this.peers });
  this.hash = ethers.utils.keccak256(buf).toString('hex');
}

Proposer.prototype.initialize = function (peers: Peer[], hash: string) {
  this.peers = peers;
  this._hash();
}

Proposer.prototype.add = function (new_peer: Peer) {
  // add a way of verifying the initial priority of a peer
  new_peer.priority = (_.sumBy(this.peers, (o) => o.weight) + new_peer.weight) * this.PENALTY;
  this.peers.push(new_peer);
}

Proposer.prototype.update = function (connected_peers: string[]) {
  this.peers = _.filter(this.peers, function (o) => {
    return _.includes(connected_peers, o.peerId)
  })
}

Proposer.prototype.toBuffer = function () {
  let buf = this.protocol.ProposerPool.encode({ peers: this.peers, hash: this.hash });
  return buf;
}

Proposer.prototype.next = function () {
  // scale priority values
  let diff = _.maxBy(this.peers, (o) => o.priority) - _.minBy(this.peers, (o) => o.priority);
  let threshold = _.sumBy(this.peers, (o) => o.weight);
  if (diff > threshold) {
    scale = diff/threshold;
    this.peers = this.peers.map((i) => { 
      i.priority /= scale;
      return i;
    });
  }

  //center priorities around zero
  let avg = _.sumBy(this.peers, (o) => o.priority)/this._len();
  this.peers = this.peers.map((i) => {
    i.priority -= avg;
    return i;
  })

  //compute priorities and elect proposer
  this.peers = this.peers.map((i) => {
    i.priority += i.weight
  });

  let proposer = _.maxBy(this.peers, (o) => o.priority);
  this.peers = this.peers.map((o) => {
    if (o.peerId == proposer.peerId) {
      o.priority -= _.sumBy(this.peers, (o) => o.weight);
      return o;
    }
    return o;
  });

  return proposer;
}



