import { ZeroP2P } from '@zerodao/p2p';
import peerId = require('peer-id');
import lp from 'it-length-prefixed';
import pipe from 'it-pipe';
import { EventEmitter } from "events";

function defer() {
  let resolve, reject, promise;
  promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    resolve,
    reject,
    promise
  };
};

export class PublishEventEmitter extends EventEmitter {
  toPromise() {
    const deferred = defer();
    this.on('finish', () => {
      deferred.resolve();
    });
    this.on('error', (e) => {
      deferred.reject(e);
    });
    return deferred.promise;
  }
}


export abstract class Request {
  static get PROTOCOL() { throw new Error('static get PROTOCOL() must be implemented'); }
  public contractAddress?: string;
  serialize(): Buffer {
    throw new Error("Serialize must be implemented")
  };

  getChainId(): string {
    this.contractAddress
    return
  }

  async publish(peer: ZeroP2P): Promise<PublishEventEmitter> {
    const request = this.serialize();
    const result = new PublishEventEmitter();
    if (peer.keepers.length === 0) {
      setImmediate(() => result.emit('error', new Error('Cannot publish request if no keepers are found')));
    }
    (async () => {
      for (const keeper of peer.keepers) {
        try {
          const _peerId = await peerId.createFromB58String(keeper);
          const { stream } = await peer.dialProtocol(_peerId, this.constructor().PROTOCOL);
          pipe(request, lp.encode(), stream.sink);
          result.emit('dialed', keeper);
        } catch (e: Error) {
          result.emit('error', new Error(`Failed dialing keeper: ${keeper}`);
        }
      }
      result.emit('finish');
    })().catch((err) => result.emit('error', err));
    return result;
  }


}
