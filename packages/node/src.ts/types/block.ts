import { Data } from "../core/types";
import { Commit } from "./commit";
import { Evidence } from "./evidence";

export type Block = {
  Header: Header;
  Data: Data
  Evidence: Evidence
  LastCommit: Commit
};

type Header = {
  Version: Version;
  ChainID: string;
  Height: number;
  Time: string;
  LastBlockID: BlockID;
  LastCommitHash: Buffer | Uint8Array;
  DataHash: Buffer | Uint8Array;
  ValidatorHash: Buffer | Uint8Array;
  NextValidatorHash: Buffer | Uint8Array;
  ConsensusHash: Buffer | Uint8Array;
  AppHash: Buffer | Uint8Array;
  LastResultHash: Buffer | Uint8Array;
  EvidenceHash: Buffer | Uint8Array;
  ProposerAddress: Buffer | Uint8Array;
};

type Version = {
  Block: number;
  App: number;
};

export type BlockID = {
  Hash: Buffer | Uint8Array;
  PartSetHeader: PartSetHeader;
};

type PartSetHeader = {
  Total: number;
  Hash: Buffer;
};

function BlockID(hash: Buffer | Uint8Array, psh: PartSetHeader) {
  this.PartSetHeader = psh;
  this.Hash = hash;
}

BlockID.prototype.isEquals = function (other: BlockID): boolean {
  if (this.hash === other.Hash && this.PartSetHeader === other.PartSetHeader)
    return true;
  return false;
};

BlockID.prototype.isZero = function () {};

BlockID.prototype.isComplete = function () {};

BlockID.prototype.toKey = function () {};

BlockID.prototype.toProto = function () {};

BlockID.prototype.toString = function () {};

function BlockIDFromProto(blockID: Buffer): BlockID | Error {}
