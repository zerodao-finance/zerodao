"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferRequestV2 = void 0;
const random_1 = require("@ethersproject/random");
const bytes_1 = require("@ethersproject/bytes");
const bignumber_1 = require("@ethersproject/bignumber");
const abi_1 = require("@ethersproject/abi");
const Request_1 = require("./Request");
class TransferRequestV2 extends Request_1.Request {
    constructor(params) {
        super();
        this.contractAddress = params.contractAddress;
        this.borrower = params.borrower;
        this.asset = params.asset;
        this.borrowAmount = (0, bytes_1.hexlify)(typeof params.borrowAmount === "number"
            ? params.borrowAmount
            : typeof params.borrowAmount === "string"
                ? bignumber_1.BigNumber.from(params.borrowAmount)
                : params.borrowAmount);
        this.module = params.module;
        this.loanId = params.loanId
            ? (0, bytes_1.hexlify)(params.loanId)
            : (0, bytes_1.hexlify)((0, random_1.randomBytes)(32));
        this.nonce = params.nonce
            ? (0, bytes_1.hexlify)(params.nonce)
            : (0, bytes_1.hexlify)((0, random_1.randomBytes)(32));
        this.data = params.data;
        this.underwriter = params.underwriter;
    }
    static get FIELDS() {
        return ["contractAddress", "module", "to", "amount", "pNonce", "data"];
    }
    static get PROTOCOL() {
        return "/zero/2.1.0/dispatch";
    }
    ;
    ;
    buildLoanTransaction() {
        return {
            chainId: this.getChainId(),
            to: this.contractAddress,
            data: new abi_1.Interface([
                "function loan(address, address, uint256, uint256, bytes)",
            ]).encodeFunctionData("loan", [
                this.module,
                this.borrower,
                this.borrowAmount,
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
                this.borrower,
                this.asset,
                this.borrowAmount,
                this.borrowAmount,
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