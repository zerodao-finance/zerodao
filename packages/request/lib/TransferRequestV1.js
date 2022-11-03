"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferRequestV1 = void 0;
const bytes_1 = require("@ethersproject/bytes");
const random_1 = require("@ethersproject/random");
const ethers_1 = require("ethers");
const chains_1 = require("@renproject/chains");
const BaseTransferRequest_1 = require("@zerodao/request/src.ts/BaseTransferRequest");
const assetToRenVMChain = (assetName) => {
    switch (assetName) {
        case "renBTC":
            return chains_1.Bitcoin;
        case "renZEC":
            return chains_1.Zcash;
        default:
            return chains_1.Bitcoin;
    }
};
const renVMChainToAssetName = (chain) => {
    switch (chain) {
        case chains_1.Bitcoin:
            return "BTC";
        case chains_1.Zcash:
            return "ZEC";
    }
};
class TransferRequestV1 extends BaseTransferRequest_1.BaseTransferRequest {
    constructor(params) {
        super();
        this.module = params.module;
        this.to = params.to;
        this.underwriter = params.underwriter;
        this.asset = params.asset;
        this.amount = ethers_1.ethers.utils.hexlify(typeof params.amount === "number"
            ? params.amount
            : typeof params.amount === "string"
                ? ethers_1.ethers.BigNumber.from(params.amount)
                : params.amount);
        this.data = params.data;
        this.nonce = params.nonce
            ? (0, bytes_1.hexlify)(params.nonce)
            : (0, bytes_1.hexlify)((0, random_1.randomBytes)(32));
        this.pNonce = params.pNonce
            ? (0, bytes_1.hexlify)(params.pNonce)
            : (0, bytes_1.hexlify)((0, random_1.randomBytes)(32));
        this.contractAddress = params.contractAddress;
    }
    static get FIELDS() {
        return [
            'contractAddress',
            'to',
            'underwriter',
            'asset',
            'amount',
            'module',
            'nonce',
            'pNonce',
            'data'
        ];
    }
    ;
    static get PROTOCOL() {
        return "/zero/2.1.0/dispatch";
    }
    ;
    ;
    buildRepayTransaction() {
        if (!this._queryTxResult)
            throw Error("TransferRequest#buildRepayTransaction(): must call waitForSignature()");
        return {
            to: this.contractAddress,
            data: new ethers_1.ethers.utils.Interface([
                "function repay(address, address, address, uint256, uint256, uint256, address, bytes32, bytes, bytes)",
            ]).encodeFunctionData("repay", [
                this.underwriter,
                this.to,
                this.asset,
                this.amount,
                this._queryTxResult.amount,
                this.pNonce,
                this.module,
                this._queryTxResult.nHash,
                this.data,
                this._queryTxResult.signature,
            ]),
            chainId: this.getChainId(),
        };
    }
    ;
}
exports.TransferRequestV1 = TransferRequestV1;
//# sourceMappingURL=TransferRequestV1.js.map