/*
 * this protocol allows nodes to rapidly bootstrap and join the network in a relatively updated state
 * by discovering application-level snapshots
 *
 * the alternative to state sync is joining consensus at the genesis state and replaying historical blocks via consensus or fast sync until the node is caught up with its peers
 * using state sync a node will have a truncated history ( can not audit the blockchain )
 */

type SNAPSHOT_REQUEST = {
  address: string;
  data: Buffer;
};

function newSyncer();
