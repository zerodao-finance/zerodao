import { BigNumberish } from "ethers";
import { Request } from "./Request";
export declare class TransferRequest extends Request {
    module: string;
    to: string;
    underwriter: string;
    asset: string;
    nonce: string;
    pNonce: string;
    amount: string;
    data: string;
    contractAddress: string;
    signer: any;
    protected _queryTxResult: any;
    protected _mint: any;
    protected _deposit: any;
    static get FIELDS(): string[];
    static get PROTOCOL(): string;
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
    }, signer: any);
    buildLoanTransaction(): void;
    buildRepayTransaction(): {
        to: string;
        data: string;
        chainId: number;
    };
    hash(): string;
    _getContractParams(): {
        to: string;
        method: string;
        params: {
            name: string;
            type: string;
            value: string;
        }[];
        withRenParams: boolean;
    };
    submitToThorChain(): Promise<any>;
    waitForDeposit(): Promise<void>;
    getTransactionHash(): Promise<string>;
    waitForSignature(): Promise<void>;
    submitToRenVM(): Promise<any>;
    toGatewayAddress(): Promise<string>;
}
