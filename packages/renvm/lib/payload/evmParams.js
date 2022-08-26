"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceRenParam = exports.EVMParam = void 0;
var EVMParam;
(function (EVMParam) {
    // Always available
    EVMParam["EVM_INPUT_TYPE"] = "__EVM_INPUT_TYPE__";
    EVMParam["EVM_OUTPUT_TYPE"] = "__EVM_OUTPUT_TYPE__";
    // For output transactions, the same as EVM_OUTPUT_TYPE, and for input
    // transactions the same as EVM_INPUT_TYPE.
    EVMParam["EVM_TRANSACTION_TYPE"] = "__EVM_TRANSACTION_TYPE__";
    EVMParam["EVM_TOKEN_ADDRESS"] = "__EVM_TOKEN_ADDRESS__";
    EVMParam["EVM_TOKEN_DECIMALS"] = "__EVM_TOKEN_DECIMALS__";
    EVMParam["EVM_GATEWAY_IS_DEPOSIT_ASSET"] = "__EVM_GATEWAY_IS_DEPOSIT_ASSET__";
    EVMParam["EVM_GATEWAY_DEPOSIT_ADDRESS"] = "__EVM_GATEWAY_DEPOSIT_ADDRESS__";
    EVMParam["EVM_TRANSFER_WITH_LOG_CONTRACT"] = "__EVM_TRANSFER_WITH_LOG_CONTRACT__";
    EVMParam["EVM_ACCOUNT"] = "__EVM_ACCOUNT__";
    EVMParam["EVM_ACCOUNT_IS_CONTRACT"] = "__EVM_ACCOUNT_IS_CONTRACT__";
    EVMParam["EVM_GATEWAY"] = "__EVM_GATEWAY__";
    EVMParam["EVM_ASSET"] = "__EVM_ASSET__";
    EVMParam["EVM_CHAIN"] = "__EVM_CHAIN__";
    // Available when minting or releasing
    EVMParam["EVM_AMOUNT"] = "__EVM_AMOUNT__";
    EVMParam["EVM_NHASH"] = "__EVM_NHASH__";
    EVMParam["EVM_PHASH"] = "__EVM_PHASH__";
    EVMParam["EVM_SIGNATURE"] = "__EVM_SIGNATURE__";
    EVMParam["EVM_SIGNATURE_R"] = "__EVM_SIGNATURE_R__";
    EVMParam["EVM_SIGNATURE_S"] = "__EVM_SIGNATURE_S__";
    EVMParam["EVM_SIGNATURE_V"] = "__EVM_SIGNATURE_V__";
    // Available when locking or burning
    EVMParam["EVM_TO_CHAIN"] = "__EVM_TO_CHAIN__";
    EVMParam["EVM_TO_ADDRESS"] = "__EVM_TO_ADDRESS__";
    EVMParam["EVM_TO_ADDRESS_BYTES"] = "__EVM_TO_ADDRESS_BYTES__";
    EVMParam["EVM_TO_PAYLOAD"] = "__EVM_TO_PAYLOAD__";
})(EVMParam = exports.EVMParam || (exports.EVMParam = {}));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEVMParam = (value) => Object.values(EVMParam).indexOf(value) >= 0;
const replaceRenParam = async (value, evmParams) => {
    let valueOrParam = isEVMParam(value) ? evmParams[value] : value;
    if (typeof valueOrParam === "function") {
        valueOrParam = await valueOrParam();
    }
    return valueOrParam;
};
exports.replaceRenParam = replaceRenParam;
//# sourceMappingURL=evmParams.js.map