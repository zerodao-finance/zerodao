import { EventEmitter } from 'events';
import { defer } from "@zerodao/utils";

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
