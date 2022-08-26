"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputAndOutputTypes = void 0;
const utils_1 = require("@renproject/utils");
/**
 * Detect whether the transaction is a lock-and-mint, burn-and-release or
 * burn-and-mint, and return the selector.
 */
const getInputAndOutputTypes = async ({ asset, fromChain, toChain, }) => {
    if (await toChain.isLockAsset(asset)) {
        // Burn and release
        if (!(0, utils_1.isContractChain)(fromChain)) {
            throw utils_1.ErrorWithCode.updateError(new Error(`Cannot burn from non-contract chain ${fromChain.chain}.`), utils_1.RenJSError.PARAMETER_ERROR);
        }
        if (!(await fromChain.isMintAsset(asset))) {
            throw utils_1.ErrorWithCode.updateError(new Error(`Asset '${asset}' is not supported on ${fromChain.chain}.`), utils_1.RenJSError.PARAMETER_ERROR);
        }
        return {
            inputType: utils_1.InputType.Burn,
            outputType: utils_1.OutputType.Release,
            selector: `${asset}/from${fromChain.chain}`,
        };
    }
    else if (await fromChain.isLockAsset(asset)) {
        // Lock and mint
        if (!(0, utils_1.isContractChain)(toChain)) {
            throw utils_1.ErrorWithCode.updateError(new Error(`Cannot mint to non-contract chain ${toChain.chain}.`), utils_1.RenJSError.PARAMETER_ERROR);
        }
        if (!(await toChain.isMintAsset(asset))) {
            throw utils_1.ErrorWithCode.updateError(new Error(`Asset '${asset}' is not supported on ${toChain.chain}.`), utils_1.RenJSError.PARAMETER_ERROR);
        }
        return {
            inputType: utils_1.InputType.Lock,
            outputType: utils_1.OutputType.Mint,
            selector: `${asset}/to${toChain.chain}`,
        };
    }
    else {
        // Burn and mint
        if (!(0, utils_1.isContractChain)(toChain)) {
            throw utils_1.ErrorWithCode.updateError(new Error(`Cannot mint to non-contract chain ${toChain.chain}.`), utils_1.RenJSError.PARAMETER_ERROR);
        }
        if (!(await toChain.isMintAsset(asset))) {
            throw utils_1.ErrorWithCode.updateError(new Error(`Asset '${asset}' is not supported on ${toChain.chain}.`), utils_1.RenJSError.PARAMETER_ERROR);
        }
        if (!(0, utils_1.isContractChain)(fromChain)) {
            throw utils_1.ErrorWithCode.updateError(new Error(`Cannot burn from non-contract chain ${fromChain.chain}.`), utils_1.RenJSError.PARAMETER_ERROR);
        }
        if (!(await fromChain.isMintAsset(asset))) {
            throw utils_1.ErrorWithCode.updateError(new Error(`Asset '${asset}' is not supported on ${fromChain.chain}.`), utils_1.RenJSError.PARAMETER_ERROR);
        }
        return {
            inputType: utils_1.InputType.Burn,
            outputType: utils_1.OutputType.Mint,
            selector: `${asset}/from${fromChain.chain}_to${toChain.chain}`,
        };
    }
};
exports.getInputAndOutputTypes = getInputAndOutputTypes;
//# sourceMappingURL=inputAndOutputTypes.js.map