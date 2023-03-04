import { Mempool } from "./mempool";
import { MempoolReactor } from "./reactor";
import type { MempoolConfig } from "./types";

/**
 * MempoolConstructor.
 *
 * @param {number} height
 * @param {function()} appProxy
 * @param {MempoolConfig} mempoolConfig
 * @param {ZeroP2P} p2p
 *
 * constructor
 *
 *
 */
export function MempoolConstructor(
  height: number,
  appProxy,
  mempoolConfig: MempoolConfig,
  p2p
) {
  let mp = new Mempool(height, appProxy, mempoolConfig);
  let reactor = new MempoolReactor(mp, p2p);

  return [mp, reactor];
}

const testApp = {
  /**
   * @type {function (tx)}
   */
  checkTxSync: function (tx) {
    return [{ Code: 1, value: "something" }, null];
  }
};

(() => {
  // let [ mp, reactor ] = MempoolConstructor(0, testApp, { MAX_BYTES: 10000 });
  // console.log(mp, reactor)
})
