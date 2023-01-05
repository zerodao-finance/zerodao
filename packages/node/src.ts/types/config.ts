export type Config = {
	RPC: RPCConfig;
	P2P: P2PConfig;
	Mempool: MempoolConfig;
	StateSync: StateSyncConfig;
	BlockSync: BlockSyncConfig;
	Consensus: ConsensusConfig;
	Storage: StorageConfig;
	TxIndex: TxIndexConfig;
	Intrumentation?: InstrumentationConfig;
}



