

export interface Consensus {

  init({config}): Promise<Conensus> 

  validateConsensus(block: Block): Promise<void>

  newBlock(
    block: any,
    hash: Buffer,
    header: any,
  ): Promise<any>
}

interface ConensusParams = {
 BlockSize: BlockSize;
 TxSize: TxSize;
 BlockGossip: BlockGossip;
}

type BlockSize = {
  MaxBytes: number;
  MaxtTxs: number;
  MaxGas: number;
}

type TxSize = {
  MaxBytes: number;
  MaxGas: number;
}


type BlockGossip = {
  BlockPartSizeBytes: number;
}
