import { Request } from "./Request"
import type { Transaction, QueryTXResult } from "./types";
import RenJS, { Gateway, GatewayTransaction } from "@renproject/ren";
import { EthArgs } from "@renproject/interfaces";
import { hexlify, type BytesLike } from "@ethersproject/bytes";
import { BigNumberish } from "@ethersproject/bignumber";
import { Bitcoin } from "@renproject/chains";
import { getProvider } from "@zerodao/common";
import createLogger from "@zerodao/logger";


abstract class BaseTransferRequest extends Request {
    static get PROTOCOL(): string | void { throw new Error('static get PROTOCOL() must be implemeneted') }
    public _mint: any;
    public requestType = "transfer";
    public contractAddress?: string;

    public to: string;
    public amount: BigNumberish;
    public nonce?: BytesLike | BigNumberish;
    public pNonce?: BytesLike | BigNumberish;
    private _ren: RenJS
    private bitcoin: Bitcoin;
    private _contractFn: string;
    private _contractParams: EthArgs;
    private _queryTxResult: QueryTXResult;
    private logger = createLogger();


    constructor(params: {
        network?: "mainnet" | "testnet";
    }) {
        super()
        this._contractFn = "zeroCall";

        const networkName = params.network || "mainnet"
        this.bitcoin = new Bitcoin({ network: networkName });
        this._ren = new RenJS(networkName).withChain(this.bitcoin)
    }

    buildLoanTransaction(): Transaction { throw new Error("BaseTransferRequest: abstract function not implemented") }

    buildRepayTransaction(): Transaction { throw new Error("BaseTransferRequest: abstract function not implemented") }

    async submitToRenVM(): Promise<Gateway> {
        if (this._mint) return this._mint;
        const eth = getProvider({ contractAddress: this.contractAddress });
        const result = (this._mint = this._ren.gateway({
            asset: "BTC",
            from: this.bitcoin.GatewayAddress(),
            to: eth.Contract({
                to: this.contractAddress,
                method: this._contractFn,
                params: this._contractParams,
                withRenParams: true
            }),
            nonce: this.nonce as string | number
        }));

        return result;
    }

    destination(contractAddress?: string, chainId?: number, signature?: string) { return }

    async waitForSignature(): Promise<QueryTXResult> {
        if (this._queryTxResult) return this._queryTxResult;
        const mint = await this.submitToRenVM();
        const deposit: GatewayTransaction<any> = await new Promise((resolve) => {
            mint.on("transaction", (tx) => {
                this.logger.debug("transaction received");
                resolve(tx);
            })
        });

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
            signature: hexlify(signature)
        });
        return result;
    }

    async toGatewayAddress(): Promise<string> {
        const mint = await this.submitToRenVM();
        return mint.gatewayAddress;
    }


}

export default BaseTransferRequest;
