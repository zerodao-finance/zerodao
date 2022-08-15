"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defer = void 0;
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
}
exports.defer = defer;
;
//# sourceMappingURL=defer.js.map