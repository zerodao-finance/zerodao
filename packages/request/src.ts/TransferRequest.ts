import { hexlify, arrayify } from "@ethersproject/bytes";
import { randomBytes } from "@ethersproject/random";
import { Buffer } from "buffer";
import { BigNumberish, ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { getProvider } from "@zerodao/chains";
import { FIXTURES } from "@zerodao/common";
import { Request } from "./Request";
import url from "url";
import qs from "querystring";

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

export class TransferRequest extends Request {
  public module: string;
  public to: string;
  public underwriter: string;
  public asset: string;
  public nonce: string;
  public pNonce: string;
  public amount: string;
  public data: string;
  public contractAddress: string;
  public signer: any;

  protected _queryTxResult: any;
  protected _mint: any;
  protected _deposit: any;

  static get FIELDS(): string [] {
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
    ]
  };

  static get PROTOCOL() {
    return "/zero/2.1.0/dispatch";
  };

  constructor(params: {
    module: string;
    to: string;
    underwriter?: string;
    asset: string;
    amount: BigNumberish;
    data: string;
    nonce?: BigNumberish;
    pNonce?: BigNumberish;
    contractAddress: string;
  }, signer: any) {
    super();
    this.signer = signer;
    this.module = params.module;
    this.to = params.to;
    this.underwriter = params.underwriter;
    this.asset = params.asset;
    this.amount = ethers.utils.hexlify(
      typeof params.amount === "number"
        ? params.amount
        : typeof params.amount === "string"
        ? ethers.BigNumber.from(params.amount)
        : params.amount
    );
    this.data = params.data;
    this.nonce = params.nonce
      ? hexlify(params.nonce)
      : hexlify(randomBytes(32));
    this.pNonce = params.pNonce
      ? hexlify(params.pNonce)
      : hexlify(randomBytes(32));
    this.contractAddress = params.contractAddress;
     
  };

  buildLoanTransaction() {
    throw Error(
      "TransferRequest#buildLoanTransaction(): V1 Transaction does not support lending"
    );
  };

  buildRepayTransaction() {
    if (!this._queryTxResult)
      throw Error(
        "TransferRequest#buildRepayTransaction(): must call waitForSignature()"
      );
    return {
      to: this.contractAddress,
      data: new ethers.utils.Interface([
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
  };

  hash(): string {
    return ethers.utils.keccak256(this.serialize());
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
  };

  async submitToThorChain(): Promise<any> {
    if (this._mint) return this._mint;
    const mint = await (await fetch(url.format({
      hostname: 'thornode.thorchain.liquify.com',
      pathname: '/thorchain/quote/swap',
      search: '?' + qs.stringify({ amount: this.amount, from_asset: 'BTC.BTC', to_asset: 'ETH.ETH', destination: await this.signer.getAddress() })
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
  };

  async getTransactionHash() {
//    const deposit = await this.waitForDeposit();
    return Buffer.from(randomBytes(32)).toString('base64');
//    return deposit.renVM.tx.hash;
  };

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
  };

  async submitToRenVM(): Promise<any> {
    return await this.submitToThorChain();
  }
  async toGatewayAddress(): Promise<string> {
    const mint = await this.submitToThorChain();
    return mint.gatewayAddress;
  };

  /*
  async fallbackMint(signer) {
    if (!this._queryTxResult) await this.waitForSignature();
    const { amount: actualAmount, nHash, signature } = this._queryTxResult;
    const contract = new Contract(this.contractAddress, [
      "function fallbackMint(address underwriter, address to, address asset, uint256 amount, uint256 actualAmount, uint256 nonce, address module, bytes32 nHash, bytes data, bytes signature)"
    ], signer);
    return await contract.fallbackMint(this.contractAddress, this.to, this.asset, this.amount, actualAmount, this.pNonce, this.module, nHash, this.data, signature);
  }
 */
}
