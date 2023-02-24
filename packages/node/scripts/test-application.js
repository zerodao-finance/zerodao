const { TransactionEngine } = require("../lib/transaction")
const { StateTrie } = require("../lib/trie/trie";
const protobuf = require("protobufjs")
const path = require('path');
const PROTO_PATH = path.join(__dirname, '..', '..', 'protobuf', 'proto', 'ZeroProtocol.proto');
const root = protobuf.loadSync(PROTO_PATH);
const stake = root.lookupType("Stake")
const transfer = root.lookupType("Transfer")
const release = root.lookupType("Release")

const stakeMessage = stake.create({
  from: Buffer.from('0x0123456789abcdef', 'hex'),
  data: Buffer.from('Hello, Tendermint!'),
  amount: 10000,
  signature: Buffer.from('0x0123456789abcdef', 'hex'),
  nonce: 12345,
  asset: Buffer.from('0x0123456789abcdef', 'hex'),
  type: "Stake"
});
const transferMessage = transfer.create({
  from: Buffer.from('0x6723456789abcdef', 'hex'),
  to: Buffer.from('0x0123456789abcdef', 'hex'),
  data: Buffer.from('Hello, Tendermint!'),
  nonce: 12345,
  signature: Buffer.from('0x0123456789abcdef', 'hex'),
  chain: 'ETHEREUM',
  amount: 10000,
  type: "Transfer"
})
const releaseMessage = release.create({
  from: Buffer.from('0x0123456789abcdef', 'hex'),
  data: Buffer.from('Hello, Tendermint!'),
  amount: 10000,
  signature: Buffer.from('0x0123456789abcdef', 'hex'),
  chain: 'ETHEREUM',
  nonce: 12345,
  asset: Buffer.from('0x0123456789abcdef', 'hex'),
  type: "Release",
  destination: Buffer.from('0x0563456789abcdef', 'hex'),
})
const transferBuf = transfer.encode(transferMessage).finish();
const stakeBuf = stake.encode(stakeMessage).finish();
const releaseBuf = release.encode(releaseMessage).finish();
const exampleBlock = {
    Header: {
      Version: {
        Block: 1,
        App: 2
      },
      ChainID: "test-chain",
      Height: 1,
      Time: "2022-01-01T00:00:00Z",
      LastBlockID: {
        Hash: new Uint8Array([1, 2, 3]),
        PartSetHeader: {
          Total: 1,
          Hash: Buffer.from(new Uint8Array([4, 5, 6]))
        }
      },
      LastCommitHash: new Uint8Array([7, 8, 9]),
      DataHash: new Uint8Array([10, 11, 12]),
      ValidatorHash: new Uint8Array([13, 14, 15]),
      NextValidatorHash: new Uint8Array([16, 17, 18]),
      ConsensusHash: new Uint8Array([19, 20, 21]),
      AppHash: new Uint8Array([22, 23, 24]),
      LastResultHash: new Uint8Array([25, 26, 27]),
      EvidenceHash: new Uint8Array([28, 29, 30]),
      ProposerAddress: new Uint8Array([31, 32, 33])
    },
    Data: {
        Txs: [
          {
            type: 1,
            to: new Uint8Array([0x01, 0x02, 0x03]),
            data: transferBuf,
            nonce: 12345,
            signature: new Uint8Array([0x04, 0x05, 0x06]),
            chain: 2
          },
          {
            type: 2,
            to: new Uint8Array([0x01, 0x02, 0x03]),
            data: stakeBuf,
            nonce: 12345,
            signature: new Uint8Array([0x04, 0x05, 0x06]),
            chain: 2
          },
          {
            type: 3,
            to: new Uint8Array([0x01, 0x02, 0x03]),
            data: releaseBuf,
            nonce: 12345,
            signature: new Uint8Array([0x04, 0x05, 0x06]),
            chain: 2
          }
        ],
      },
    Evidence: [
        [Buffer.from('ev1'), Buffer.from('ev2')],
        [Buffer.from('ev3'), Buffer.from('ev4')],
        [Buffer.from('ev5')],
      ],
    LastCommit: {
        Height: 10,
        Round: 2,
        BlockID: {
          Hash: Buffer.from('abcdefg'),
          PartSetHeader: {
            Total: 3,
            Hash: Buffer.from('hijklmn'),
          },
        },
        Signatures: [
          {
            ValidatorAddress: Buffer.from('1234567890'),
            Timestamp: Date.now(),
            Signature: Buffer.from('sig1'),
          },
          {
            ValidatorAddress: Buffer.from('0987654321'),
            Timestamp: Date.now(),
            Signature: Buffer.from('sig2'),
          },
        ],
      }
  };
  
(async () => {
    const engine = new TransactionEngine(new StateTrie())
    await engine.runBlock(exampleBlock)
 })();
