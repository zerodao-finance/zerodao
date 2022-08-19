"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorWithCode = exports.RenJSError = exports.extractError = exports.invalidError = exports.hasOwnProperty = void 0;
const hasOwnProperty = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
object, property) => Object.prototype.hasOwnProperty.call(object, property);
exports.hasOwnProperty = hasOwnProperty;
const invalidError = (errorMessage) => errorMessage === "" ||
    errorMessage === "null" ||
    errorMessage === "undefined";
exports.invalidError = invalidError;
/**
 * Attempt to extract a more meaningful error from a thrown error, such as
 * the body of a network response.
 */
const extractError = (error) => {
    if (error && typeof error === "object") {
        if ((0, exports.hasOwnProperty)(error, "response") && error.response) {
            const extractedError = (0, exports.extractError)(error.response);
            if (!(0, exports.invalidError)(extractedError)) {
                return extractedError;
            }
        }
        if ((0, exports.hasOwnProperty)(error, "data") && error.data) {
            const extractedError = (0, exports.extractError)(error.data);
            if (!(0, exports.invalidError)(extractedError)) {
                return extractedError;
            }
        }
        if ((0, exports.hasOwnProperty)(error, "error") && error.error) {
            const extractedError = (0, exports.extractError)(error.error);
            if (!(0, exports.invalidError)(extractedError)) {
                return extractedError;
            }
        }
        if ((0, exports.hasOwnProperty)(error, "context") && error.context) {
            const extractedError = (0, exports.extractError)(error.context);
            if (!(0, exports.invalidError)(extractedError)) {
                return extractedError;
            }
        }
        if ((0, exports.hasOwnProperty)(error, "message") && error.message) {
            const extractedError = (0, exports.extractError)(error.message);
            if (!(0, exports.invalidError)(extractedError)) {
                return extractedError;
            }
        }
        if ((0, exports.hasOwnProperty)(error, "statusText") && error.statusText) {
            const extractedError = (0, exports.extractError)(error.statusText);
            if (!(0, exports.invalidError)(extractedError)) {
                return extractedError;
            }
        }
    }
    try {
        if (typeof error === "string") {
            if (error.slice(0, 7) === "Error: ") {
                error = error.slice(7);
            }
            return String(error);
        }
        return JSON.stringify(error);
    }
    catch (innerError) {
        // Ignore JSON error
    }
    return String(error);
};
exports.extractError = extractError;
/**
 * RenJS error codes - errors thrown from RenJS are in the process of being
 * converted to `ErrorWithCode` errors with the following error codes.
 */
var RenJSError;
(function (RenJSError) {
    // General errors.
    RenJSError["UNKNOWN_ERROR"] = "RENJS:UNKNOWN_ERROR";
    RenJSError["NOT_IMPLEMENTED"] = "RENJS:NOT_IMPLEMENTED";
    RenJSError["PARAMETER_ERROR"] = "RENJS:PARAMETER_ERROR";
    RenJSError["INTERNAL_ERROR"] = "RENJS:INTERNAL_ERROR";
    RenJSError["NETWORK_ERROR"] = "RENJS:NETWORK_ERROR";
    RenJSError["SIGNER_ERROR"] = "RENJS:SIGNER_ERROR";
    RenJSError["TRANSACTION_NOT_FOUND"] = "RENJS:TRANSACTION_NOT_FOUND";
    // Indicates that the RenVM transaction has returned with a Reverted status
    // and a revert reason. A reverted transaction cannot be re-submitted.
    RenJSError["RENVM_TRANSACTION_REVERTED"] = "RENJS:RENVM_TRANSACTION_REVERTED";
    // Indicates that the chain transaction reverted. It may be possible to
    // resubmit the transaction.
    RenJSError["CHAIN_TRANSACTION_REVERTED"] = "RENJS:CHAIN_TRANSACTION_REVERTED";
    // Indicates that submitting the gateway details failed.
    RenJSError["GATEWAY_SUBMISSION_FAILED"] = "RENJS:GATEWAY_SUBMISSION_FAILED";
    RenJSError["INCORRECT_PROVIDER_NETWORK"] = "RENJS:INCORRECT_PROVIDER_NETWORK";
    RenJSError["INCORRECT_SIGNER_NETWORK"] = "RENJS:INCORRECT_SIGNER_NETWORK";
})(RenJSError = exports.RenJSError || (exports.RenJSError = {}));
/**
 * An ErrorWithCode is an Error instance with an additional `code` field.
 * Because this is a common pattern with various implementations provided
 * by libraries, checking if an Error is an ErrorWithCode should be done using
 * `isErrorWithCode(error)` instead of `error instanceof ErrorWithCode`.
 */
class ErrorWithCode extends Error {
    /**
     * @param message An error message, passed on to the Error constructor.
     * @param code An error code, defined in a standard manner to allow for
     * easier error handling.
     */
    constructor(message, code, prefix) {
        super(prefix
            ? `${prefix}: ${(0, exports.extractError)(message)}`
            : (0, exports.extractError)(message));
        this.code = code;
    }
}
exports.ErrorWithCode = ErrorWithCode;
/**
 * Check if the provided value is an Error instance and has a code field which
 * contains a string.
 */
ErrorWithCode.isErrorWithCode = (error) => 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
error instanceof Error && typeof error.code === "string";
/**
 * Add an error code to an existing Error instance.
 */
ErrorWithCode.updateError = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
error, code, errorPrefix) => {
    // Check the code passed in is a RenJS error. If it isn't, it may have
    // been set by a dependency.
    if (typeof code !== "string" || code.slice(0, 6) !== "RENJS:") {
        code = RenJSError.INTERNAL_ERROR;
    }
    if (error instanceof Error) {
        error.code = code;
        if (errorPrefix) {
            error.message = `${errorPrefix}: ${(0, exports.extractError)(error)}`;
        }
        return error;
    }
    else {
        const message = (0, exports.extractError)(error);
        return new ErrorWithCode(errorPrefix && message
            ? `${errorPrefix}: ${message}}`
            : errorPrefix || message, code);
    }
};
//# sourceMappingURL=error.js.map