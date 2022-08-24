"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractError = exports.invalidError = exports.hasOwnProperty = void 0;
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
//# sourceMappingURL=extractError.js.map