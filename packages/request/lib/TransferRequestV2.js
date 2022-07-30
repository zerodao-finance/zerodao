"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferRequestV2 = void 0;
const request_1 = __importDefault(require("./request"));
const random_1 = require("@ethersproject/random");
const bytes_1 = require("@ethersproject/bytes");
class TransferRequestV2 extends request_1.default {
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
        return;
    }
    buildRepayTransaction() {
        return;
    }
}
exports.TransferRequestV2 = TransferRequestV2;
//# sourceMappingURL=TransferRequestV2.js.map