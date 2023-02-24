function Burn({ data, nonce, signature, asset } = {}) {
    this.data = data;
    this.nonce = nonce;
    this.signature = signature;
    this.asset = asset;
}
Stake.prototype.fromProto = function (_buff) {
    let body = this.protocol.Stake.decode(_buff).toObject();
    Object.assign(this, ...body);
};
//# sourceMappingURL=burn.js.map