"use strict";
/* eslint-disable security/detect-object-injection */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertObject = exports.assertType = exports.assert = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
/**
 * Throw an error if the assertion is false.
 */
const assert = (assertion, sentence) => {
    if (!assertion) {
        throw new Error(`Failed assertion${sentence ? `: ${sentence}` : ""}`);
    }
    return true;
};
exports.assert = assert;
/**
 * The following is a set of rudimentary type validation functions.
 *
 * The main function is `assertType`, which accepts a type and a dictionary of
 * values.
 *
 * The type must be a string that matches the following pattern:
 *
 * ```
 * TYPE:
 *   | TYPE '|' TYPE
 *   | Array<TYPE>
 *   | TYPE[]
 *   | PRIMITIVE_TYPE
 *
 * PRIMITIVE_TYPE:
 *   | "string"
 *   | "number"
 *   | "bigint"
 *   | "boolean"
 *   | "symbol"
 *   | "undefined"
 *   | "object"
 *   | "function"
 *   | "null"
 *   | "any"
 *   | "Uint8Array"
 *   | "BigNumber"
 * ```
 *
 * Types are matched by a regex so '|' can't be used at multiple levels, e.g.
 * `string | Array<string | number>`.
 */
const assertType = (type, objects) => {
    if (isArrayType(type)) {
        return assertArray(type, objects);
    }
    if (isUnionType(type)) {
        return assertTypeUnion(type, objects);
    }
    return assertTypeCheck(is(type), objects, type);
};
exports.assertType = assertType;
const typeOf = (v) => v === null
    ? "null"
    : bignumber_js_1.default.isBigNumber(v)
        ? "BigNumber"
        : v instanceof Uint8Array
            ? "Uint8Array"
            : typeof v;
const assertTypeCheck = (type, objects, typeDescription) => {
    for (const key of Object.keys(objects)) {
        // eslint-disable-next-line security/detect-object-injection
        const value = objects[key];
        if (!type(value, key)) {
            const readableType = Array.isArray(value) ? "any[]" : typeOf(value);
            throw new Error(`Expected '${key}' to be of type '${typeDescription}', instead got '${readableType}'.`);
        }
    }
    return true;
};
const is = (type) => (v) => type === "any" ? true : typeOf(v) === type;
const isUnionType = (unionType) => {
    const types = unionType.split(" | ");
    return types.length > 1 ? types : false;
};
const isArrayType = (arrayType) => {
    // Check with simple string operations to avoid running slow RegExs if there
    // isn't a match.
    const isArray = arrayType.slice(0, 6) === "Array<" && arrayType.slice(-1) === ">";
    if (isArray) {
        const arrayMatch = /^Array<(.*)>$/.exec(arrayType);
        if (arrayMatch) {
            const [, type] = arrayMatch;
            return type;
        }
    }
    const isBracketArray = arrayType.indexOf(" ") === -1 && arrayType.slice(-2) === "[]";
    if (isBracketArray) {
        const bracketMatch = /^([^ ]*)\[\]$/.exec(arrayType);
        if (bracketMatch) {
            const [, type] = bracketMatch;
            return type;
        }
    }
    return false;
};
const assertTypeUnion = (unionType, objects) => {
    const types = unionType.split(" | ");
    return assertTypeCheck((v, key) => types.reduce((acc, type) => {
        if (acc) {
            return acc;
        }
        if (isArrayType(type)) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                assertArray(type, { [key]: v });
                return true;
            }
            catch (error) {
                return false;
            }
        }
        return is(type)(v);
    }, false), objects, unionType);
};
const assertArray = (arrayType, objects) => {
    const type = isArrayType(arrayType);
    if (!type) {
        /* istanbul ignore next */ /* also checked when assertArray is called */
        throw new Error(`Invalid array type ${arrayType}`);
    }
    for (const key of Object.keys(objects)) {
        const value = objects[key];
        assertTypeCheck((v) => Array.isArray(v), { value }, "any[]");
        for (let i = 0; i < value.length; i++) {
            (0, exports.assertType)(type, { [`${key}[${i}]`]: value[i] });
        }
    }
    return true;
};
const assertObject = (fieldTypes, objects) => {
    for (const key of Object.keys(objects)) {
        const value = objects[key];
        for (const field of Object.keys(fieldTypes)) {
            if (typeof fieldTypes[field] === "object") {
                (0, exports.assertObject)(fieldTypes[field], {
                    [`${key}["${field}"]`]: value[field],
                });
            }
            else if (typeof fieldTypes[field] === "string") {
                (0, exports.assertType)(String(fieldTypes[field]), {
                    [`${key}["${field}"]`]: value[field],
                });
            }
            else {
                throw new Error(`Invalid object type definition ${typeof fieldTypes[field]}`);
            }
        }
    }
    return true;
};
exports.assertObject = assertObject;
//# sourceMappingURL=assert.js.map