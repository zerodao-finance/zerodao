import { SyncOrPromise } from "@renproject/utils";
import { PayableOverrides, PopulatedTransaction, Signer } from "ethers";
import { EVMNetworkConfig } from "./evmContractPayload";
export declare enum EVMParam {
    EVM_INPUT_TYPE = "__EVM_INPUT_TYPE__",
    EVM_OUTPUT_TYPE = "__EVM_OUTPUT_TYPE__",
    EVM_TRANSACTION_TYPE = "__EVM_TRANSACTION_TYPE__",
    EVM_TOKEN_ADDRESS = "__EVM_TOKEN_ADDRESS__",
    EVM_TOKEN_DECIMALS = "__EVM_TOKEN_DECIMALS__",
    EVM_GATEWAY_IS_DEPOSIT_ASSET = "__EVM_GATEWAY_IS_DEPOSIT_ASSET__",
    EVM_GATEWAY_DEPOSIT_ADDRESS = "__EVM_GATEWAY_DEPOSIT_ADDRESS__",
    EVM_TRANSFER_WITH_LOG_CONTRACT = "__EVM_TRANSFER_WITH_LOG_CONTRACT__",
    EVM_ACCOUNT = "__EVM_ACCOUNT__",
    EVM_ACCOUNT_IS_CONTRACT = "__EVM_ACCOUNT_IS_CONTRACT__",
    EVM_GATEWAY = "__EVM_GATEWAY__",
    EVM_ASSET = "__EVM_ASSET__",
    EVM_CHAIN = "__EVM_CHAIN__",
    EVM_AMOUNT = "__EVM_AMOUNT__",
    EVM_NHASH = "__EVM_NHASH__",
    EVM_PHASH = "__EVM_PHASH__",
    EVM_SIGNATURE = "__EVM_SIGNATURE__",
    EVM_SIGNATURE_R = "__EVM_SIGNATURE_R__",
    EVM_SIGNATURE_S = "__EVM_SIGNATURE_S__",
    EVM_SIGNATURE_V = "__EVM_SIGNATURE_V__",
    EVM_TO_CHAIN = "__EVM_TO_CHAIN__",
    EVM_TO_ADDRESS = "__EVM_TO_ADDRESS__",
    EVM_TO_ADDRESS_BYTES = "__EVM_TO_ADDRESS_BYTES__",
    EVM_TO_PAYLOAD = "__EVM_TO_PAYLOAD__"
}
export declare type EVMParamValues = {
    [EVMParam.EVM_INPUT_TYPE]: "lock" | "burn";
    [EVMParam.EVM_OUTPUT_TYPE]: "mint" | "release";
    [EVMParam.EVM_TRANSACTION_TYPE]: "setup" | "lock" | "mint" | "release" | "burn";
    [EVMParam.EVM_TOKEN_ADDRESS]: () => Promise<string>;
    [EVMParam.EVM_TOKEN_DECIMALS]: () => Promise<number>;
    [EVMParam.EVM_TRANSFER_WITH_LOG_CONTRACT]: () => Promise<string>;
    [EVMParam.EVM_ACCOUNT]: () => Promise<string | undefined>;
    [EVMParam.EVM_ACCOUNT_IS_CONTRACT]: () => Promise<boolean | undefined>;
    [EVMParam.EVM_GATEWAY]: () => Promise<string>;
    [EVMParam.EVM_ASSET]: string;
    [EVMParam.EVM_CHAIN]?: string;
    [EVMParam.EVM_AMOUNT]?: string;
    [EVMParam.EVM_NHASH]?: Uint8Array;
    [EVMParam.EVM_PHASH]?: Uint8Array;
    [EVMParam.EVM_SIGNATURE]?: Uint8Array;
    [EVMParam.EVM_SIGNATURE_R]?: Uint8Array;
    [EVMParam.EVM_SIGNATURE_S]?: Uint8Array;
    [EVMParam.EVM_SIGNATURE_V]?: number;
    [EVMParam.EVM_TO_CHAIN]?: string;
    [EVMParam.EVM_TO_ADDRESS]?: string;
    [EVMParam.EVM_TO_ADDRESS_BYTES]?: Uint8Array;
    [EVMParam.EVM_TO_PAYLOAD]?: Uint8Array;
    [EVMParam.EVM_GATEWAY_IS_DEPOSIT_ASSET]?: boolean;
    [EVMParam.EVM_GATEWAY_DEPOSIT_ADDRESS]?: string;
};
/**
 * The configuration associated with an EVM payload.
 */
export interface EVMPayloadInterface<Name extends string = string, T = any> {
    /** The name of the payload's chain. */
    chain: string;
    /** EVM transaction config overrides. */
    txConfig?: PayableOverrides;
    /** The type of EVM payload. */
    type: Name;
    /** The parameters specific to the EVM payload type. */
    params: T;
    /** Set-up transactions required by the payload.  */
    setup?: {
        [name: string]: EVMPayloadInterface;
    };
    payloadConfig?: {
        /**
         * Whether the `to` field passed to the RenVM transaction should remain
         * preserved, for resuming a transaction that was created with a
         * non-standard address format (no 0x prefix, or no checksum)
         */
        preserveAddressFormat?: boolean;
    };
}
export interface PayloadHandler<P extends EVMPayloadInterface = EVMPayloadInterface> {
    required?: (params: {
        network: EVMNetworkConfig;
        signer?: Signer;
        payload: P;
        evmParams: EVMParamValues;
        getPayloadHandler: (payloadType: string) => PayloadHandler;
    }) => SyncOrPromise<boolean>;
    getSetup?: (params: {
        network: EVMNetworkConfig;
        signer?: Signer;
        payload: P;
        evmParams: EVMParamValues;
        getPayloadHandler: (payloadType: string) => PayloadHandler;
    }) => SyncOrPromise<{
        [name: string]: EVMPayloadInterface;
    }>;
    getPayload?: (params: {
        network: EVMNetworkConfig;
        signer: Signer | undefined;
        payload: P;
        evmParams: EVMParamValues;
        getPayloadHandler: (payloadType: string) => PayloadHandler;
    }) => SyncOrPromise<{
        to: string;
        toBytes: Uint8Array;
        payload: Uint8Array;
    }>;
    export: (params: {
        network: EVMNetworkConfig;
        signer?: Signer;
        payload: P;
        evmParams: EVMParamValues;
        overrides: {
            overrides?: {
                [key: string]: any;
            };
            txConfig?: PayableOverrides;
        };
        getPayloadHandler: (payloadType: string) => PayloadHandler;
    }) => SyncOrPromise<PopulatedTransaction>;
}
export declare const replaceRenParam: (value: unknown, evmParams: EVMParamValues) => Promise<any>;
