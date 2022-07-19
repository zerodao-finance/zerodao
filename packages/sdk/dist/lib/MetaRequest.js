"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRequest = void 0;
const bytes_1 = require("@ethersproject/bytes");
const random_1 = require("@ethersproject/random");
const hash_1 = require("@ethersproject/hash");
const transactions_1 = require("@ethersproject/transactions");
const ethers_1 = require("ethers");
const utils_1 = require("@0x/utils");
const chains_1 = require("@renproject/chains");
const ren_1 = __importDefault(require("@renproject/ren"));
const common_1 = require("@zerodao/common");
/**
 * Supposed to provide a way to execute other functions while using renBTC to pay for the gas fees
 * what a flow to test would look like:
 * -> underwriter sends request to perform some operation on some contract somewhere
 * -> check if renBTC amount is debited correctly
 */
class MetaRequest {
    constructor(params) {
        this.requestType = 'meta';
        this.module = params.module;
        this.addressFrom = params.addressFrom;
        this.underwriter = params.underwriter;
        this.asset = params.asset;
        this.data = params.data;
        console.log('params.nonce', params.nonce);
        this.nonce = params.nonce ? (0, bytes_1.hexlify)(params.nonce) : (0, bytes_1.hexlify)((0, random_1.randomBytes)(32));
        this.pNonce = params.pNonce ? (0, bytes_1.hexlify)(params.pNonce) : (0, bytes_1.hexlify)((0, random_1.randomBytes)(32));
        this.chainId = params.chainId;
        this.contractAddress = params.contractAddress;
        this.signature = params.signature;
        //this._config =
        this._ren = new ren_1.default('mainnet', { loadCompletedDeposits: true });
        this._contractFn = 'zeroCall';
        this._contractParams = [
            {
                name: 'from',
                type: 'address',
                value: this.addressFrom,
            },
            {
                name: 'pNonce',
                type: 'uint256',
                value: this.pNonce,
            },
            {
                name: 'module',
                type: 'address',
                value: this.module,
            },
            {
                name: 'data',
                type: 'bytes',
                value: this.data,
            },
        ];
    }
    destination(contractAddress, chainId, signature) {
        if (this._destination)
            return this._destination;
        const payload = this.toEIP712(contractAddress || this.contractAddress, Number(chainId || this.chainId));
        delete payload.types.EIP712Domain;
        const digest = hash_1._TypedDataEncoder.hash(payload.domain, payload.types, payload.message);
        return (this._destination = (0, transactions_1.recoverAddress)(digest, signature || this.signature));
    }
    setProvider(provider) {
        this.provider = provider;
        return this;
    }
    async submitToRenVM(isTest) {
        console.log('submitToRenVM this.nonce', this.nonce);
        if (this._mint)
            return this._mint;
        const result = (this._mint = await this._ren.lockAndMint({
            asset: 'BTC',
            from: (0, chains_1.Bitcoin)(),
            nonce: this.nonce,
            to: (0, common_1.getProvider)(this).Contract({
                sendTo: this.contractAddress,
                contractFn: this._contractFn,
                contractParams: this._contractParams,
            }),
        }));
        //    result.params.nonce = this.nonce;
        return result;
    }
    async waitForSignature() {
        if (this._queryTxResult)
            return this._queryTxResult;
        const mint = await this.submitToRenVM(false);
        const deposit = await new Promise((resolve, reject) => {
            mint.on('deposit', resolve);
            mint.on('error', reject);
        });
        await deposit.signed();
        const { signature, nhash, phash, amount } = deposit._state.queryTxResult.out;
        const result = (this._queryTxResult = {
            amount: String(amount),
            nHash: (0, bytes_1.hexlify)(nhash),
            pHash: (0, bytes_1.hexlify)(phash),
            signature: (0, bytes_1.hexlify)(signature),
        });
        return result;
    }
    setUnderwriter(underwriter) {
        if (!ethers_1.ethers.utils.isAddress(underwriter))
            return false;
        this.underwriter = ethers_1.ethers.utils.getAddress(underwriter);
        return true;
    }
    toEIP712Digest(contractAddress, chainId) {
        return utils_1.signTypedDataUtils.generateTypedDataHash(this.toEIP712(contractAddress || this.contractAddress, Number(chainId || this.chainId)));
    }
    toEIP712(contractAddress, chainId) {
        this.contractAddress = contractAddress || this.contractAddress;
        this.chainId = chainId || this.chainId;
        console.log(this.underwriter);
        return {
            types: {
                MetaRequest: [
                    {
                        name: 'asset',
                        type: 'address',
                    },
                    {
                        name: 'underwriter',
                        type: 'address',
                    },
                    {
                        name: 'module',
                        type: 'address',
                    },
                    {
                        name: 'nonce',
                        type: 'uint256',
                    },
                    {
                        name: 'data',
                        type: 'bytes',
                    },
                ],
            },
            domain: {
                name: 'ZeroController',
                version: '1',
                chainId: String(this.chainId) || '1',
                verifyingContract: this.contractAddress || ethers_1.ethers.constants.AddressZero,
            },
            message: {
                asset: this.asset,
                module: this.module,
                underwriter: this.underwriter,
                nonce: this.pNonce,
                data: this.data,
            },
            primaryType: 'MetaRequest',
        };
    }
    async toGatewayAddress(input) {
        const mint = await this.submitToRenVM(false);
        return mint.gatewayAddress;
    }
    async sign(signer, contractAddress) {
        const provider = signer.provider;
        const { chainId } = await signer.provider.getNetwork();
        try {
            const payload = this.toEIP712(contractAddress, chainId);
            console.log(payload);
            return (this.signature = await signer._signTypedData(payload.domain, payload.types, payload.message));
        }
        catch (e) {
            console.error(e);
            return (this.signature = await provider.send('eth_signTypedData_v4', [
                await signer.getAddress(),
                this.toEIP712(this.contractAddress || contractAddress, chainId),
            ]));
        }
    }
}
exports.MetaRequest = MetaRequest;
//# sourceMappingURL=MetaRequest.js.map