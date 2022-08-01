"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferRequestV2 = void 0;
const BaseTransferRequest_1 = __importDefault(require("./BaseTransferRequest"));
const random_1 = require("@ethersproject/random");
const bytes_1 = require("@ethersproject/bytes");
const abi_1 = require("@ethersproject/abi");
class TransferRequestV2 extends BaseTransferRequest_1.default {
    constructor(params) {
        super({ network: params.network });
        this.module = params.module;
        this.to = params.to;
        this.amount = params.amount;
        this.nonce = params.nonce
            ? (0, bytes_1.hexlify)(params.nonce)
            : (0, bytes_1.hexlify)((0, random_1.randomBytes)(32));
        this.pNonce = params.pNonce
            ? (0, bytes_1.hexlify)(params.pNonce)
            : (0, bytes_1.hexlify)((0, random_1.randomBytes)(32));
        this.data = params.data;
    }
    serialize() {
        return Buffer.from(JSON.stringify({
            module: this.module,
            borrower: this.to,
            borrowAmount: this.amount,
            nonce: this.nonce,
            data: this.data
        }));
    }
    buildLoanTransaction() {
        const _iface = new abi_1.Interface([
            "function loan(address, address, uint256, uint256, bytes)"
        ]);
        const data = _iface.encodeFunctionData("loan", [
            this.module,
            this.to,
            this.amount,
            this.nonce,
            this.data
        ]);
        return {
            chainId: this.getChainId(),
            to: this.contractAddress,
            data: data
        };
    }
    buildRepayTransaction() {
        const _iface = new abi_1.Interface([
            "function repay(address, address, uint256, uint256, bytes, address, bytes32, bytes)"
        ]);
        const data = _iface.encodeFunctionData("repay", [
            this.module,
            this.to,
            this.amount,
            this.nonce,
            this.data
        ]);
        return {
            chainId: this.getChainId(),
            to: this.contractAddress,
            data: data
        };
    }
}
exports.TransferRequestV2 = TransferRequestV2;
//# sourceMappingURL=TransferRequestV2.js.map