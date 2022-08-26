async getExplorer() {
    const eth = getProvider(this);
    const renVM = this._getRenVM();
    const result = renVM.withChains(eth).gateway({
      asset: this._getRemoteChainName(),
      from: this._getRemoteChain().GatewayAddress(),
      to: eth.Contract(this._getContractParams()),
      //@ts-ignore
      nonce: arrayify(this.nonce),
    });

    return result;
  }