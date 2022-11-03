"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferRequestV2 = void 0;
const abi_1 = require("@ethersproject/abi");
const TransferRequest_1 = require("./TransferRequest");
class TransferRequestV2 extends TransferRequest_1.TransferRequest {
    static get PROTOCOL() {
        return "/zero/2.1.0/dispatch";
    }
    static get FIELDS() {
        return ["contractAddress", "module", "to", "amount", "pNonce", "data"];
    }
    buildLoanTransaction() {
        return {
            chainId: this.getChainId(),
            to: this.contractAddress,
            data: new abi_1.Interface([
                "function loan(address, address, uint256, uint256, bytes)",
            ]).encodeFunctionData("loan", [
                this.module,
                this.to,
                this.amount,
                this.nonce,
                this.data,
            ]),
        };
    }
    buildRepayTransaction() {
        if (!this._queryTxResult)
            throw Error("TransferRequest#buildRepayTransaction(): must call waitForSignature()");
        // TODO: add usage of this._queryTxResult.amount
        return {
            chainId: this.getChainId(),
            to: this.contractAddress,
            data: new abi_1.Interface([
                "function repay(address, address, address, uint256, uint256, uint256, address, bytes32, bytes, bytes"
            ]).encodeFunctionData("repay", [
                this.underwriter,
                this.to,
                this.asset,
                this.amount,
                this._queryTxResult.amount,
                this.nonce,
                this.module,
                this._queryTxResult.nHash,
                this.data,
                this._queryTxResult.signature,
            ]),
        };
    }
}
exports.TransferRequestV2 = TransferRequestV2;
//# sourceMappingURL=TransferRequestV2.js.map