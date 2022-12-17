export class Transaction {
  provider: Provider;

  constructor() {
    this.provider = new Provider();
  }
  async runBlock() {}

  async runTransaction() {}

  async validateTransaction(tx) {}
}
