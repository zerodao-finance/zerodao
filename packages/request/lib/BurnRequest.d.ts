import { Contract } from "@ethersproject/contracts";
import { BigNumberish } from "@ethersproject/bignumber";
import { BTCHandler } from "send-crypto/build/main/handlers/BTC/BTCHandler";
import { ZECHandler } from "send-crypto/build/main/handlers/ZEC/ZECHandler";
import type { ZeroP2P } from "@zerodao/p2p";
import { Request } from "./Request";
import { PublishEventEmitter } from "./PublishEventEmitter";
export declare function getRenAsset(request: any): Contract;
export declare class BurnRequest extends Request {
    asset: string;
    data: string;
    owner: string;
    destination: string;
    deadline: BigNumberish;
    amount: BigNumberish;
    contractAddress: string;
    nonce: BigNumberish;
    tokenName: string;
    signature: string;
    static get PROTOCOL(): string;
    static get FIELDS(): string[];
    static minOutFromData(data: any): any;
    static dataFromMinOut(minOut: any): string;
    constructor(o: {
        asset: string;
        data: string;
        owner: string;
        destination: string;
        deadline: BigNumberish;
        amount: BigNumberish;
        contractAddress: string;
        signature: string;
    });
    sendTransaction(signer: any): Promise<any>;
    hash(): string;
    isNative(): boolean;
    toEIP712(): {
        types: {
            EIP712Domain: {
                name: string;
                type: string;
            }[];
            Permit: {
                name: string;
                type: string;
            }[];
        };
        primaryType: string;
        domain: {
            name: string;
            version: string;
            verifyingContract: any;
            salt: string;
            chainId?: undefined;
        } | {
            name: any;
            version: string;
            chainId: string;
            verifyingContract: any;
            salt?: undefined;
        };
        message: {
            owner: any;
            spender: any;
            nonce: any;
            deadline: any;
            value: any;
            holder?: undefined;
            expiry?: undefined;
            allowed?: undefined;
        } | {
            holder: any;
            spender: any;
            nonce: any;
            expiry: any;
            allowed: string;
            owner?: undefined;
            deadline?: undefined;
            value?: undefined;
        };
    };
    getExpiry(): string;
    waitForHostTransaction(): Promise<any>;
    supportsERC20Permit(): boolean;
    needsApproval(): Promise<any>;
    approve(signer: any, amount?: BigNumberish): Promise<any>;
    getHandlerForDestinationChain(): typeof ZECHandler | typeof BTCHandler;
    getNormalizedDestinationAddress(): any;
    waitForRemoteTransaction(): Promise<import("send-crypto/build/main/lib/utxo").UTXO>;
    sign(signer: any): Promise<any>;
    publish(peer: ZeroP2P): Promise<PublishEventEmitter>;
    fetchData(): Promise<this>;
    buildTransaction(): {
        chainId: number;
        data: string;
        to: string;
    };
}
//# sourceMappingURL=BurnRequest.d.ts.map