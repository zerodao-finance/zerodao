/// <reference types="node" />
<<<<<<< HEAD
declare type Time = string | number;
declare type CommitRoot = Buffer | Uint8Array;
export declare type Data = {
    Txs: Buffer[][];
};
export declare type PartSetHeader = {
    Total: number;
    Hash: Buffer;
};
export declare type Version = {
    Block: number;
    App: number;
=======
type Time = string | number;
type CommitRoot = Buffer | Uint8Array;
export type Data = {
  Txs: Buffer[][];
};
export type PartSetHeader = {
  Total: number;
  Hash: Buffer;
};
export type Version = {
  Block: number;
  App: number;
>>>>>>> aed/node
};
export interface BlockID {
  Hash: Buffer;
  PartsHeader: PartSetHeader;
}
export interface Vote {
  Type: number;
  Height: number;
  Round: number;
  BlockID: BlockID;
  Timestamp: Time;
  ValidatorAddress: Buffer;
  ValidatorIndex: number;
  Signature: Buffer;
}
declare type PubKey = string | Buffer;
export interface Evidence {
  PubKey: PubKey;
  VoteA: Vote;
  VoteB: Vote;
}
export interface EvidenceData {
  Evicdence: Evidence[];
}
export interface Commit {
  BlockID: BlockID;
  Precommits: Vote[];
}
export interface Header {
  Version: Version;
  ChainID: string;
  Height: number;
  Time: Time;
  NumTxs: number;
  TotalTxs: number;
  LastBlockID: BlockID;
  LastCommitHash: Buffer;
  DataHash: Buffer;
  ValidatorsHash: Buffer;
  NextValidatorsHash: Buffer;
  ConsensusHash: Buffer;
  AppHash: Buffer;
  LastResultsHash: Buffer;
  EvidenceHash: Buffer;
  ProposerAddress: Buffer;
}
export interface Block {
  Header: Header;
  Txs: Data;
  Evidence: EvidenceData;
  LastRoot: CommitRoot;
}
declare const enum TxType {
  TRANSFER = 0,
  SLASH = 1,
}
declare const enum TxChain {
  ETHEREUM = 0,
  MONERO = 1,
}
export interface Transaction {
  type: TxType;
  to: Uint8Array;
  data: Uint8Array;
  nonce: number;
  signature: Uint8Array;
  chain: TxChain;
}
export {};
