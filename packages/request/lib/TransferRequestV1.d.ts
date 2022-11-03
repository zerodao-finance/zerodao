import { BigNumberish } from "ethers";
import { BaseTransferRequest } from "@zerodao/request/src.ts/BaseTransferRequest";
export declare class TransferRequestV1 extends BaseTransferRequest {
    module: string;
    to: string;
    underwriter: string;
    asset: string;
    nonce: string;
    pNonce: string;
    amount: string;
    data: string;
    contractAddress: string;
    protected _queryTxResult: any;
    protected _mint: any;
    protected _deposit: any;
    static get FIELDS(): string[];
    static get PROTOCOL(): string;
    constructor(params: {
        module: string;
        to: string;
        underwriter: string;
        asset: string;
        amount: BigNumberish;
        data: string;
        nonce?: BigNumberish;
        pNonce?: BigNumberish;
        contractAddress: string;
    });
    buildRepayTransaction(): {
        to: string;
        data: string;
        chainId: number;
    };
}
//# sourceMappingURL=TransferRequestV1.d.ts.map