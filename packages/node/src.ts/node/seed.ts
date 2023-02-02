import { BaseNode } from "./base";

class SeedNode extends BaseNode {
  _status: NODE_STATUS;
  _type: NODE_TYPE;

  static init({ signer }) {
    return new SeedNode({ type: "SEED" });
  }

  constructor({ type }: any = { type: "SEED" }) {
    super();
    this._type = type;
  }

  async run() {
    this.logger.info("starting SeedNode in crawler mode");
  }
}
