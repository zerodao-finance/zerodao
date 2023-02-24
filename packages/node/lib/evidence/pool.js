"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidencePool = void 0;
const node_events_1 = require("node:events");
const evidence_1 = require("../types/evidence");
const protobuf_1 = require("@zerodao/protobuf");
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
class EvidencePool extends node_events_1.EventEmitter {
    static init(height) {
        return new EvidencePool(height);
    }
    constructor(height) {
        super();
        this.height = height;
        this.evidenceList = [];
    }
    createEvidence(vote1, vote2, blockTime, valSet) {
        const evidence = evidence_1.DuplicateVoteEvidence.create(vote1, vote2, blockTime, valSet);
        return evidence;
    }
    setHeightAndFlush(height) {
        this.height = height;
        this.flush();
    }
    flush() {
        this.evidenceList = [];
    }
    addEvidence(evidence) {
        const message = protobuf_1.protocol.lookupType("Evidence");
        const buffer = message.encode(evidence);
        this.evidenceList.push(buffer);
    }
    getEvidenceList() {
        return this.evidenceList;
    }
}
exports.EvidencePool = EvidencePool;
//# sourceMappingURL=pool.js.map