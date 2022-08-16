import { ZeroP2P } from "@zerodao/p2p";
import peerId = require("peer-id");
import lp from "it-length-prefixed";
import pipe from "it-pipe";
import { PublishEventEmitter } from "./PublishEventEmitter";
import deployments from "@zerodao/protocol";

export abstract class Request {
  static addressToChainId(address) {
    return this.prototype.getChainId.call({
      contractAddress: address
    });
  }
  static get PROTOCOL(): string | void {
    throw new Error("static get PROTOCOL() must be implemented");
  }
  public contractAddress?: string;
  serialize(): Buffer {
    throw new Error("Serialize must be implemented");
  }
  getChainId(): number {
    return Number(
      Object.keys(deployments).find((v) =>
        Object.keys(deployments[v]).find((network) =>
          Object.keys(deployments[v][network].contracts).find(
            (contract) =>
              deployments[v][network].contracts[contract].address ===
              this.contractAddress
          )
        )
      ) ||
        (() => {
          throw Error(
            "Request#getChainId(): no contract found at " + this.contractAddress
          );
        })()
    );
  }
  async publish(peer: ZeroP2P): Promise<PublishEventEmitter> {
    const request = this.serialize().toString('utf8');
    const result = new PublishEventEmitter();
    if (peer._keepers.length === 0) {
      setTimeout(() =>
        result.emit(
          "error",
          new Error("Cannot publish request if no keepers are found")
        ), 0);
    }
    (async () => {
      for (const keeper of peer._keepers) {
        try {
          const _peerId = await peerId.createFromB58String(keeper);
	  console.log([_peerId, (this as any).constructor.PROTOCOL]);
	  console.log(request);
          const { stream } = await peer.dialProtocol(
            _peerId,
            (this as any).constructor.PROTOCOL
          );
          pipe(request, lp.encode(), stream.sink);
          result.emit("dialed", keeper);
        } catch (e: any) {
          result.emit("error", e);
        }
      }
      result.emit("finish");
    })().catch((err) => result.emit("error", err));
    return result;
  }
}
