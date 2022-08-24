import BigNumber from "bignumber.js";
import { PackListType, PackPrimitive, PackStructType, PackTypeDefinition, TypedPackValue } from "./packType";
/**
 * Check that the passed-in value is a PackStructType - i.e. an object that has
 * a single field called `struct` which stores an array.
 */
export declare const isPackStructType: (type: unknown) => type is PackStructType<{
    [name: string]: PackTypeDefinition;
}[]>;
/**
 * Check that the passed-in value is a PackListType - i.e. an object that has
 * a single field called `list`.
 */
export declare const isPackListType: (type: unknown) => type is PackListType<PackTypeDefinition>;
/**
 * Convert a PackType string to its numeric ID, as defined in the Go reference
 * implementation.
 * (https://github.com/renproject/pack/blob/e0f417fbbd472eccd99e4bf304b19dc04a31a950/kind.go#L19)
 */
export declare const encodePackType: (type: PackTypeDefinition) => number;
/**
 * Convert a JavaScript number to a big-endian Uint8Array of the provided length.
 */
export declare const encodeUint: (value: BigNumber | string | number, bits: number) => Uint8Array;
export declare const encodeU: (bits: number) => (value: BigNumber | string | number) => Uint8Array;
export declare const encodeU8: (value: BigNumber | string | number) => Uint8Array;
export declare const encodeU16: (value: BigNumber | string | number) => Uint8Array;
export declare const encodeU32: (value: BigNumber | string | number) => Uint8Array;
export declare const encodeU64: (value: BigNumber | string | number) => Uint8Array;
export declare const encodeU128: (value: BigNumber | string | number) => Uint8Array;
export declare const encodeU256: (value: BigNumber | string | number) => Uint8Array;
export declare const withLength: (value: Uint8Array) => Uint8Array;
/**
 * Encode a string, prefixed by its length.
 */
export declare const encodeString: (value: string) => Uint8Array;
/**
 * Encode a struct type by prefixing the `struct` pack type ID and the number
 * of struct entries, and then each field name followed by the field's
 * encoded type definition.
 */
export declare const encodePackStructType: (type: PackStructType) => Uint8Array;
/**
 * Encode a list type by concatenating the `list` pack type ID followed by the
 * encoded type definition of the list's sub-type.
 */
export declare const encodePackListType: (type: PackListType) => Uint8Array;
/**
 * Encode a pack type, as defined above for each type.
 */
export declare const encodePackTypeDefinition: (type: PackTypeDefinition) => Uint8Array;
/**
 * Encode a JavaScript value with an associated pack type into a Uint8Array.
 */
export declare const encodePackPrimitive: (type: PackPrimitive, value: any) => Uint8Array;
/**
 * Encode a pack struct by concatenating the encoded values of each of the
 * pack's fields.
 */
export declare const encodePackStruct: (type: PackStructType, value: unknown) => Uint8Array;
/**
 * Encode a pack list by concatenating the encoded values of each of the
 * list's values.
 */
export declare const encodeListStruct: (type: PackListType, value: unknown[]) => Uint8Array;
/**
 * Encode a pack value by using the encoding defined for the provided
 * pack type.
 */
export declare const encodePackValue: (type: PackTypeDefinition, value: any) => Uint8Array;
/**
 * Encode a `{ t, v }` pair by concatenating the pack type-encoding of `t`
 * followed by the pack value-encoding of `v`.
 */
export declare const encodeTypedPackValue: ({ t, v }: TypedPackValue) => Uint8Array;
//# sourceMappingURL=pack.d.ts.map