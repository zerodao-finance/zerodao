
type Data = {
  Txs: Buffer[][]
}

type PartSetHeader =  {
  Total: number;
  Hash: Buffer;
}

type Version = {
  Block: number;
  App: number;
}

interface BlockID {
  Hash: Buffer
  PartsHeader: PartSetHeader
}

interface Vote {
  Type: number
  Height: number
  Round: number
  BlockID: BlockID
  Timestamp: Time
  ValidatorAddress: Buffer
  ValidatorIndex: number 
  Signature: Buffer
}

type PubKey = string | Buffer;

interface Evidence {
  PubKey: PubKey
  VoteA: Vote
  VoteB: Vote
}

interface EvidenceData{
  Evicdence: Evidence[]
}

interface Commit {
  BlockID: BlockID
  Precommits: Vote[]
}

interface Header {
  Version: Version
  ChainID: string
  Height: number
  Time: Time
  NumTxs: number
  TotalTxs: number

  LastBlockID: BlockID
  
  LastCommitHash: Buffer
  DataHash: Buffer
  
  ValidatorsHash: Buffer
  NextValidatorsHash: Buffer
  ConsensusHash: Buffer
  AppHash: Buffer
  LastResultsHash: Buffer

  EvidenceHash: Bufffer
  ProposerAddress: Buffer
}

interface Block {
  Header: Header
  Txs: Data
  Evidence: EvidenceData
  LastRoot: CommitRoot
}


