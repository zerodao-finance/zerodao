"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmarshalRenVMTransaction = void 0;
const utils_1 = require("@renproject/utils");
const unmarshalRenVMTransaction = (tx) => {
    // If the transaction has a signature output, apply standard signature fixes.
    const out = utils_1.pack.unmarshal.unmarshalTypedPackValue(tx.out);
    if (out && out.sig && out.sig instanceof Uint8Array && out.sig.length > 0) {
        out.sig = (0, utils_1.normalizeSignature)(out.sig);
    }
    return {
        version: parseInt(tx.version),
        hash: tx.hash,
        selector: tx.selector,
        in: utils_1.pack.unmarshal.unmarshalTypedPackValue(tx.in),
        out,
    };
};
exports.unmarshalRenVMTransaction = unmarshalRenVMTransaction;
//# sourceMappingURL=unmarshal.js.map