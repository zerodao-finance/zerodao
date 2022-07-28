import { Request } from "./request";
import { BigNumberish } from "@ethersproject/bignumber";

export class TransferRequestV2 extends Request {
    static PROTOCOL: "/zero/2.0.0/dispatch"
    module: string;
    borrower: string;
    borrowAmount: BigNumberish;
    nonce: BigNumberish;
    data: string;
    _contractParams?
    constructor() {
        super()
    }


    serialize(): Buffer {
        return Buffer.from(JSON.stringify({
            module: this.module,
            borrower: this.borrower,
            borrowAmount: this.borrowAmount,
            nonce: this.nonce,
            data: this.data
        }))
    }
}