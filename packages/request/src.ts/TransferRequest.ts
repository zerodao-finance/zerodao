import { hexlify, arrayify } from "@ethersproject/bytes";
import { randomBytes } from "@ethersproject/random";
import { Buffer } from "buffer";
import { BigNumberish, ethers } from "ethers";
import { Zcash, Bitcoin } from "@renproject/chains";
import RenJS, { Gateway, GatewayTransaction } from "@renproject/ren";
import { Contract } from "@ethersproject/contracts";
import { getProvider } from "@zerodao/chains";
import { FIXTURES } from "@zerodao/common";
import { Request } from "./Request";
import { encode } from "@ethersproject/rlp";

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

  protected _queryTxResult: any;
  protected _mint: any;
  protected _deposit: any;

  static get FIELDS(): string [] {
    return [
      'to',
      'module',
      'data',
      'nonce',
      'pNonce',
      'contractAddress',
      'asset',
      'underwriter',
      'amount'
    ]
  };

  static get PROTOCOL() {
    return "/zero/1.1.0/dispatch";
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
  }) {
    super();
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

  serialize(): Buffer {
    return Buffer.from(
      JSON.stringify({
        to: this.to,
        module: this.module,
        data: this.data,
        amount: this.amount,
        nonce: this.nonce,
        pNonce: this.pNonce,
        contractAddress: this.contractAddress,
        asset: this.asset,
        underwriter: this.underwriter,
      })
    );
  };

  // TODO: create new serialize function to serialize FIELDS
  serializeFields(): Buffer {
    return Buffer.from(encode(TransferRequest.FIELDS.map(v => this[v])));
  };

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

  async submitToRenVM(): Promise<Gateway> {
    if (this._mint) return this._mint;
    const eth = getProvider(this);
    const renVM = this._getRenVM();
    const result = renVM.withChains(eth).gateway({
      asset: this._getRemoteChainName(),
      from: this._getRemoteChain().GatewayAddress(),
      to: eth.Contract(this._getContractParams()),
      //@ts-ignore
      nonce: arrayify(this.nonce),
    });

    return result;
  };

  async waitForDeposit() {
    if (this._deposit) return this._deposit;
    const mint = await this.submitToRenVM();
    return (this._deposit = await new Promise((resolve) => mint.on('transaction', resolve)));
  };

  async getTransactionHash() {
    const deposit = await this.waitForDeposit();
    return deposit.renVM.tx.hash;
  };

  async waitForSignature() {
    if (this._queryTxResult) return this._queryTxResult;
    const mint = await this.submitToRenVM();
    const deposit = await this.waitForDeposit();
    /*
    await deposit.in.wait();
   */
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
  };

  async toGatewayAddress(): Promise<string> {
    const mint = await this.submitToRenVM();
    return mint.gatewayAddress;
  };

  async fallbackMint(signer) {
    if (!this._queryTxResult) await this.waitForSignature();
    const { amount: actualAmount, nHash, signature } = this._queryTxResult;
    const contract = new Contract(this.contractAddress, [
      "function fallbackMint(address underwriter, address to, address asset, uint256 amount, uint256 actualAmount, uint256 nonce, address module, bytes32 nHash, bytes data, bytes signature)"
    ], signer);
    return await contract.fallbackMint(this.contractAddress, this.to, this.asset, this.amount, actualAmount, this.pNonce, this.module, nHash, this.data, signature);
  }
}
