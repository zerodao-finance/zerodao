type Burn = {
    data: Buffer | Uint8Array | string;
    amount: number | string | Long;
    signature: Buffer | Uint8Array | string;
    nonce: number;
    asset: string;
  };
  
  function Burn({ data, nonce, signature, asset }: Partial<Burn> = {}) {
    this.data = data;
    this.nonce = nonce;
    this.signature = signature;
    this.asset = asset;
  }
  
  Stake.prototype.fromProto = function (_buff: Buffer) {
    let body = this.protocol.Stake.decode(_buff).toObject();
    Object.assign(this, ...body);
  };
  