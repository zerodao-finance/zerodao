"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferRequestV2 = void 0;
const TransferRequest_1 = require("./TransferRequest");
const abi_1 = require("@ethersproject/abi");
class TransferRequestV2 extends TransferRequest_1.TransferRequest {
    static get PROTOCOL() {
        return "/zero/2.0.0/dispatch";
    }
    ;
    serialize() {
        return Buffer.from(JSON.stringify({
            module: this.module,
            contractAddress: this.contractAddress,
            borrower: this.to,
            borrowAmount: this.amount,
            nonce: this.nonce,
            loanId: this.pNonce,
            asset: this.asset,
            data: this.data,
        }));
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
                this.pNonce,
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
                "function repay(address, address, uint256, uint256, bytes, address, bytes32, bytes)",
            ]).encodeFunctionData("repay", [
                this.module,
                this.to,
                this.amount,
                this.pNonce,
                this.data,
                this.underwriter,
                this._queryTxResult.nHash,
                this._queryTxResult.signature,
            ]),
        };
    }
}
exports.TransferRequestV2 = TransferRequestV2;
//# sourceMappingURL=TransferRequestV2.js.map