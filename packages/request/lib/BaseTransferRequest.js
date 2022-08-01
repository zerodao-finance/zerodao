"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = require("./Request");
const ren_1 = __importDefault(require("@renproject/ren"));
const bytes_1 = require("@ethersproject/bytes");
const chains_1 = require("@renproject/chains");
const common_1 = require("@zerodao/common");
class BaseTransferRequest extends Request_1.Request {
    constructor(params) {
        super();
        this.requestType = "transfer";
        this._contractFn = "zeroCall";
        const networkName = params.network || "mainnet";
        this.bitcoin = new chains_1.Bitcoin({ network: networkName });
        this._ren = new ren_1.default(networkName).withChain(this.bitcoin);
    }
    buildLoanTransaction() { throw new Error("BaseTransferRequest: abstract function not implemented"); }
    buildRepayTransaction() { throw new Error("BaseTransferRequest: abstract function not implemented"); }
    async submitToRenVM() {
        if (this._mint)
            return this._mint;
        const eth = (0, common_1.getProvider)({ contractAddress: this.contractAddress });
        const result = (this._mint = this._ren.gateway({
            asset: "BTC",
            from: this.bitcoin.GatewayAddress(),
            to: eth.Contract({
                to: this.contractAddress,
                method: this._contractFn,
                params: this._contractParams,
                withRenParams: true
            }),
            nonce: this.nonce
        }));
        return result;
    }
    destination(contractAddress, chainId, signature) { return; }
    async waitForSignature() {
        if (this._queryTxResult)
            return this._queryTxResult;
        const mint = await this.submitToRenVM();
        const deposit = await new Promise((resolve) => {
            mint.on("transaction", (tx) => {
                console.log("transaction received");
                resolve(tx);
            });
        });
        await deposit.in.wait();
        await deposit.renVM.submit();
        await deposit.renVM.wait();
        const queryTx = deposit.queryTxResult.tx;
        const { amount, sig: signature } = queryTx.out;
        const { nhash, phash } = queryTx.in;
        const result = (this._queryTxResult = {
            amount: String(amount),
            nHash: (0, bytes_1.hexlify)(nhash),
            pHash: (0, bytes_1.hexlify)(phash),
            signature: (0, bytes_1.hexlify)(signature)
        });
        return result;
    }
    async toGatewayAddress() {
        const mint = await this.submitToRenVM();
        return mint.gatewayAddress;
    }
}
exports.default = BaseTransferRequest;
//# sourceMappingURL=BaseTransferRequest.js.map