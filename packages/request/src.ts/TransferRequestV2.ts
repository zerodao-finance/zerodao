import { randomBytes } from "@ethersproject/random";
import { hexlify, type BytesLike } from "@ethersproject/bytes";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { Interface } from "@ethersproject/abi";
import type { Transaction } from "./types";
import { TransferRequest } from "./TransferRequest";

export class TransferRequestV2 extends TransferRequest {
  static get PROTOCOL() {
    return "/zero/2.1.0/dispatch";
  }
  static get FIELDS() {
    return ["contractAddress", "module", "to", "amount", "pNonce", "data"];
  }

  buildLoanTransaction(): Transaction {
    return {
      chainId: this.getChainId(),
      to: this.contractAddress,
      data: new Interface([
        "function loan(address, address, uint256, uint256, bytes)",
      ]).encodeFunctionData("loan", [
        this.module,
        this.borrower,
        this.borrowAmount,
        this.nonce, // Could be this.loanId ?
        this.data,
      ]),
    };
  }

  buildRepayTransaction(): Transaction {
    if (!this._queryTxResult)
      throw Error(
        "TransferRequest#buildRepayTransaction(): must call waitForSignature()"
      );
    // TODO: add usage of this._queryTxResult.amount
    return {
      chainId: this.getChainId(),
      to: this.contractAddress,
      data: new Interface([
        "function repay(address, address, address, uint256, uint256, uint256, address, bytes32, bytes, bytes"
      ]).encodeFunctionData("repay", [
        this.underwriter,
        this.borrower, // to address
        this.asset, 
        this.borrowAmount, // amount
        this.borrowAmount, // actualAmount
        this.nonce, 
        this.module,
        this._queryTxResult.nHash,
        this.data,
        this._queryTxResult.signature,
      ]),
    };
  }
}
