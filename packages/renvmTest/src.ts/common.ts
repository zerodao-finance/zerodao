import * as base64 from "base64-js";
import BigNumber from "bignumber.js";
import { OrderedMap, Record } from "immutable";

import { assert, assertType } from "./assert";

/**
 * isDefined returns true if the parameter is defined and not null.
 */
export const isDefined = <T>(x: T | null | undefined): x is T =>
    x !== null && x !== undefined;

/**
 * Returns false if the method throws or returns false - returns true otherwise.
 */
export const doesntError =
    <T extends unknown[]>(f: (...p: T) => boolean | void) =>
    (...p: T): boolean => {
        try {
            const response = f(...p);
            return response === undefined || response === true ? true : false;
        } catch (error: unknown) {
            return false;
        }
    };

/**
 * Pad a Uint8Array to `n` bytes. If the Uint8Array is longer than `n` bytes, an error
 * is thrown.
 */
export const padUint8Array = (array: Uint8Array, n: number): Uint8Array => {
    if (array.length > n) {
        throw new Error(
            `byte array longer than desired length (${String(
                array.length,
            )} > ${String(n)})`,
        );
    }

    if (array.length < n) {
        const paddingLength = n - array.length;
        const padding = Array.from(new Array(paddingLength)).map((_) => 0);
        array = concat([new Uint8Array(padding), array]);
    }

    return array;
};

/**
 * Convert a number to a Uint8Array of length `n`.
 */
export const toNBytes = (
    input: BigNumber | Uint8Array | string | number,
    n: number,
    endian: "be" | "le" = "be",
): Uint8Array => {
    let bytes;
    if (input instanceof Uint8Array) {
        bytes = input;
    } else {
        let hex = new BigNumber(input).toString(16);
        hex = hex.length % 2 ? "0" + hex : hex;
        bytes = fromHex(hex);
    }

    bytes = padUint8Array(bytes, n);

    // Check if the bytes need to be flipped.
    if (endian === "le") {
        bytes = new Uint8Array(bytes).reverse();
    }

    return bytes;
};

export const fromBytes = (
    input: Uint8Array,
    endian: "be" | "le" = "be",
): BigNumber => {
    return new BigNumber(
        toHex(endian === "be" ? input : new Uint8Array(input).reverse()),
        16,
    );
};

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
export const strip0x = (hex: string): string => {
    // Type validation
    assertType<string>("string", { hex });

    return hex.substring(0, 2) === "0x" ? hex.slice(2) : hex;
};

/**
 * Convert a Uint8Array to a hex string (with no "0x"-prefix).
 */
export const toHex = (array: Uint8Array): string =>
    array.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

/**
 * Add a 0x prefix to a hex value, converting to a string first. If the input
 * is already prefixed, it's returned unchanged.
 *
 * @param hexInput The hex value to be prefixed.
 */
export const Ox = (
    hexInput: Uint8Array | string | number,
    { prefix } = { prefix: "0x" },
): string => {
    let hexString: string =
        hexInput instanceof Uint8Array
            ? toHex(hexInput)
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

/**
 * Convert a hex string to a Uint8Array.
 */
export const fromHex = (hexString: string): Uint8Array => {
    assertType<string>("string", { hex: hexString });

    // Strip "0x" prefix.
    hexString = strip0x(hexString);

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

export const toUTF8String = (input: Uint8Array): string => {
    let output = "";
    for (const characterCode of input) {
        let hexCode: string = characterCode.toString(16);

        // Pad characterCode.
        if (hexCode.length < 2) {
            hexCode = "0" + hexCode;
        }

        // Add character to output.
        output += "%" + hexCode;
    }
    return decodeURIComponent(output);
};

export const fromUTF8String = (input: string): Uint8Array => {
    const a: Array<any> = [];
    const encodedInput = encodeURIComponent(input);
    for (let i = 0; i < encodedInput.length; i++) {
        if (encodedInput[i] === "%") {
            // Load the next two characters of encodedInput and treat them
            // as a UTF-8 code.
            a.push(parseInt(encodedInput.substr(i + 1, 2), 16));
            i += 2;
        } else {
            a.push(encodedInput.charCodeAt(i));
        }
    }
    return new Uint8Array(a);
};

/**
 * Convert a base64 string to a Uint8Array.
 */
export const fromBase64 = (base64String: string): Uint8Array => {
    assertType<string>("string", {
        base64: base64String,
    });
    // Add padding at the end, as required by the base64-js library.
    if (base64String.length % 4 !== 0) {
        base64String += "=".repeat(4 - (base64String.length % 4));
    }
    return base64.toByteArray(base64String);
};

export const toBase64 = (input: Uint8Array): string => {
    assertType<Uint8Array>("Uint8Array", {
        input,
    });

    return base64.fromByteArray(input);
};

/**
 * Unpadded alternate base64 encoding defined in RFC 4648, commonly used in
 * URLs.
 */
export const toURLBase64 = (input: Uint8Array): string => {
    assertType<Uint8Array>("Uint8Array", {
        input,
    });

    return toBase64(input)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

export const isBase64 = doesntError(
    (
        input: string,
        options: {
            length?: number;
        } = {},
    ) => {
        const array = fromBase64(input);
        assert(
            options.length === undefined || array.length === options.length,
            `Expected ${String(options.length)} bytes.`,
        );
        assert(toBase64(array) === input);
    },
);

export const isURLBase64 = doesntError(
    (
        input: string,
        options: {
            length?: number;
        } = {},
    ) => {
        const array = fromBase64(input);
        assert(
            options.length === undefined || array.length === options.length,
            `Expected ${String(options.length)} bytes.`,
        );
        assert(toURLBase64(array) === input);
    },
);

export const isHex = doesntError(
    (
        input: string,
        options: {
            prefix?: true;
            length?: number;
            uppercase?: boolean;
        } = {},
    ) => {
        if (options.prefix) {
            assert(input.slice(0, 2) === "0x");
            input = input.slice(2);
        }
        const bytes = fromHex(input);
        assert(
            options.length === undefined || bytes.length === options.length,
            `Expected ${String(options.length)} bytes.`,
        );
        let hex = Ox(bytes, { prefix: "" });
        if (options.uppercase) {
            hex = hex.toUpperCase();
        }
        assert(hex === input);
    },
);



/**
 * Concatenate an array of Uint8Arrays into a single Uint8Array.
 *
 * @param uint8Arrays One or more Uint8Arrays.
 * @returns A single Uint8Array containing the values of each input array,
 * in the same order as the inputs.
 */
export const concat = (uint8Arrays: Uint8Array[]): Uint8Array => {
    const concatenated = uint8Arrays.reduce((acc, curr) => {
        acc.push(...curr);
        return acc;
    }, [] as number[]);

    return new Uint8Array(concatenated);
};