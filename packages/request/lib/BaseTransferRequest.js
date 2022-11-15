"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTransferRequest = void 0;
const bytes_1 = require("@ethersproject/bytes");
const ethers_1 = require("ethers");
const chains_1 = require("@renproject/chains");
const ren_1 = __importDefault(require("@renproject/ren"));
const contracts_1 = require("@ethersproject/contracts");
const chains_2 = require("@zerodao/chains");
const common_1 = require("@zerodao/common");
const Request_1 = require("./Request");
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
class BaseTransferRequest extends Request_1.Request {
    static get PROTOCOL() {
        return "/zero/2.1.0/dispatch";
    }
    ;
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
    buildLoanTransaction() {
        throw Error("TransferRequest#buildLoanTransaction(): V1 Transaction does not support lending");
    }
    ;
    buildRepayTransaction() {
        if (!this._queryTxResult)
            throw Error("TransferRequest#buildRepayTransaction(): must call waitForSignature()");
        return {
            chainId: this.getChainId(),
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
            ])
        };
    }
    ;
    hash() {
        return ethers_1.ethers.utils.keccak256(this.serialize());
    }
    _getRemoteChain() {
        const RenVMChain = assetToRenVMChain(["renBTC", "renZEC"].find((v) => Object.values(common_1.FIXTURES).find((network) => Object.entries(network).find(([token, address]) => v === token &&
            ethers_1.ethers.utils.getAddress(address) ===
                ethers_1.ethers.utils.getAddress(this.asset)))));
        return new RenVMChain({
            network: 'mainnet'
        });
    }
    ;
    _getRemoteChainName() {
        return renVMChainToAssetName(this._getRemoteChain().constructor);
    }
    ;
    _getRenVM() {
        return new ren_1.default("mainnet").withChain(this._getRemoteChain());
    }
    ;
    _getContractParams() {
        return {
            to: this.contractAddress,
            method: "zeroCall",
            params: [
                {
                    name: "to",
                    type: "address",
                    value: this.to,
                },
                {
                    name: "pNonce",
                    type: "uint256",
                    value: this.pNonce,
                },
                {
                    name: "module",
                    type: "address",
                    value: this.module,
                },
                {
                    name: "data",
                    type: "bytes",
                    value: this.data,
                },
            ],
            withRenParams: true,
        };
    }
    ;
    async submitToRenVM() {
        if (this._mint)
            return this._mint;
        const eth = (0, chains_2.getProvider)(this);
        const renVM = this._getRenVM();
        const result = renVM.withChains(eth).gateway({
            asset: this._getRemoteChainName(),
            from: this._getRemoteChain().GatewayAddress(),
            to: eth.Contract(this._getContractParams()),
            //@ts-ignore
            nonce: (0, bytes_1.arrayify)(this.nonce),
        });
        return result;
    }
    ;
    async waitForDeposit() {
        if (this._deposit)
            return this._deposit;
        const mint = await this.submitToRenVM();
        return (this._deposit = await new Promise((resolve) => mint.on('transaction', resolve)));
    }
    ;
    async getTransactionHash() {
        const deposit = await this.waitForDeposit();
        return deposit.renVM.tx.hash;
    }
    ;
    async waitForSignature() {
        if (this._queryTxResult)
            return this._queryTxResult;
        const mint = await this.submitToRenVM();
        const deposit = await this.waitForDeposit();
        /*
        await deposit.in.wait();
       */
        await deposit.renVM.submit();
        await deposit.renVM.wait();
        const queryTx = deposit.queryTxResult.tx;
        const { amount, sig: signature } = queryTx.out;
        const { nhash, phash } = queryTx.in;
        const result = (this._queryTxResult = {
            amount: String(amount),
            nHash: (0, bytes_1.hexlify)(nhash),
            pHash: (0, bytes_1.hexlify)(phash),
            signature: (0, bytes_1.hexlify)(signature),
        });
        return result;
    }
    ;
    async toGatewayAddress() {
        const mint = await this.submitToRenVM();
        return mint.gatewayAddress;
    }
    ;
    async fallbackMint(signer) {
        if (!this._queryTxResult)
            await this.waitForSignature();
        const { amount: actualAmount, nHash, signature } = this._queryTxResult;
        const contract = new contracts_1.Contract(this.contractAddress, [
            "function fallbackMint(address underwriter, address to, address asset, uint256 amount, uint256 actualAmount, uint256 nonce, address module, bytes32 nHash, bytes data, bytes signature)"
        ], signer);
        return await contract.fallbackMint(this.contractAddress, this.to, this.asset, this.amount, actualAmount, this.pNonce, this.module, nHash, this.data, signature);
    }
}
exports.BaseTransferRequest = BaseTransferRequest;
//# sourceMappingURL=BaseTransferRequest.js.map