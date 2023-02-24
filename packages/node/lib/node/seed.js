"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class SeedNode extends base_1.BaseNode {
    static init({ signer }) {
        return new SeedNode({ type: "SEED" });
    }
    constructor({ type } = { type: "SEED" }) {
        super();
        this._type = type;
    }
    async run() {
        this.logger.info("starting SeedNode in crawler mode");
    }
}
//# sourceMappingURL=seed.js.map