/**
 * Throw an error if the assertion is false.
 */
export declare const assert: (assertion: boolean, sentence?: string) => assertion is true;
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
export declare const assertType: <T = unknown>(type: string, objects: {
    [value: string]: T;
}) => objects is {
    [value: string]: T;
};
declare type ObjectDefinition<T> = {
    [P in keyof T]: string | ObjectDefinition<unknown>;
};
export declare const assertObject: <T extends object>(fieldTypes: ObjectDefinition<T>, objects: {
    [key: string]: T;
}) => boolean;
export {};
//# sourceMappingURL=assert.d.ts.map