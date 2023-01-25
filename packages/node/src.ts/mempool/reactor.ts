import { ZeroP2P } from "@zerodao/p2p";
import { Mempool } from "./mempool";
import { protocol } from "@zerodao/protobuf";
import { pipe } from "it-pipe";
import * as lp from "it-length-prefixed";

export type MempoolReactor = {
  proxy: Mempool;
  serviceMethods: string[]

  new(proxy: Mempool): MempoolReactor;

  zero_sendTransaction(call, callback): void;
} 

export function MempoolReactor(proxy) {
  this.proxy = proxy;
  this.serviceMethods = ['zero_sendTransaction']
}

MempoolReactor.prototype.zero_sendTransaction = function (call, callback) {
  let [rsp, err] = this.proxy.checkTx(call.request);

  if (!err) { 
    callback(null, (msg) => rsp);
  } else {
    callback(null, { status: "ERROR" });
  }
};




