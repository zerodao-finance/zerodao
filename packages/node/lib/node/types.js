"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSENSUS_ENGINE = exports.NODE_STATUS = exports.NODE_TYPE = void 0;
exports.NODE_TYPE = {
    null: null,
    FULL: "FULL_NODE",
    VALIDATOR: "VALIDATOR_NODE",
};
exports.NODE_STATUS = {
    READY: "READY",
    SYNCING: "SYNCING",
    NOT_READY: "NOT_READY",
    ERROR: "ERROR",
};
exports.CONSENSUS_ENGINE = {
    ZERO_TENDERMINT: "ZERO_TENDERMINT",
};
//# sourceMappingURL=types.js.map