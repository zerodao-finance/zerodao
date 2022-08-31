"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.txHashFromBytes = exports.txHashToBytes = exports.hash160 = exports.ripemd160 = exports.resolveBitcoinNetworkConfig = exports.SoChainExplorer = exports.StandardBitcoinExplorer = exports.addressToBytes = void 0;
const ripemd160_1 = require("@noble/hashes/ripemd160");
const utils_1 = require("@renproject/utils");
const bech32_1 = require("bech32");
const bs58_1 = __importDefault(require("bs58"));
const chains_1 = require("@renproject/chains");
const addressToBytes = (address) => {
    // Attempt to decode address as a bech32 address, and if that fails
    // fall back to base58.
    try {
        const [type, ...words] = bech32_1.bech32.decode(address).words;
        return utils_1.utils.concat([
            new Uint8Array([type]),
            new Uint8Array(bech32_1.bech32.fromWords(words)),
        ]);
    }
    catch (error) {
        try {
            return new Uint8Array(bs58_1.default.decode(address));
        }
        catch (internalError) {
            throw new Error(`Unrecognized address format "${address}".`);
        }
    }
};
exports.addressToBytes = addressToBytes;
const StandardBitcoinExplorer = (baseUrl) => ({
    url: baseUrl,
    address: (address) => `${baseUrl.replace(/\/$/, "")}/address/${address}`,
    transaction: (transaction) => `${baseUrl.replace(/\/$/, "")}/tx/${transaction || ""}`,
});
exports.StandardBitcoinExplorer = StandardBitcoinExplorer;
const SoChainExplorer = (chainPath, chainId) => ({
    url: `https://sochain.com/${chainPath}`,
    address: (address) => `https://sochain.com/address/${chainId}/${address}`,
    transaction: (transaction) => `https://sochain.com/tx/${chainId}/${transaction}`,
});
exports.SoChainExplorer = SoChainExplorer;
const resolveBitcoinNetworkConfig = (configMap, renNetwork) => {
    let networkConfig;
    if (renNetwork && (0, chains_1.isBitcoinNetworkConfig)(renNetwork)) {
        networkConfig = renNetwork;
    }
    else {
        networkConfig = configMap[renNetwork];
    }
    if (!networkConfig) {
        throw new Error(`Unsupported network '${String(renNetwork
            ? typeof renNetwork === "string"
                ? renNetwork
                : renNetwork.selector
            : renNetwork)}'. Valid options are 'mainnet', 'testnet' or a BitcoinNetworkConfig object.`);
    }
    return networkConfig;
};
exports.resolveBitcoinNetworkConfig = resolveBitcoinNetworkConfig;
/** Calculate the ripemd160 hash of the input. */
const ripemd160 = (...msg) => {
    (0, utils_1.assertType)("Uint8Array[]", { msg });
    return new Uint8Array((0, ripemd160_1.ripemd160)(utils_1.utils.concat(msg)));
};
exports.ripemd160 = ripemd160;
/**
 * hash160 is used to calculate the Bitcoin address from a private key, and is
 * equivalent to `ripemd160(sha256(publicKey))`
 */
const hash160 = (...msg) => {
    (0, utils_1.assertType)("Uint8Array[]", { msg });
    return (0, exports.ripemd160)(utils_1.utils.sha256(utils_1.utils.concat(msg)));
};
exports.hash160 = hash160;
/**
 * Convert a Bitcoin transaction hash from its standard format to the format
 * required by RenVM.
 *
 * @param txHash A Bitcoin transaction hash formatted as an unprefixed
 * hex string.
 * @returns The bytes representing the same txHash.
 */
const txHashToBytes = (txHash) => {
    return utils_1.utils.fromHex(txHash).reverse();
};
exports.txHashToBytes = txHashToBytes;
/**
 * Convert a Bitcoin transaction hash from the format required by RenVM to its
 * standard format.
 *
 * @param bytes Bytes representing a Bitcoin hash.
 * @returns The same Bitcoin transaction hash formatted as an unprefixed hex
 * string.
 */
const txHashFromBytes = (bytes) => {
    // Create new Uint8Array before reversing to avoid modifying the input
    // array.
    return utils_1.utils.toHex(new Uint8Array(bytes).reverse());
};
exports.txHashFromBytes = txHashFromBytes;
//# sourceMappingURL=btcChainUtils.js.map