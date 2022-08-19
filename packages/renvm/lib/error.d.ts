export declare const hasOwnProperty: <T>(object: any, property: keyof T) => object is T;
export declare const invalidError: (errorMessage: string) => boolean;
/**
 * Attempt to extract a more meaningful error from a thrown error, such as
 * the body of a network response.
 */
export declare const extractError: (error: unknown) => string;
/**
 * RenJS error codes - errors thrown from RenJS are in the process of being
 * converted to `ErrorWithCode` errors with the following error codes.
 */
export declare enum RenJSError {
    UNKNOWN_ERROR = "RENJS:UNKNOWN_ERROR",
    NOT_IMPLEMENTED = "RENJS:NOT_IMPLEMENTED",
    PARAMETER_ERROR = "RENJS:PARAMETER_ERROR",
    INTERNAL_ERROR = "RENJS:INTERNAL_ERROR",
    NETWORK_ERROR = "RENJS:NETWORK_ERROR",
    SIGNER_ERROR = "RENJS:SIGNER_ERROR",
    TRANSACTION_NOT_FOUND = "RENJS:TRANSACTION_NOT_FOUND",
    RENVM_TRANSACTION_REVERTED = "RENJS:RENVM_TRANSACTION_REVERTED",
    CHAIN_TRANSACTION_REVERTED = "RENJS:CHAIN_TRANSACTION_REVERTED",
    GATEWAY_SUBMISSION_FAILED = "RENJS:GATEWAY_SUBMISSION_FAILED",
    INCORRECT_PROVIDER_NETWORK = "RENJS:INCORRECT_PROVIDER_NETWORK",
    INCORRECT_SIGNER_NETWORK = "RENJS:INCORRECT_SIGNER_NETWORK"
}
/**
 * An ErrorWithCode is an Error instance with an additional `code` field.
 * Because this is a common pattern with various implementations provided
 * by libraries, checking if an Error is an ErrorWithCode should be done using
 * `isErrorWithCode(error)` instead of `error instanceof ErrorWithCode`.
 */
export declare class ErrorWithCode extends Error {
    code: string;
    /**
     * Check if the provided value is an Error instance and has a code field which
     * contains a string.
     */
    static isErrorWithCode: (error: unknown) => error is ErrorWithCode;
    /**
     * Add an error code to an existing Error instance.
     */
    static updateError: (error: any, code: string, errorPrefix?: string) => ErrorWithCode;
    /**
     * @param message An error message, passed on to the Error constructor.
     * @param code An error code, defined in a standard manner to allow for
     * easier error handling.
     */
    constructor(message: unknown, code: string, prefix?: string);
}
//# sourceMappingURL=error.d.ts.map