import BigNumber from "bignumber.js";
/**
 * isDefined returns true if the parameter is defined and not null.
 */
export declare const isDefined: <T>(x: T | null | undefined) => x is T;
/**
 * Returns false if the method throws or returns false - returns true otherwise.
 */
export declare const doesntError: <T extends unknown[]>(f: (...p: T) => boolean | void) => (...p: T) => boolean;
/**
 * Pad a Uint8Array to `n` bytes. If the Uint8Array is longer than `n` bytes, an error
 * is thrown.
 */
export declare const padUint8Array: (array: Uint8Array, n: number) => Uint8Array;
/**
 * Convert a number to a Uint8Array of length `n`.
 */
export declare const toNBytes: (input: BigNumber | Uint8Array | string | number, n: number, endian?: "be" | "le") => Uint8Array;
export declare const fromBytes: (input: Uint8Array, endian?: "be" | "le") => BigNumber;
/**
 * Cache the result of an asynchronous function, with a default expiry of 5
 * minutes. Only one result is stored at a time.
 */
/**
 * Remove 0x prefix from a hex string. If the input doesn't have a 0x prefix,
 * it's returned unchanged.
 *
 * @param hex The hex value to be prefixed.
 */
export declare const strip0x: (hex: string) => string;
/**
 * Convert a Uint8Array to a hex string (with no "0x"-prefix).
 */
export declare const toHex: (array: Uint8Array) => string;
/**
 * Add a 0x prefix to a hex value, converting to a string first. If the input
 * is already prefixed, it's returned unchanged.
 *
 * @param hexInput The hex value to be prefixed.
 */
export declare const Ox: (hexInput: Uint8Array | string | number, { prefix }?: {
    prefix: string;
}) => string;
/**
 * Convert a hex string to a Uint8Array.
 */
export declare const fromHex: (hexString: string) => Uint8Array;
export declare const toUTF8String: (input: Uint8Array) => string;
export declare const fromUTF8String: (input: string) => Uint8Array;
/**
 * Convert a base64 string to a Uint8Array.
 */
export declare const fromBase64: (base64String: string) => Uint8Array;
export declare const toBase64: (input: Uint8Array) => string;
/**
 * Unpadded alternate base64 encoding defined in RFC 4648, commonly used in
 * URLs.
 */
export declare const toURLBase64: (input: Uint8Array) => string;
export declare const isBase64: (input: string, options?: {
    length?: number | undefined;
} | undefined) => boolean;
export declare const isURLBase64: (input: string, options?: {
    length?: number | undefined;
} | undefined) => boolean;
export declare const isHex: (input: string, options?: {
    prefix?: true | undefined;
    length?: number | undefined;
    uppercase?: boolean | undefined;
} | undefined) => boolean;
/**
 * Concatenate an array of Uint8Arrays into a single Uint8Array.
 *
 * @param uint8Arrays One or more Uint8Arrays.
 * @returns A single Uint8Array containing the values of each input array,
 * in the same order as the inputs.
 */
export declare const concat: (uint8Arrays: Uint8Array[]) => Uint8Array;
//# sourceMappingURL=common.d.ts.map