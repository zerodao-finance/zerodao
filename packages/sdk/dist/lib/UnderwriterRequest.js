"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnderwriterBurnRequest = exports.UnderwriterMetaRequest = exports.UnderwriterTransferRequest = void 0;
const TransferRequest_1 = require(".lib/TransferRequest");
const BurnRequest_1 = require(".lib/BurnRequest");
const MetaRequest_1 = require("./MetaRequest");
const contracts_1 = require("@ethersproject/contracts");
const mocks_1 = require("@zerodao/mocks");
class UnderwriterTransferRequest extends TransferRequest_1.TransferRequest {
    constructor(o) {
        super(o);
        const self = this;
        this.callStatic = {
            async repay(signer) {
                return await self.repay.apply(Object.setPrototypeOf({
                    ...self,
                    getUnderwriter(o) {
                        return self.getUnderwriter(o).callStatic;
                    }
                }, Object.getPrototypeOf(self)), [signer]);
            }
        };
    }
    repayAbi() {
        return "function repay(address, address, address, uint256, uint256, uint256, address, bytes32, bytes, bytes)";
    }
    async getController(signer) {
        console.log("getting controller");
        const underwriter = this.getUnderwriter(signer);
        console.log("got underwriter");
        return new contracts_1.Contract(await underwriter.controller(), [
            "function fallbackMint(address underwriter, address to, address asset, uint256 amount, uint256 actualAmount, uint256 nonce, address module, bytes32 nHash, bytes data, bytes signature)"
        ], signer);
    }
    async fallbackMint(signer, params = {}) {
        const controller = await this.getController(signer);
        const queryTxResult = await this.waitForSignature();
        console.log(this.destination());
        return await controller.fallbackMint(this.underwriter, this.destination(), this.asset, this.amount, queryTxResult.amount, this.pNonce, this.module, queryTxResult.nHash, this.data, queryTxResult.signature, params);
    }
    getUnderwriter(signer) {
        return new contracts_1.Contract(this.underwriter, [
            "function controller() view returns (address)",
            this.repayAbi && this.repayAbi(),
            "function loan(address, address, uint256, uint256, address, bytes, bytes)",
            "function meta(address, address, address, uint256, bytes, bytes)",
            "function burn(address, address, uint256, uint256, bytes, bytes, bytes)"
        ].filter(Boolean), signer);
    }
    async loan(signer, params = {}) {
        const underwriter = this.getUnderwriter(signer);
        return await underwriter.loan(...this.getParams(), params);
    }
    getParams() {
        return [
            this.destination(),
            this.asset,
            this.amount,
            this.pNonce,
            this.module,
            this.data,
            this.signature
        ];
    }
    /*
        switch (func) {
            case 'loan':
            case 'meta':
                //@ts-ignore
            case 'burn':
                const sign = splitSignature(this.signature)
                //@ts-ignore
        }
    }
       */
    getExecutionFunction() {
        return "loan";
    }
    async dry(signer, params = {}) {
        const underwriter = this.getUnderwriter(signer);
        console.log("about to callstatic");
        return await underwriter
            .connect(signer.provider)
            .callStatic[this.getExecutionFunction()](...this.getParams(), Object.assign({}, params, { from: mocks_1.TEST_KEEPER_ADDRESS }));
    }
    async repay(signer, params = {}) {
        const underwriter = this.getUnderwriter(signer);
        const { amount: actualAmount, nHash, signature } = await this.waitForSignature();
        return await underwriter.repay(...(v => {
            console.log(v);
            return v;
        })([
            this.underwriter,
            this.destination(),
            this.asset,
            this.amount,
            actualAmount,
            this.pNonce,
            this.module,
            nHash,
            this.data,
            signature,
            params
        ]));
    }
    async repayStatic(signer, params = {}) {
        const underwriter = this.getUnderwriter(signer);
        const { amount: actualAmount, nHash, signature } = await this.waitForSignature();
        return await underwriter.callStatic.repay(...(v => {
            console.log(v);
            return v;
        })([
            this.underwriter,
            this.destination(),
            this.asset,
            this.amount,
            actualAmount,
            this.pNonce,
            this.module,
            nHash,
            this.data,
            signature,
            params
        ]));
    }
}
exports.UnderwriterTransferRequest = UnderwriterTransferRequest;
class UnderwriterMetaRequest extends MetaRequest_1.MetaRequest {
    getExecutionFunction() {
        return "meta";
    }
    getParams(...params) {
        return [
            this.addressFrom,
            this.asset,
            this.module,
            this.pNonce,
            this.data,
            this.signature
        ];
    }
    dry(...params) {
        return []; //		return UnderwriterTransferRequest.prototype.dry.call(this, ...params);
    }
    getController(...params) {
        return UnderwriterTransferRequest.prototype.getController.call(this, ...params);
    }
    getUnderwriter(...params) {
        return UnderwriterTransferRequest.prototype.getUnderwriter.call(this, ...params);
    }
    async meta(signer, params = {}) {
        const underwriter = this.getUnderwriter(signer);
        return await underwriter.meta(...this.getParams(), params);
    }
}
exports.UnderwriterMetaRequest = UnderwriterMetaRequest;
class UnderwriterBurnRequest extends BurnRequest_1.BurnRequest {
    getExecutionFunction() {
        return "burn";
    }
    getParams() {
        return [
            this.owner,
            this.asset,
            this.amount,
            this.deadline,
            this.data,
            this.destination,
            this.signature
        ];
    }
    dry(...params) {
        return []; //return UnderwriterTransferRequest.prototype.dry.call(this, ...params);
    }
    getController(...params) {
        return UnderwriterTransferRequest.prototype.getController.call(this, ...params);
    }
    getUnderwriter(...params) {
        return UnderwriterTransferRequest.prototype.getUnderwriter.call(this, ...params);
    }
    async burn(signer, params = {}) {
        const underwriter = this.getUnderwriter(signer);
        return await underwriter[this.getExecutionFunction()](...this.getParams(), params);
    }
}
exports.UnderwriterBurnRequest = UnderwriterBurnRequest;
//# sourceMappingURL=UnderwriterRequest.js.map