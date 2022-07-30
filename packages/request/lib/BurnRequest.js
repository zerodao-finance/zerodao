"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurnRequest = void 0;
const request_1 = require("./request");
class BurnRequest extends request_1.Request {
    constructor() {
        super();
    }
    serialize() {
        const _template = [
            "asset",
            "chainId",
            "contractAddress",
            "data",
            "module",
            "nonce",
            "pNonce",
            "signature",
            "underwriter",
            "owner",
            "amount",
            "deadline",
            "destination",
            "requestType",
        ];
        let requestFromTemplate = _template
            ? Object.fromEntries(Object.entries(this).filter(([k, v]) => _template.includes(k)))
            :
                this;
        return JSON.stringify(requestFromTemplate);
    }
}
exports.BurnRequest = BurnRequest;
//# sourceMappingURL=BurnRequest.js.map