import { Service } from "../rpc/service";
import { Peer } from "../p2p";

export class MempoolReactor extends Service {
  gossipService: string = "zero/v.1/gossip/transaction";
  canGossip: boolean = true; // @defaults true
  p2p: ZeroP2P | Peer = undefined;
  proxy: any = undefined; // change to proxy app abstract class instance
  
  constructor( proxyApp, peer ) {
    super();
    this.p2p = peer;
    this.proxy = proxyApp;
    this.serviceMethods.push("zero_sendTransaction");
  }

  async setCanGossip() {
    this.gossip = await this.p2p.createPubsubProtocol(this.gossipService, async (msg) => {
      let { data, from } = msg;
      let [ rsp, err] = this.proxy.checkTx(protocol.Transaction.decode(data));
      if (err) logger.error(`got error: ${ err } from transaction recieved from ${ from }`);

      logger.log({
        level: 'verbose', 
        message: `heard message from: ${ this.p2p.peerId } \n from Peer ${ from } \n Message recieved: ${ msg } with response ${ rsp }`
      });
    });

    this.canGossip = true;
  }

  async zero_sendTransaction(call, callback) {
    let [rsp, err] = await this.proxy.checkTx(call.request);
    let encoded_msg = protocol.Transaction.encode(call.request).finish();
    if (err) callback(null, { status: "ERROR" });
    if (this.canGossip && !err) {
      logger.info(`broadcasting message by: ${this.p2p.peerId} \n Message Gossiped: ${ rsp }`);
      this.gossip(this.gossipService, encoded_msg);
      callback(null, (msg) => rsp);
    }

  }
  
}
