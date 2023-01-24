"use strict"
import { ethers } from "ethers";
import { protocol } from "@zerodao/protobuf";
import _ from "lodash";

export type WrappedTx = {
  tx: Buffer;
  timestamp: string;
  hash: string;
  height: number;

  new(tx, height, timestamp): WrappedTx;
  Bytes(): number;
  Copy(): WrappedTx;
  Hash(): string;
  CheckBytes(number): boolean;
  toBuffer(): Buffer;
}

export function WrappedTx(tx, timestamp, height) {
  this.tx = tx;
  this.timestamp = timestamp;
  this.height = height
  this.hash = ethers.utils.keccak256(tx);
}

WrappedTx.prototype.toBuffer = function () {
  return this.tx;
};

WrappedTx.prototype.Bytes = function () {
  return this.tx.length;
};

WrappedTx.prototype.Copy = function () {
  return _.cloneDeep(this);
};

WrappedTx.prototype.Hash = function () {
  return this.hash;
};

WrappedTx.prototype.CheckBytes = function (compareBytes: number) {
  if (this.Bytes() > compareBytes) return false;
  return true;
};




