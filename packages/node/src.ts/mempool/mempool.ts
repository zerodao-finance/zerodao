import { WrappedTx } from "./tx";
import _ from "lodash";
import { ethers } from "ethers";
import { logger } from "../logger";
import { protocol } from "@zerodao/protobuf";
import { Sketch } from "./sketch";
import { MempoolConfig } from "./types";

const abci = {
  CodeTypeOk: 1
};

const OkMessage = { Code: abci.CodeTypeOk, value: "something" };
const proxyAppTest = {
  checkTxSync: function (tx: Buffer) {
    return [OkMessage, null];
  },
};

export type Mempool = {
  // properties
  txs: Map<string, WrappedTx>;
  cache: typeof Set;
  height: number;
  config: MempoolConfig;
  proxy: any;
  sketch: any;
  
  //constructor
  new(height: number, proxyApp: any, config: MempoolConfig): Mempool;

  //methods
  length(): number;
  flushPool(): void;
  deleteByHash(hash: string): void;
  reapMax(max?: number): Buffer[];
  checkTx(tx: Buffer): Error | void;
  addTx(wtx: WrappedTx, checkResponse): void;
  serialize(): Buffer 
  resolveSketch(sketch: Buffer): any;
  merge(pool: Buffer): void;
};

export function Mempool(
  height,
  proxyApp,
  config
) {
  this.txs = new Map();
  this.cache = new Set();
  this.height = height;
  this.config = config;
  this.proxy = proxyApp;
  this.sketch = undefined;
}

// returns length of the current mempool (ie. number of txs in pool)
Mempool.prototype.length = function () {
  return this.txs.size;
};

// clears current mempool
Mempool.prototype.flushPool = function () {
  this.txs.clear();
  return;
};

// removes a transaction from the mempool by the transaction hash
Mempool.prototype.deleteByHash = function (hash: string) {
  if (this.cache.has(hash)) this.cache.delete(hash);
  if (this.txs.hash(hash)) this.txs.delete(hash);
  return;
};

/*
 * pulls up to (max) transactions from the mempool
 * does not modify mempool
 * if max is undefined or 0 returns all transactions in the mempool
 */
Mempool.prototype.reapMax = function (max?: number) {
  var txs = _.map([...this.txs.values()], (w) => w.tx);
  if (max == undefined || max == 0) return txs;
  return _.take(txs, max);
};


// check transaction function
Mempool.prototype.checkTx = function (tx: any) {
  tx = protocol.Transaction.encode(tx).finish()
  var hash = ethers.utils.keccak256(tx);
  var time = Date.now().toString();

  if (tx.length > this.config.MAX_BYTES) {
    return [ null, new Error("transaction exceeds MAX_BYTES") ];
  }
  
  if ( this.cache.has(hash) ) {
    if ( this.txs.has(hash) ) {
      // recheck the transaction
      // if invalid remove from the pool
      // leave in the cache
    }
    return [ null, new Error("transaction exists in cache") ]
  }

  this.cache.add(hash);

  let wtx = new WrappedTx(tx, time, this.height); 
  let [rsp, err] = this.proxy.checkTxSync(tx);

  if (err) {
    return [ null, err ]; 
  };

  this.addTx(wtx, rsp);

  return [{ status: "SUCCESS" }, null]
};

Mempool.prototype.addTx = function (wtx: WrappedTx, checkResponse) {
  if (checkResponse.Code != abci.CodeTypeOk) {
    logger.info('rejected bad transaction');
    throw new Error("rejected bad transaction");
    return;
  }

  this.txs.set(wtx.Hash(), wtx);
};

Mempool.prototype.merge = function (otherMap: Buffer) {
  return;
  // merge other pool into this pool
  // use lodash merge()
}

Mempool.prototype.serialize = async function () {
  this.sketch = await Sketch.fromTxs([...this.txs.values()]);
  console.log(this.sketch);
  return this.sketch.serialize();
};

Mempool.prototype.resolveSketch = async function (sketch) {
  // = await Sketch.fromTxs([...this.txs.values()]);
  return await this.sketch.calculateDifferences(sketch);
};

// testing stuff >>>>>>>>>>>>>>

function startInjesting( mp ) {
  setInterval((mp) => {
    let encoded = protocol.BalanceQuery.encode({ address: ethers.utils.randomBytes(8) }).finish()
    mp.checkTx(encoded);

    logger.info(`mempool size ${mp.length()}`)
  }, 5000, mp)
}

function fillMock( times: number, mp ) {
  return new Promise((resolve) => {
    for ( let y = 0; y < times; y++ ) {
      let encoded = protocol.BalanceQuery.encode({ address: ethers.utils.randomBytes(8) }).finish();
      mp.checkTx(encoded);
    }

    setTimeout(resolve, 10000);
  })
}

function logdata (mp) {
  setInterval((mp) => {
    console.log(`reaping transactions`, mp.reapMax());
  }, 1000, mp);
  
  setInterval(async (mp) => {
    console.log(`creating sketch`, await mp.serialize());
  }, 1000, mp);
}



(async () => {

  let mp = new Mempool(0, proxyAppTest, { MAX_BYTES: 10000 });
  let mp2 = new Mempool(0, proxyAppTest, { MAX_BYTES: 10000 });

  await Promise.all(
    [fillMock( 10, mp ),
    fillMock( 19, mp2 )]
  ).then();


  let mp_buffer = await mp.serialize();
  let mp2_buffer = await mp2.serialize();
  console.log(await mp.resolveSketch(mp2_buffer));
  


});

