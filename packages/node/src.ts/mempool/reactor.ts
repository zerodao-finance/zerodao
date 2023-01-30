import { ZeroP2P } from "@zerodao/p2p";
import { Mempool } from "./mempool";
import { protocol } from "@zerodao/protobuf";
import { pipe } from "it-pipe";
import { Peer } from "../p2p";
import * as lp from "it-length-prefixed";

export type MempoolReactor = {
  proxy: Mempool;
  serviceMethods: string[]

  new(proxy: Mempool, p2p: Peer): MempoolReactor;

  zero_sendTransaction(call, callback): void;
} 

export function MempoolReactor(proxy, p2p) {
  this.proxy = proxy;
  this.p2p = p2p;
  this.serviceMethods = ['zero_sendTransaction']
}

MempoolReactor.prototype.listenForGossip = function () {
  this.p2p.pubsub.subscribe('zero_sendTransaction', (msg) => {

  });
}

MempoolReactor.prototype.zero_sendTransaction = function (call, callback) {
  let [rsp, err] = this.proxy.checkTx(call.request);
  let encoded_msg = protocol.Transaction.encode(call.request).finish();
  this.p2p.pubsub.publish('zero_sendTransaction', encoded_msg);

  if (!err) { 
    callback(null, (msg) => rsp);
  } else {
    callback(null, { status: "ERROR" });
  }
};


type Reactor = {
  p2p: typeof ZeroP2P;
  config: MempoolConfig;
  mempool: typeof Mempool;
};

class MempoolReactor {
  p2p: ZeroP2P;
  config: MempoolConfig;
  mempool: typeof Mempool;

  constructor() {
    super();
  }

  /*
   * broadcast handler recieves broadcasts from peers and
   * passes data to the mempool impl
   */
  onUpdateBroadcast(data: Buffer) {
    var message = protocol.Mempool.decode(data).toObject();
  }
}
