import { Mempool } from "./mempool";
import { MempoolReactor } from "./reactor";

export function MempoolConstructor(
  height,
  appProxy,
  mempoolConfig,
) {
  let mp = new Mempool(height, appProxy, mempoolConfig);
  let reactor = new MempoolReactor(mp);

  return [ mp, reactor ];
}

const testApp = {
  checkTxSync: function (tx) {
    return [{ Code: 1, value: "something" }, null];
  }
};

(() => {
  let [ mp, reactor ] = MempoolConstructor(0, testApp, { MAX_BYTES: 10000 });  
  console.log(mp, reactor)
})()
