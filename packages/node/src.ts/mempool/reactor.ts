import { Mempool } from "./mempool";
import { EventEmitter } from "events";

type Reactor = {
  p2p: typeof ZeroP2P;
  config: MempoolConfig;
  mempool: typeof Mempool;
}

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
    var message = (protocol.Mempool.decode(data)).toObject();
     
 }



 
}



