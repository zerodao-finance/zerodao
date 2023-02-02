export type TX = {
  type: number; // implement Transaction types or transaction type config
  to: Uint8Array | string;
  data: Buffer | Uint32Array;
  nonce: number;
  signature: string | Buffer | Uint8Array | Uint16Array;
  chain?: number; // TODO: implement chain types or chain config
};

type TxKey = Uint8Array | Uint16Array;

function Tx({ type, to, data, nonce, signature, chain }: Partial<TX> = {}) {
  this.type = type;
  this.to = to;
  this.data = data;
  this.nonce = nonce;
  this.signature = signature;
  this.chain = chain;
}

Tx.prototype.fromProto = function (_buff: Buffer) {
  let body = this.protocol.Transaction.decode(_buff).toObject();
  Object.assign(this, ...body);
};
