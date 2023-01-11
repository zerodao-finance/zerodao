"use strict"

interface IWrappedTX {
  tx: Buffer; 
  timestamp: string;
  hash: string;
  height: number; 
}

export function WrappedTx(
 {
   tx,
   hash,
   timestamp,
   height
 }?: Partial<IWrappedTx> = {}
) {
  this.tx = tx;
  this.hash = hash;
  this.height = height;
  this.timestamp = timestamp;
}

WrappedTx.prototype.fromBytes = function (
  tx,
  hash,
  timestamp,
  height
)  {
  return this.constructor({ tx, hash, timestamp, height }); 
}


