"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info("starting SeedNode in crawler mode");
        });
    }
}
//# sourceMappingURL=seed.js.map