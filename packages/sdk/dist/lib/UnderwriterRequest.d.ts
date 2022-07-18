import { TransferRequest } from ".lib/TransferRequest";
import { BurnRequest } from ".lib/BurnRequest";
import { MetaRequest } from "./MetaRequest";
import { Contract } from "@ethersproject/contracts";
export declare class UnderwriterTransferRequest extends TransferRequest {
    callStatic: any;
    repayAbi(): string;
    constructor(o: any);
    getController(signer: any): Promise<Contract>;
    fallbackMint(signer: any, params?: {}): Promise<any>;
    getUnderwriter(signer: any): Contract;
    loan(signer: any, params?: {}): Promise<any>;
    getParams(): any[];
    getExecutionFunction(): string;
    dry(signer: any, params?: {}): Promise<any>;
    repay(signer: any, params?: {}): Promise<any>;
    repayStatic(signer: any, params?: {}): Promise<any>;
}
export declare class UnderwriterMetaRequest extends MetaRequest {
    getExecutionFunction(): string;
    getParams(...params: any): string[];
    dry(...params: any): any[];
    getController(...params: any): any;
    getUnderwriter(...params: any): any;
    meta(signer: any, params?: {}): Promise<any>;
}
export declare class UnderwriterBurnRequest extends BurnRequest {
    getExecutionFunction(): string;
    getParams(): any[];
    dry(...params: any): any[];
    getController(...params: any): any;
    getUnderwriter(...params: any): any;
    burn(signer: any, params?: {}): Promise<any>;
}
