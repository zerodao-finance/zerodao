import { ethers } from "ethers";
import { pipe } from "it-pipe";
import * as lp from "it-length-prefixed";

class MempoolReactor extends EventEmitter {

  mempool: Mempool;
  p2p: ZeroP2P;
  
  config = {}

  static async processReq(stream) {

  }

  constructor(){
     
  }

  
  async startHandler() {

    // handle incoming mempool from peer
    this.p2p.handle(["/mempool/1.0.0"], async ({ stream, protocol, connection }) => {
      let rsp, err = async MempoolReactor.processReq(stream);
      if (rsp === this.config.MempoolRequest) {
        this.serializeMempool(stream)
      }

      if (rsp === this.config.SketchRequest) {
        this.serializeSketch(stream);
      }

      if (rsp === this.config.Sketch) {
        this.resolveSketch(rsp)
      }

      if (rsp === this.config.Mempool) {
        this.resolveMempool(rsp);
      }
    }, {
      maxInboundStreams: 10,
      maxOutboundStreams: 10
    }) 

  }

  async requestPool(peer: string) {
    const stream = await this.p2p.dialProtocol(peer, ['/mempool/1.0.0']);
    await pipe(
      new TextEncoder().encode("/request/full-pool"),
      stream
    );
  }

  async requestSketch(peer: string) {
    const stream = await this.p2p.dialProtocol(peer, ['/mempool/1.0.0/request/sketch']);

    await pipe(
      new TextEncoder().encode("/request/sketch"),
      stream
    );
  }

  async handleSketch({ connection, stream, protocol}) {
   stream.source
   stream.sink
  }

  async handleMempool({ connection, stream, protocol }) {

  }

  async broadcastRoutine() {
    let encoded = protocol.MempoolSketch.encode({}).finish();
    await new Promise((resolve, reject) => {
      this.p2p.pubsub.publish(
        "zeronetwork:v.1:mempoolgossip",
        encoded
      );
    })
  }


}
