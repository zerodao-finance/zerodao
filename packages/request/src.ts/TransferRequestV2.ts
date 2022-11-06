import { randomBytes } from "@ethersproject/random";
import { hexlify, type BytesLike } from "@ethersproject/bytes";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { Interface } from "@ethersproject/abi";
import type { Transaction } from "./types";
import { TransferRequest } from "./TransferRequest";

export class TransferRequestV2 extends TransferRequest {
  public loanId: BytesLike;
  static get PROTOCOL() {
    return "/zero/2.1.0/dispatch";
  }
  static get FIELDS() {
    return [
      "contractAddress",
      "module",
      "to",
      "asset",
      "amount",
      "loanId",
      "nonce",
      "data",
      "underwriter",
    ];
  }
  constructor(o: any) {
    super(o);
    this.loanId = o.loanId;
    this.pNonce = this.loanId || o.pNonce || this.pNonce;
  }
  buildLoanTransaction(): Transaction {
    return {
      chainId: this.getChainId(),
      to: this.contractAddress,
      data: new Interface([
        "function loan(address, address, uint256, uint256, bytes)",
      ]).encodeFunctionData("loan", [
        this.module,
        this.to,
        this.amount,
        this.loanId,
        this.data,
      ]),
    };
  }

  buildRepayTransaction(): Transaction {
    if (!this._queryTxResult)
      throw Error(
        "TransferRequest#buildRepayTransaction(): must call waitForSignature()"
      );
    return {
      chainId: this.getChainId(),
      to: this.contractAddress,
      data: new Interface([
        "function repay(address, address, uint256, uint256, bytes, address, bytes32,  bytes",
      ]).encodeFunctionData("repay", [
        this.module,
        this.to, // borrower address
        this._queryTxResult.actualAmount, // borrow amount
        this.loanId,
        this.data,
        this.underwriter,
        this._queryTxResult.nHash,
        this._queryTxResult.signature,
      ]),
    };
  }
}
