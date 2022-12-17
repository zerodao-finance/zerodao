"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishEventEmitter = void 0;
const events_1 = require("events");
const utils_1 = require("@zerodao/utils");
class PublishEventEmitter extends events_1.EventEmitter {
  toPromise() {
    const deferred = (0, utils_1.defer)();
    this.on("finish", () => {
      deferred.resolve();
    });
    this.on("error", (e) => {
      deferred.reject(e);
    });
    return deferred.promise;
  }
}
exports.PublishEventEmitter = PublishEventEmitter;
//# sourceMappingURL=PublishEventEmitter.js.map
