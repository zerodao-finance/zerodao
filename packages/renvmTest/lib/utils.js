"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = exports.keccak256 = void 0;
const sha256_1 = require("@noble/hashes/sha256");
const sha3_1 = require("@noble/hashes/sha3");
const assert_1 = require("./assert");
const common_1 = require("./common");
/**
 * Returns the keccak256 hash of an array of Uint8Arrays. The inputs are
 * concatenated before being hashed.
 *
 * @param msg One ore more Uint8Arrays to hash.
 * @returns The keccak256 hash of the concatenated input Uint8Arrays.
 */
const keccak256 = (...msg) => {
    (0, assert_1.assertType)("Uint8Array[]", { msg });
    return new Uint8Array((0, sha3_1.keccak_256)((0, common_1.concat)(msg)));
};
exports.keccak256 = keccak256;
/**
 * Returns the sha256 hash of an array of Uint8Arrays. The inputs are
 * concatenated before being hashed.
 *
 * @param msg One ore more Uint8Arrays to hash.
 * @returns The sha256 hash of the concatenated input Uint8Arrays.
 */
const sha256 = (...msg) => {
    (0, assert_1.assertType)("Uint8Array[]", { msg });
    return new Uint8Array((0, sha256_1.sha256)((0, common_1.concat)(msg)));
};
exports.sha256 = sha256;
//# sourceMappingURL=utils.js.map