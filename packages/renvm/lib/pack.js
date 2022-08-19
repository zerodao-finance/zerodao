"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeTypedPackValue = exports.encodePackValue = exports.encodeListStruct = exports.encodePackStruct = exports.encodePackPrimitive = exports.encodePackTypeDefinition = exports.encodePackListType = exports.encodePackStructType = exports.encodeString = exports.withLength = exports.encodeU256 = exports.encodeU128 = exports.encodeU64 = exports.encodeU32 = exports.encodeU16 = exports.encodeU8 = exports.encodeU = exports.encodeUint = exports.encodePackType = exports.isPackListType = exports.isPackStructType = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const error_1 = require("./error");
const packType_1 = require("./packType");
const common_1 = require("./common");
const common_2 = require("./common");
const error_2 = require("./error");
// === Pack Types ==============================================================
/**
 * Check that the passed-in value is a PackStructType - i.e. an object that has
 * a single field called `struct` which stores an array.
 */
const isPackStructType = (type) => typeof type === "object" &&
    type !== null &&
    Object.keys(type).length === 1 &&
    type.struct !== undefined &&
    Array.isArray(type.struct);
exports.isPackStructType = isPackStructType;
/**
 * Check that the passed-in value is a PackListType - i.e. an object that has
 * a single field called `list`.
 */
const isPackListType = (type) => typeof type === "object" && type.list !== undefined;
exports.isPackListType = isPackListType;
/**
 * Convert a PackType string to its numeric ID, as defined in the Go reference
 * implementation.
 * (https://github.com/renproject/pack/blob/e0f417fbbd472eccd99e4bf304b19dc04a31a950/kind.go#L19)
 */
const encodePackType = (type) => {
    // Primitive types.
    switch (type) {
        case "nil":
            return 0;
        // KindBool is the kind of all Bool values.
        case packType_1.PackPrimitive.Bool:
            return 1;
        // KindU8 is the kind of all U8 values.
        case packType_1.PackPrimitive.U8:
            return 2;
        // KindU16 is the kind of all U16 values.
        case packType_1.PackPrimitive.U16:
            return 3;
        // KindU32 is the kind of all U32 values.
        case packType_1.PackPrimitive.U32:
            return 4;
        // KindU64 is the kind of all U64 values.
        case packType_1.PackPrimitive.U64:
            return 5;
        // KindU128 is the kind of all U128 values.
        case packType_1.PackPrimitive.U128:
            return 6;
        // KindU256 is the kind of all U256 values.
        case packType_1.PackPrimitive.U256:
            return 7;
        // KindString is the kind of all utf8 strings.
        case packType_1.PackPrimitive.Str:
            return 10;
        // KindBytes is the kind of all dynamic byte arrays.
        case packType_1.PackPrimitive.Bytes:
            return 11;
        // KindBytes32 is the kind of all 32-byte arrays.
        case packType_1.PackPrimitive.Bytes32:
            return 12;
        // KindBytes65 is the kind of all 65-byte arrays.
        case packType_1.PackPrimitive.Bytes65:
            return 13;
    }
    // Complex types.
    if (typeof type === "object" && Object.keys(type).length === 1) {
        switch (Object.keys(type)[0]) {
            // KindStruct is the kind of all struct values. It is abstract, because it does
            // not specify the fields in the struct.
            case "struct":
                return 20;
            // KindList is the kind of all list values. It is abstract, because it does
            // not specify the type of the elements in the list.
            case "list":
                return 21;
        }
    }
    throw new Error(`Unknown type ${String(type)}.`);
};
exports.encodePackType = encodePackType;
/**
 * Convert a JavaScript number to a big-endian Uint8Array of the provided length.
 */
const encodeUint = (value, bits) => {
    try {
        return (0, common_2.toNBytes)(typeof value === "number"
            ? value
            : bignumber_js_1.default.isBigNumber(value)
                ? value.toFixed()
                : value.toString(), bits / 8);
    }
    catch (error) {
        throw error_1.ErrorWithCode.updateError(error, error.code || error_1.RenJSError.INTERNAL_ERROR, `Unable to encode uint${bits} '${String(value)}'`);
    }
};
exports.encodeUint = encodeUint;
const encodeU = (bits) => (value) => (0, exports.encodeUint)(value, bits);
exports.encodeU = encodeU;
exports.encodeU8 = (0, exports.encodeU)(8);
exports.encodeU16 = (0, exports.encodeU)(16);
exports.encodeU32 = (0, exports.encodeU)(32);
exports.encodeU64 = (0, exports.encodeU)(64);
exports.encodeU128 = (0, exports.encodeU)(128);
exports.encodeU256 = (0, exports.encodeU)(256);
const withLength = (value) => (0, common_2.concat)([(0, exports.encodeU32)(value.length), value]);
exports.withLength = withLength;
/**
 * Encode a string, prefixed by its length.
 */
const encodeString = (value) => (0, exports.withLength)((0, common_1.fromUTF8String)(value));
exports.encodeString = encodeString;
/**
 * Encode a struct type by prefixing the `struct` pack type ID and the number
 * of struct entries, and then each field name followed by the field's
 * encoded type definition.
 */
const encodePackStructType = (type) => {
    const length = (0, exports.encodeU32)(type.struct.length);
    return (0, common_2.concat)([
        new Uint8Array([(0, exports.encodePackType)(type)]),
        length,
        ...type.struct.map((field) => {
            const keys = Object.keys(field);
            if (keys.length === 0) {
                throw new Error(`Invalid struct field with no entries.`);
            }
            if (keys.length > 1) {
                throw new Error(`Invalid struct field with multiple entries.`);
            }
            const key = Object.keys(field)[0];
            const fieldType = field[key];
            return (0, common_2.concat)([
                (0, exports.encodeString)(key),
                (0, exports.encodePackTypeDefinition)(fieldType),
            ]);
        }),
    ]);
};
exports.encodePackStructType = encodePackStructType;
/**
 * Encode a list type by concatenating the `list` pack type ID followed by the
 * encoded type definition of the list's sub-type.
 */
const encodePackListType = (type) => (0, common_2.concat)([
    new Uint8Array([(0, exports.encodePackType)(type)]),
    (0, exports.encodePackTypeDefinition)(type.list),
]);
exports.encodePackListType = encodePackListType;
/**
 * Encode a pack type, as defined above for each type.
 */
const encodePackTypeDefinition = (type) => {
    if ((0, exports.isPackStructType)(type)) {
        return (0, exports.encodePackStructType)(type);
    }
    else if ((0, exports.isPackListType)(type)) {
        return (0, exports.encodePackListType)(type);
    }
    else if (typeof type === "string") {
        return new Uint8Array([(0, exports.encodePackType)(type)]);
    }
    throw new Error(`Unable to encode type ${String(type)}.`);
};
exports.encodePackTypeDefinition = encodePackTypeDefinition;
// === Pack Values =============================================================
/**
 * Encode a JavaScript value with an associated pack type into a Uint8Array.
 */
const encodePackPrimitive = (type, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
value) => {
    switch (type) {
        // Booleans
        case packType_1.PackPrimitive.Bool:
            return (0, exports.encodeU8)(value ? 1 : 0);
        // Integers
        case packType_1.PackPrimitive.U8:
            return (0, exports.encodeU8)(value);
        case packType_1.PackPrimitive.U16:
            return (0, exports.encodeU16)(value);
        case packType_1.PackPrimitive.U32:
            return (0, exports.encodeU32)(value);
        case packType_1.PackPrimitive.U64:
            return (0, exports.encodeU64)(value);
        case packType_1.PackPrimitive.U128:
            return (0, exports.encodeU128)(value);
        case packType_1.PackPrimitive.U256:
            return (0, exports.encodeU256)(value);
        // Strings
        case packType_1.PackPrimitive.Str: {
            return (0, exports.encodeString)(value);
        }
        // Bytes
        case packType_1.PackPrimitive.Bytes: {
            return (0, exports.withLength)(value instanceof Uint8Array
                ? value
                : // Supports base64 url format
                    (0, common_2.fromBase64)(value));
        }
        case packType_1.PackPrimitive.Bytes32:
        case packType_1.PackPrimitive.Bytes65:
            return value instanceof Uint8Array
                ? value
                : // Supports base64 url format
                    (0, common_2.fromBase64)(value);
    }
};
exports.encodePackPrimitive = encodePackPrimitive;
/**
 * Encode a pack struct by concatenating the encoded values of each of the
 * pack's fields.
 */
const encodePackStruct = (type, value) => (0, common_2.concat)(type.struct.map((member) => {
    const keys = Object.keys(member);
    if (keys.length === 0) {
        throw new Error(`Invalid struct member with no entries.`);
    }
    if (keys.length > 1) {
        throw new Error(`Invalid struct member with multiple entries.`);
    }
    if (typeof value !== "object") {
        throw new Error(`Invalid struct value of type "${typeof value}".`);
    }
    if (value === null) {
        throw new Error(`Invalid struct value "null".`);
    }
    const key = Object.keys(member)[0];
    const memberType = member[key];
    try {
        return (0, exports.encodePackValue)(memberType, value[key]);
    }
    catch (error) {
        throw error_1.ErrorWithCode.updateError(error, error.code || error_1.RenJSError.INTERNAL_ERROR, `Unable to encode struct field ${key}`);
    }
}));
exports.encodePackStruct = encodePackStruct;
/**
 * Encode a pack list by concatenating the encoded values of each of the
 * list's values.
 */
const encodeListStruct = (type, value) => {
    const subtype = type.list;
    return (0, common_2.concat)(value.map((element, i) => {
        try {
            return (0, exports.encodePackValue)(subtype, element);
        }
        catch (error) {
            if (error instanceof Error) {
                error.message = `Unable to encode array element #${i}: ${String(error.message)}`;
            }
            throw error;
        }
    }));
};
exports.encodeListStruct = encodeListStruct;
/**
 * Encode a pack value by using the encoding defined for the provided
 * pack type.
 */
const encodePackValue = (type, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
value) => {
    if ((0, exports.isPackStructType)(type)) {
        return (0, exports.encodePackStruct)(type, value);
    }
    else if ((0, exports.isPackListType)(type)) {
        return (0, exports.encodeListStruct)(type, value);
    }
    else if (typeof type === "string") {
        if (type === "nil")
            return new Uint8Array();
        return (0, exports.encodePackPrimitive)(type, value);
    }
    throw new Error(`Unknown value type ${String(type)}${!type ? ` for value ${String(value)}` : ""}`);
};
exports.encodePackValue = encodePackValue;
/**
 * Encode a `{ t, v }` pair by concatenating the pack type-encoding of `t`
 * followed by the pack value-encoding of `v`.
 */
const encodeTypedPackValue = ({ t, v }) => {
    try {
        const encodedType = (0, exports.encodePackTypeDefinition)(t);
        const encodedValue = (0, exports.encodePackValue)(t, v);
        return (0, common_2.concat)([encodedType, encodedValue]);
    }
    catch (error) {
        if (error instanceof Error) {
            error.message = `Error encoding typed pack value: ${error.message}`;
            throw error;
        }
        throw new Error(`Error encoding typed pack value: ${(0, error_2.extractError)(error)}`);
    }
};
exports.encodeTypedPackValue = encodeTypedPackValue;
//# sourceMappingURL=pack.js.map