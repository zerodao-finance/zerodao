"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionHash = exports.generateSighash = exports.generateNHash = exports.generateGHash = exports.generateSHash = exports.generatePHash = void 0;
const utils_1 = require("./utils");
const assert_1 = require("./assert");
const common_1 = require("./common");
const pack_1 = require("./pack");
/**
 * Creating a RenVM transaction involves calculating several hashes, used to
 * tie/commit the transaction to particular data.
 *
 * Transactions can be associated with a payload which specifies what should
 * be done with the transaction ones it's complete - e.g. after renBTC is
 * minted on Ethereum, it should be swapped for ETH. This payload can be
 * of arbitrary-length, so it's hashed to a 32-byte value using the phash
 * (or payload hash).
 *
 * The shash (or selector hash) is the hash of the selector
 * (e.g. "BTC/toEthereum").
 *
 * The ghash (gateway hash) links the payload/phash, the selector/shash,
 * the transaction's recipient and the nonce into a single value that is then
 * used to create a unique gateway address (for deposit-based transactions).
 *
 * The nhash (nonce hash) hashes the nonce, txid and txindex in order to create
 * a unique identifier of the deposit/input transaction.
 *
 * The sighash (signature hash) ties all these together, hashing the phash,
 * the amount being minted/released, the transaction's recipient, the shash and
 * the nhash. It's then signed by RenVM, and re-calculated in the gateway
 * contracts in order to spend the signature. When burning-and-releasing, the
 * sighash is empty.
 */
/**
 * Calculate the RenVM pHash (payload hash) from a payload (alias for keccak256).
 */
exports.generatePHash = utils_1.keccak256;
/**
 * Calculate the RenVM sHash (selector hash). Normalizes the selector to remove
 * the origin-chain for burn-and-mints.
 *
 * @example
 * ```
 * generateSHash("BTC/toEthereum") === keccak256("BTC/toEthereum")
 * generateSHash("BTC/fromFantomToEthereum") === keccak256("BTC/toEthereum")
 * ```
 */
const generateSHash = (selector) => {
    (0, assert_1.assertType)("string", { selector });
    const encoder = new TextEncoder();
    const toSelector = encoder.encode(selector.replace(/\/.*To/, "/to"));
    return (0, utils_1.keccak256)(toSelector);
};
exports.generateSHash = generateSHash;
/**
 * Calculate the RenVM gHash (gateway hash) - keccak256(pHash, sHash, to, nonce)
 *
 * NOTICE: Since RenJS v2, the interface has changed such that:
 * 1. the first parameter is the pHash instead of the payload, and
 * 2. the second and third parameters (sHash and to) have been swapped.
 */
const generateGHash = (pHash, sHash, to, nonce) => {
    (0, assert_1.assertType)("Uint8Array", { pHash, nonce, sHash, to });
    return (0, utils_1.keccak256)(pHash, sHash, to, nonce);
};
exports.generateGHash = generateGHash;
/**
 * Calculate the RenVM nHash (nonce hash), calculated as
 * `keccak256(nonce, txid, toNBytes(txindex, 4))`
 */
const generateNHash = (nonce, txid, txindex) => {
    (0, assert_1.assertType)("Uint8Array", { nonce, txid });
    (0, assert_1.assertType)("string", { txindex });
    return (0, utils_1.keccak256)(nonce, txid, (0, common_1.toNBytes)(txindex, 4));
};
exports.generateNHash = generateNHash;
/**
 * Calculate the RenVM sigHash (signature hash). This is the value signed by
 * RenVM for mints and releases.
 */
const generateSighash = (pHash, amount, to, sHash, nHash) => {
    (0, assert_1.assertType)("Uint8Array", { pHash, nHash, sHash, to });
    (0, assert_1.assertType)("BigNumber", { amount });
    if (pHash.length !== 32) {
        throw new Error(`Invalid pHash length - ${pHash.length} instead of 32.`);
    }
    if (sHash.length !== 32) {
        throw new Error(`Invalid pHash length - ${sHash.length} instead of 32.`);
    }
    if (nHash.length !== 32) {
        throw new Error(`Invalid pHash length - ${nHash.length} instead of 32.`);
    }
    const encoded = (0, common_1.concat)([
        pHash,
        (0, common_1.toNBytes)(amount, 32),
        sHash,
        (0, common_1.padUint8Array)(to, 32),
        nHash,
    ]);
    return (0, utils_1.keccak256)(encoded);
};
exports.generateSighash = generateSighash;
/**
 * Calculate the hash of a RenVM transaction.
 *
 * @returns A buffer of the hash. It should be converted to url-base64 before
 * being shown to users.
 */
const generateTransactionHash = (version, selector, packValue) => {
    (0, assert_1.assertType)("string", { version, selector });
    return (0, utils_1.sha256)((0, pack_1.encodeString)(version), (0, pack_1.encodeString)(selector), (0, pack_1.encodeTypedPackValue)(packValue));
};
exports.generateTransactionHash = generateTransactionHash;
//# sourceMappingURL=index.js.map