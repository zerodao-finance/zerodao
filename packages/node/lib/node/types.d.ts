export declare const NODE_TYPE: {
    readonly null: any;
    readonly FULL: "FULL_NODE";
    readonly VALIDATOR: "VALIDATOR_NODE";
};
export declare type NODE_TYPE = typeof NODE_TYPE[keyof typeof NODE_TYPE];
export declare const NODE_STATUS: {
    readonly READY: "READY";
    readonly SYNCING: "SYNCING";
    readonly NOT_READY: "NOT_READY";
    readonly ERROR: "ERROR";
};
export declare type NODE_STATUS = typeof NODE_STATUS[keyof typeof NODE_STATUS];
export declare const CONSENSUS_ENGINE: {
    readonly ZERO_TENDERMINT: "ZERO_TENDERMINT";
};
export declare type CONSENSUS_ENGINE = typeof CONSENSUS_ENGINE[keyof typeof CONSENSUS_ENGINE];
