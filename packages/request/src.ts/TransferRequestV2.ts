import { TransferRequest } from "./TransferRequest";
import { randomBytes } from "@ethersproject/random";
import { hexlify, type BytesLike } from "@ethersproject/bytes";
import { BigNumberish } from "@ethersproject/bignumber";
import { Interface } from "@ethersproject/abi";
import { EthArgs } from "@renproject/interfaces";
import type { Transaction } from "./types";

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
        this.to,
        this.amount,
        this.pNonce,
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
        "function repay(address, address, uint256, uint256, bytes, address, bytes32, bytes)",
      ]).encodeFunctionData("repay", [
        this.module,
        this.to,
        this.amount,
        this.pNonce,
        this.data,
        this.underwriter,
        this._queryTxResult.nHash,
        this._queryTxResult.signature,
      ]),
    };
  }
}
