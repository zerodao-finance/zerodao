import { JsonFragmentType } from "@ethersproject/abi";
import { PayableOverrides } from "ethers";
import { EthArg } from "./abi";
import { EVMPayloadInterface, PayloadHandler } from "./evmParams";
export declare type EVMContractPayload = EVMPayloadInterface<"contract", {
    to: string;
    method: string;
    params: EthArg[];
    txConfig?: PayableOverrides;
}>;
export declare const contractPayloadHandler: PayloadHandler<EVMContractPayload>;
export declare const fixEVMTransactionConfig: (...txConfigs: Array<PayableOverrides | undefined>) => PayableOverrides;
export declare const rawEncode: (types: Array<string | JsonFragmentType>, parameters: unknown[]) => Uint8Array;
export interface EVMNetworkConfig {
    selector: string;
    isTestnet?: boolean;
    logRequestLimit?: number;
    addresses: {
        GatewayRegistry: string;
        BasicBridge: string;
    };
    nativeAsset: {
        name: string;
        symbol: string;
        decimals: number;
    };
    averageConfirmationTime: number;
    config: EIP3085Config;
}
export interface EIP3085Config {
    /** The integer ID of the chain as a hexadecimal string. */
    chainId: string;
    /** One or more URLs pointing to block explorer web sites for the chain. */
    blockExplorerUrls: string[];
    /** A human-readable name for the chain. */
    chainName: string;
    /**
     * One or more URLs pointing to reasonably sized images that can be used to
     * visually identify the chain.
     */
    iconUrls?: string[];
    /** The native currency of the chain. */
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    /**
     * One or more URLs pointing to RPC endpoints that can be used to
     * communicate with the chain. Each chain may define variables that will be
     * replaced using the notation `${VARIABLE_NAME}`, such as
     * `${INFURA_API_KEY}`.
     */
    rpcUrls: string[];
}
