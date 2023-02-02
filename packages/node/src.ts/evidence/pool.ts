import { ZeroP2P } from "@zerodao/p2p";
import { EventEmitter } from "node:events";
import { Vote } from "../core/types";
import { DuplicateVoteEvidence } from "../types/evidence";
import { ValidatorSet } from "../types/validator-set";
import { protocol } from "@zerodao/protobuf";
/* type EvidencePool = {
  evidenceStore: unknown;
  evidenceList: unknown;
  evidenceSize: number;
  staetDB: Store;
  blockStore: BlockStore;
  state: State; // latestState
  consensusBuffer: duplicateVoteSet;
  pruningHeight: number;
  pruningTime: number;
}; */

export class EvidencePool extends EventEmitter {
  height: string | number;
  evidenceList: DuplicateVoteEvidence[];
  p2p: ZeroP2P;
  protected _reactors: Map<string, any>;

  static init(height: string | number) {
    return new EvidencePool(height);
  }
  constructor(height: string | number) {
    super();
    this.height = height;
    this.evidenceList = [];
  }

  createEvidence(
    vote1: Vote,
    vote2: Vote,
    blockTime: string | number,
    valSet: ValidatorSet
  ) {
    const evidence = DuplicateVoteEvidence.create(
      vote1,
      vote2,
      blockTime,
      valSet
    );
    return evidence;
  }

  setHeightAndFlush(height: string | number) {
    this.height = height;
    this.flush();
  }

  flush() {
    this.evidenceList = [];
  }

  addEvidence(evidence: DuplicateVoteEvidence) {
    const message = protocol.lookupType("Evidence");
    const buffer = message.encode(evidence);
    this.evidenceList.push(buffer);
  }

  getEvidenceList() {
    return this.evidenceList;
  }
}
