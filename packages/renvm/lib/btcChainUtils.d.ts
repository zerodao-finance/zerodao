import { BitcoinNetworkConfig, BitcoinNetworkConfigMap } from "@renproject/chains";
export declare const addressToBytes: (address: string) => Uint8Array;
export declare const StandardBitcoinExplorer: (baseUrl: string) => BitcoinNetworkConfig["explorer"];
export declare const SoChainExplorer: (chainPath: string, chainId: string) => BitcoinNetworkConfig["explorer"];
export declare const resolveBitcoinNetworkConfig: (configMap: BitcoinNetworkConfigMap, renNetwork: any) => BitcoinNetworkConfig;
/** Calculate the ripemd160 hash of the input. */
export declare const ripemd160: (...msg: Uint8Array[]) => Uint8Array;
/**
 * hash160 is used to calculate the Bitcoin address from a private key, and is
 * equivalent to `ripemd160(sha256(publicKey))`
 */
export declare const hash160: (...msg: Uint8Array[]) => Uint8Array;
/**
 * Convert a Bitcoin transaction hash from its standard format to the format
 * required by RenVM.
 *
 * @param txHash A Bitcoin transaction hash formatted as an unprefixed
 * hex string.
 * @returns The bytes representing the same txHash.
 */
export declare const txHashToBytes: (txHash: string) => Uint8Array;
/**
 * Convert a Bitcoin transaction hash from the format required by RenVM to its
 * standard format.
 *
 * @param bytes Bytes representing a Bitcoin hash.
 * @returns The same Bitcoin transaction hash formatted as an unprefixed hex
 * string.
 */
export declare const txHashFromBytes: (bytes: Uint8Array) => string;
