import type { ZeroP2P } from "@zerodao/p2p";
import peerId = require("peer-id");
import lp from "it-length-prefixed";
import pipe from "it-pipe";
import { PublishEventEmitter } from "./PublishEventEmitter";
import deployments from "@zerodao/protocol";
import { getAddress } from "@ethersproject/address";
import { decode, encode } from "@ethersproject/rlp";
import { arrayify, BytesLike } from "@ethersproject/bytes";
import { Buffer } from "buffer";

export abstract class Request {
  public contractAddress?: string;
  static addressToChainId(address) {
    return this.prototype.getChainId.call({
      contractAddress: address,
    });
  }
  static get PROTOCOL(): string | void {
    throw new Error("static get PROTOCOL() must be implemented");
  }
  static get FIELDS(): Array<string> {
    throw new Error("static get FIELDS() must be implemented");
  }
  serialize(): Buffer {
    return Buffer.from(
      arrayify(encode((this.constructor as any).FIELDS.map((v) => this[v])))
    );
  }
  static deserialize(data: BytesLike): Request {
    const RequestType = this as any;
    return new RequestType(
      decode(data).reduce((r, v, i) => {
        r[RequestType.FIELDS[i]] = v;
        return r;
      }, {})
    );
  }
  toJSON(...args: Array<any>): string {
    return JSON.stringify(this.toPlainObject(), ...args);
  }
  toPlainObject(): Object {
    const RequestType = this.constructor as any;
    return RequestType.FIELDS.reduce((r, v) => {
      r[v] = this[v];
      return r;
    }, {});
  }
  static fromJSON(data: string): Request {
    const RequestType = this as any;
    return new RequestType(JSON.parse(data));
  }
  getChainId(): number {
    return Number(
      Object.keys(deployments).find((v) =>
        Object.keys(deployments[v]).find((network) =>
          Object.keys(deployments[v][network].contracts).find(
            (contract) =>
              [
                "BadgerBridgeZeroController",
                "RenZECController",
                "ZeroBTC",
              ].includes(contract) &&
              getAddress(
                deployments[v][network].contracts[contract].address
              ) === getAddress(this.contractAddress)
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
    const request = this.serialize().toString("utf8");
    const result = new PublishEventEmitter();
    if (peer._keepers.length === 0) {
      setTimeout(
        () =>
          result.emit(
            "error",
            new Error("Cannot publish request if no keepers are found")
          ),
        0
      );
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
