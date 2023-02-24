function Stake({ from, data, nonce, signature, asset } = {}) {
    this.from = from;
    this.data = data;
    this.nonce = nonce;
    this.signature = signature;
    this.asset = asset;
}
Stake.prototype.fromProto = function (_buff) {
    let body = this.protocol.Stake.decode(_buff).toObject();
    Object.assign(this, ...body);
};
//# sourceMappingURL=stake.js.map