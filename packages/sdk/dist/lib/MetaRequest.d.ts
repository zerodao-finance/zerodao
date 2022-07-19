/// <reference types="node" />
import { Wallet } from '@ethersproject/wallet';
import { Signer } from '@ethersproject/abstract-signer';
import { GatewayAddressInput } from '@zerodao/common';
import { Buffer } from 'buffer';
import { BigNumberish } from 'ethers';
import { EIP712TypedData } from '@0x/types';
/**
 * Supposed to provide a way to execute other functions while using renBTC to pay for the gas fees
 * what a flow to test would look like:
 * -> underwriter sends request to perform some operation on some contract somewhere
 * -> check if renBTC amount is debited correctly
 */
export declare class MetaRequest {
    module: string;
    addressFrom: string;
    underwriter: string;
    asset: string;
    nonce: string;
    pNonce: string;
    data: string;
    contractAddress: string;
    chainId: number | string;
    signature: string;
    private _destination;
    private _contractFn;
    private _contractParams;
    private _ren;
    _queryTxResult: any;
    provider: any;
    _mint: any;
    keeper: any;
    requestType: string;
    constructor(params: {
        module: string;
        addressFrom: string;
        underwriter: string;
        asset: string;
        data: string;
        nonce?: BigNumberish;
        pNonce?: BigNumberish;
        contractAddress?: string;
        chainId?: number;
        signature?: string;
    });
    destination(contractAddress?: string, chainId?: number | string, signature?: string): string;
    setProvider(provider: any): this;
    submitToRenVM(isTest: any): Promise<any>;
    waitForSignature(): Promise<any>;
    setUnderwriter(underwriter: string): boolean;
    toEIP712Digest(contractAddress: string, chainId?: number): Buffer;
    toEIP712(contractAddress: string, chainId?: number): EIP712TypedData;
    toGatewayAddress(input: GatewayAddressInput): Promise<string>;
    sign(signer: Wallet & Signer, contractAddress?: string): Promise<string>;
}
