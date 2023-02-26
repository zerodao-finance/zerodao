import { ZeroP2P } from "@zerodao/p2p";
import { Mempool } from "./mempool";
import { protocol } from "@zerodao/protobuf";
import { pipe } from "it-pipe";
import { logger } from "../logger";
import { Peer } from "../p2p";
import * as lp from "it-length-prefixed";

export type MempoolReactor = {
  proxy: Mempool;
  serviceMethods: string[];
  canGossip?: boolean;
  gossip: undefined | any;

  new(proxy: Mempool, p2p: Peer): MempoolReactor;

  zero_sendTransaction(call, callback): void;
  initTxGossip(): Promise<void>;
} 

export function MempoolReactor(proxy, p2p) {
  this.proxy = proxy;
  this.p2p = p2p;
  this.serviceMethods = ['zero_sendTransaction'];
  this.gossipService = "zero/v.1/gossip/transaction";
  this.canGossip = false;
  this.gossip = undefined;
}

MempoolReactor.prototype.initTxGossip = async function () {
  this.gossip = await this.p2p.createPubsubProtocol(this.gossipService, async (msg) => {
    let { data, from } = msg;
    let tx = protocol.Transaction.decode(data);
    let [rsp, err] = this.proxy.checkTx(tx);
    if ( err ) logger.error(`got error: ${ err } from transaction recieved from ${ from }`);
    logger.log({
      level: "verbose",
      message: `heard message by: ${this.p2p.peerId} \n From Peer ${ from }  \n Message Recieved ${ msg } with response ${ rsp }`
    });
  });
  this.canGossip = true;
}

MempoolReactor.prototype.zero_sendTransaction = async function (call, callback) {
  let [rsp, err] = await this.proxy.checkTx(call.request);
  let encoded_msg = protocol.Transaction.encode(call.request).finish();
  if (this.canGossip) {
    logger.info(`broadcasting message by: ${ this.p2p.peerId } \n Message Gossipped: ${ rsp }`);
    console.log(encoded_msg)
    this.gossip(this.gossipService, encoded_msg);
  }

  if (!err) { 
    callback(null, (msg) => rsp);
  } else {
    callback(null, { status: "ERROR" });
  }
};


