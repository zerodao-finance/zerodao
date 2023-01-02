export const NODE_TYPE = {
	null: null,
	FULL: 'FULL_NODE',
	VALIDATOR: 'VALIDATOR_NODE'
} as const;

export type NODE_TYPE = typeof NODE_TYPE[keyof typeof NODE_TYPE];

export const NODE_STATUS = {
	READY: 'READY',
	SYNCING: 'SYNCING',
	NOT_READY: 'NOT_READY',
	ERROR: 'ERROR'
} as const;

export type NODE_STATUS = typeof NODE_STATUS[keyof typeof NODE_STATUS];

export const CONSENSUS_ENGINE = {
	ZERO_TENDERMINT: 'ZERO_TENDERMINT'
} as const;

export type CONSENSUS_ENGINE = typeof CONSENSUS_ENGINE[keyof typeof CONSENSUS_ENGINE];


