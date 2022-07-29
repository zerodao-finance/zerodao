import Request from "./Request"
import type { Transaction, QueryTXResult } from "./types";
import RenJS, { Gateway, GatewayTransaction } from "@renproject/ren";
import { EthArgs } from "@renproject/interfaces";
import { arrayify, type BytesLike } from "@ethersproject/bytes";
import { BigNumberish } from "@ethersproject/bignumber";
import { Bitcoin } from "@renproject/chains";
import { getProvider } from "@zerodao/common";

abstract class BaseTransferRequest extends Request {
    public _mint: any;
    public requestType = "transfer";
    public contractAddress: string;

    public to: string;
    public amount: BigNumberish;
    public nonce?: BytesLike | BigNumberish;
    public pNonce?: BytesLike | BigNumberish;
    private _ren: RenJS
    private bitcoin: Bitcoin;
    private _contractFn: string;
    private _contractParams: EthArgs;


    constructor(params: {
        network?: "mainnet" | "testnet";
    }) {
        super(params)
        this._contractFn = "zeroCall";

        const networkName = params.network || "mainnet"
        this.bitcoin = new Bitcoin({ network: networkName });
        this._ren = new RenJS(networkName).withChain(this.bitcoin)
    }

    buildLoanTransaction(): Transaction { throw new Error("BaseTransferRequest: abstract function not implemented") }

    buildRepayTransaction(): Transaction { throw new Error("BaseTransferRequest: abstract function not implemented") }

    async submitToRenVM(): Promise<Gateway> {
        if (this._mint) return this._mint;
        const eth = getProvider(this);
        const result = (this._mint = this._ren.gateway({
            asset: "BTC",
            from: this.bitcoin.GatewayAddress(),
            to: eth.Contract({
                to: this.contractAddress,
                method: this._contractFn,
                params: this._contractParams,
                withRenParams: true
            }),
            nonce: (arrayify(this.nonce) as unknown as string | number)
        }));
    }

    destination(contractAddress?: string, chainId?: number, signature?: string) { return }

    async waitForSignature(): Promise<QueryTXResult> {
        return
    }

    async toGatewayAddress(): Promise<string> {
        const mint = await this.submitToRenVM();
        return mint.gatewayAddress;
    }


}

export default BaseTransferRequest;
