"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MempoolConstructor = void 0;
const mempool_1 = require("./mempool");
const reactor_1 = require("./reactor");
function MempoolConstructor(height, appProxy, mempoolConfig, p2p) {
    let mp = new mempool_1.Mempool(height, appProxy, mempoolConfig);
    let reactor = new reactor_1.MempoolReactor(mp, p2p);
    return [mp, reactor];
}
exports.MempoolConstructor = MempoolConstructor;
const testApp = {
    checkTxSync: function (tx) {
        return [{ Code: 1, value: "something" }, null];
    }
};
(() => {
    // let [ mp, reactor ] = MempoolConstructor(0, testApp, { MAX_BYTES: 10000 });  
    // console.log(mp, reactor)
});
//# sourceMappingURL=utils.js.map