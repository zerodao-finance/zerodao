"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = exports.isHex = exports.isURLBase64 = exports.isBase64 = exports.toURLBase64 = exports.toBase64 = exports.fromBase64 = exports.fromUTF8String = exports.toUTF8String = exports.fromHex = exports.Ox = exports.toHex = exports.strip0x = exports.fromBytes = exports.toNBytes = exports.padUint8Array = exports.doesntError = exports.isDefined = void 0;
const base64 = __importStar(require("base64-js"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const assert_1 = require("./assert");
/**
 * isDefined returns true if the parameter is defined and not null.
 */
const isDefined = (x) => x !== null && x !== undefined;
exports.isDefined = isDefined;
/**
 * Returns false if the method throws or returns false - returns true otherwise.
 */
const doesntError = (f) => (...p) => {
    try {
        const response = f(...p);
        return response === undefined || response === true ? true : false;
    }
    catch (error) {
        return false;
    }
};
exports.doesntError = doesntError;
/**
 * Pad a Uint8Array to `n` bytes. If the Uint8Array is longer than `n` bytes, an error
 * is thrown.
 */
const padUint8Array = (array, n) => {
    if (array.length > n) {
        throw new Error(`byte array longer than desired length (${String(array.length)} > ${String(n)})`);
    }
    if (array.length < n) {
        const paddingLength = n - array.length;
        const padding = Array.from(new Array(paddingLength)).map((_) => 0);
        array = (0, exports.concat)([new Uint8Array(padding), array]);
    }
    return array;
};
exports.padUint8Array = padUint8Array;
/**
 * Convert a number to a Uint8Array of length `n`.
 */
const toNBytes = (input, n, endian = "be") => {
    let bytes;
    if (input instanceof Uint8Array) {
        bytes = input;
    }
    else {
        let hex = new bignumber_js_1.default(input).toString(16);
        hex = hex.length % 2 ? "0" + hex : hex;
        bytes = (0, exports.fromHex)(hex);
    }
    bytes = (0, exports.padUint8Array)(bytes, n);
    // Check if the bytes need to be flipped.
    if (endian === "le") {
        bytes = new Uint8Array(bytes).reverse();
    }
    return bytes;
};
exports.toNBytes = toNBytes;
const fromBytes = (input, endian = "be") => {
    return new bignumber_js_1.default((0, exports.toHex)(endian === "be" ? input : new Uint8Array(input).reverse()), 16);
};
exports.fromBytes = fromBytes;
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
const strip0x = (hex) => {
    // Type validation
    (0, assert_1.assertType)("string", { hex });
    return hex.substring(0, 2) === "0x" ? hex.slice(2) : hex;
};
exports.strip0x = strip0x;
/**
 * Convert a Uint8Array to a hex string (with no "0x"-prefix).
 */
const toHex = (array) => array.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
exports.toHex = toHex;
/**
 * Add a 0x prefix to a hex value, converting to a string first. If the input
 * is already prefixed, it's returned unchanged.
 *
 * @param hexInput The hex value to be prefixed.
 */
const Ox = (hexInput, { prefix } = { prefix: "0x" }) => {
    let hexString = hexInput instanceof Uint8Array
        ? (0, exports.toHex)(hexInput)
        : typeof hexInput === "number"
            ? hexInput.toString(16)
            : hexInput;
    if (hexString.length % 2 === 1) {
        hexString = "0" + hexString;
    }
    return hexString.substring(0, 2) === prefix
        ? hexString
        : `${prefix}${hexString}`;
};
exports.Ox = Ox;
/**
 * Convert a hex string to a Uint8Array.
 */
const fromHex = (hexString) => {
    (0, assert_1.assertType)("string", { hex: hexString });
    // Strip "0x" prefix.
    hexString = (0, exports.strip0x)(hexString);
    // Pad the hex string.
    if (hexString.length % 2) {
        hexString = "0" + hexString;
    }
    // Split the string into bytes.
    const match = hexString.match(/.{1,2}/g);
    if (!match) {
        return new Uint8Array();
    }
    // Parse each byte and create a Uint8Array.
    return new Uint8Array(match.map((byte) => parseInt(byte, 16)));
};
exports.fromHex = fromHex;
const toUTF8String = (input) => {
    let output = "";
    for (const characterCode of input) {
        let hexCode = characterCode.toString(16);
        // Pad characterCode.
        if (hexCode.length < 2) {
            hexCode = "0" + hexCode;
        }
        // Add character to output.
        output += "%" + hexCode;
    }
    return decodeURIComponent(output);
};
exports.toUTF8String = toUTF8String;
const fromUTF8String = (input) => {
    const a = [];
    const encodedInput = encodeURIComponent(input);
    for (let i = 0; i < encodedInput.length; i++) {
        if (encodedInput[i] === "%") {
            // Load the next two characters of encodedInput and treat them
            // as a UTF-8 code.
            a.push(parseInt(encodedInput.substr(i + 1, 2), 16));
            i += 2;
        }
        else {
            a.push(encodedInput.charCodeAt(i));
        }
    }
    return new Uint8Array(a);
};
exports.fromUTF8String = fromUTF8String;
/**
 * Convert a base64 string to a Uint8Array.
 */
const fromBase64 = (base64String) => {
    (0, assert_1.assertType)("string", {
        base64: base64String,
    });
    // Add padding at the end, as required by the base64-js library.
    if (base64String.length % 4 !== 0) {
        base64String += "=".repeat(4 - (base64String.length % 4));
    }
    return base64.toByteArray(base64String);
};
exports.fromBase64 = fromBase64;
const toBase64 = (input) => {
    (0, assert_1.assertType)("Uint8Array", {
        input,
    });
    return base64.fromByteArray(input);
};
exports.toBase64 = toBase64;
/**
 * Unpadded alternate base64 encoding defined in RFC 4648, commonly used in
 * URLs.
 */
const toURLBase64 = (input) => {
    (0, assert_1.assertType)("Uint8Array", {
        input,
    });
    return (0, exports.toBase64)(input)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};
exports.toURLBase64 = toURLBase64;
exports.isBase64 = (0, exports.doesntError)((input, options = {}) => {
    const array = (0, exports.fromBase64)(input);
    (0, assert_1.assert)(options.length === undefined || array.length === options.length, `Expected ${String(options.length)} bytes.`);
    (0, assert_1.assert)((0, exports.toBase64)(array) === input);
});
exports.isURLBase64 = (0, exports.doesntError)((input, options = {}) => {
    const array = (0, exports.fromBase64)(input);
    (0, assert_1.assert)(options.length === undefined || array.length === options.length, `Expected ${String(options.length)} bytes.`);
    (0, assert_1.assert)((0, exports.toURLBase64)(array) === input);
});
exports.isHex = (0, exports.doesntError)((input, options = {}) => {
    if (options.prefix) {
        (0, assert_1.assert)(input.slice(0, 2) === "0x");
        input = input.slice(2);
    }
    const bytes = (0, exports.fromHex)(input);
    (0, assert_1.assert)(options.length === undefined || bytes.length === options.length, `Expected ${String(options.length)} bytes.`);
    let hex = (0, exports.Ox)(bytes, { prefix: "" });
    if (options.uppercase) {
        hex = hex.toUpperCase();
    }
    (0, assert_1.assert)(hex === input);
});
/**
 * Concatenate an array of Uint8Arrays into a single Uint8Array.
 *
 * @param uint8Arrays One or more Uint8Arrays.
 * @returns A single Uint8Array containing the values of each input array,
 * in the same order as the inputs.
 */
const concat = (uint8Arrays) => {
    const concatenated = uint8Arrays.reduce((acc, curr) => {
        acc.push(...curr);
        return acc;
    }, []);
    return new Uint8Array(concatenated);
};
exports.concat = concat;
//# sourceMappingURL=common.js.map