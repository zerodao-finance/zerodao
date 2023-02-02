type Stake = {
  from: Buffer | Uint8Array | string;
  data: Buffer | Uint8Array | string;
  amount: number | string | Long;
  signature: Buffer | Uint8Array | string;
  nonce: number;
  asset: string;
};

function Stake({ from, data, nonce, signature, asset }: Partial<Stake> = {}) {
  this.from = from;
  this.data = data;
  this.nonce = nonce;
  this.signature = signature;
  this.asset = asset;
}

Stake.prototype.fromProto = function (_buff: Buffer) {
  let body = this.protocol.Stake.decode(_buff).toObject();
  Object.assign(this, ...body);
};
