import { TransferRequest } from "./TransferRequest";
import { randomBytes } from "@ethersproject/random";
import { hexlify, type BytesLike } from "@ethersproject/bytes";
import { BigNumberish } from "@ethersproject/bignumber";
import { Interface } from "@ethersproject/abi";
import { EthArgs } from "@renproject/interfaces";
import type { Transaction } from "./types";

export class TransferRequestV2 extends TransferRequest {

    static get PROTOCOL() { return "/zero/2.0.0/dispatch" }
    serialize(): Buffer {
        return Buffer.from(JSON.stringify({
            module: this.module,
	    contractAddress: this.contractAddress,
            borrower: this.to,
            borrowAmount: this.amount,
            nonce: this.nonce,
	    loanId: this.pNonce,
	    asset: this.asset,
            data: this.data
        }))
    }

    buildLoanTransaction(): Transaction {
        return {
            chainId: this.getChainId(),
            to: this.contractAddress,
            data: new Interface(['function loan(address, address, uint256, uint256, bytes)']).encodeFunctionData('loan', [ this.module, this.to, this.amount, this.pNonce, this.data ])
        }
    }

    buildRepayTransaction(): Transaction {
        if (!this._queryTxResult) throw Error('TransferRequest#buildRepayTransaction(): must call waitForSignature()');
	// TODO: add usage of this._queryTxResult.amount
        return {
            chainId: this.getChainId(),
            to: this.contractAddress,
            data: new Interface(['function repay(address, address, uint256, uint256, bytes, address, bytes32, bytes)']).encodeFunctionData('repay', [ this.module, this.to, this.amount, this.pNonce, this.data, this.underwriter, this._queryTxResult.nHash, this._queryTxResult.signature ])
        }
    }
}
