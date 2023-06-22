"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferRequest = void 0;
const bytes_1 = require("@ethersproject/bytes");
const random_1 = require("@ethersproject/random");
const buffer_1 = require("buffer");
const ethers_1 = require("ethers");
const Request_1 = require("./Request");
const url_1 = __importDefault(require("url"));
const querystring_1 = __importDefault(require("querystring"));
/*
const assetToRenVMChain = (assetName) => {
  switch (assetName) {
    case "renBTC":
      return Bitcoin;
    case "renZEC":
      return Zcash;
    default:
      return Bitcoin;
  }
};

const renVMChainToAssetName = (chain) => {
  switch (chain) {
    case Bitcoin:
      return "BTC";
    case Zcash:
      return "ZEC";
  }
};
*/
class TransferRequest extends Request_1.Request {
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
    constructor(params, signer) {
        super();
        this.signer = signer;
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
    ;
    buildLoanTransaction() {
        throw Error("TransferRequest#buildLoanTransaction(): V1 Transaction does not support lending");
    }
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
    hash() {
        return ethers_1.ethers.utils.keccak256(this.serialize());
    }
    /*
  
    _getRemoteChain() {
      const RenVMChain = assetToRenVMChain(
        ["renBTC", "renZEC"].find((v) =>
          Object.values(FIXTURES).find((network) =>
            Object.entries(network).find(
              ([token, address]) =>
                v === token &&
                ethers.utils.getAddress(address) ===
                  ethers.utils.getAddress(this.asset)
            )
          )
        )
      );
      return new (RenVMChain as any)({
        network: 'mainnet'
      });
    };
  
    _getRemoteChainName() {
      return renVMChainToAssetName(this._getRemoteChain().constructor);
    };
  
    _getRenVM() {
      return new RenJS("mainnet").withChain(this._getRemoteChain());
    };
   */
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
    async submitToThorChain() {
        if (this._mint)
            return this._mint;
        const mint = await (await fetch(url_1.default.format({
            hostname: 'thornode.thorchain.liquify.com',
            pathname: '/thorchain/quote/swap',
            search: '?' + querystring_1.default.stringify({ amount: this.amount, from_asset: 'BTC.BTC', to_asset: 'ETH.ETH', destination: await this.signer.getAddress() })
        }))).json();
        this._mint = { gatewayAddress: mint.inbound_address };
        return this._mint;
    }
    async waitForDeposit() {
        /*
      if (this._deposit) return this._deposit;
      const mint = await this.submitToRenVM();
      return (this._deposit = await new Promise((resolve) => mint.on('transaction', resolve)));
     */
    }
    ;
    async getTransactionHash() {
        //    const deposit = await this.waitForDeposit();
        return buffer_1.Buffer.from((0, random_1.randomBytes)(32)).toString('base64');
        //    return deposit.renVM.tx.hash;
    }
    ;
    async waitForSignature() {
        /*
      if (this._queryTxResult) return this._queryTxResult;
      const mint = await this.submitToRenVM();
      const deposit = await this.waitForDeposit();
      /*
      await deposit.in.wait();
      await deposit.renVM.submit();
      await deposit.renVM.wait();
  
      const queryTx = (deposit as any).queryTxResult.tx;
      const { amount, sig: signature } = queryTx.out;
      const { nhash, phash } = queryTx.in;
      const result = (this._queryTxResult = {
        amount: String(amount),
        nHash: hexlify(nhash),
        pHash: hexlify(phash),
        signature: hexlify(signature),
      });
      return result;
      */
    }
    ;
    async submitToRenVM() {
        return await this.submitToThorChain();
    }
    async toGatewayAddress() {
        const mint = await this.submitToThorChain();
        return mint.gatewayAddress;
    }
    ;
}
exports.TransferRequest = TransferRequest;
//# sourceMappingURL=TransferRequest.js.map