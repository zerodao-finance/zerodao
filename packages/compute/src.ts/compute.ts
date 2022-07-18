import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { hexlify, arrayify } from "@ethersproject/bytes";
import { Base58 as base58 } from "@ethersproject/basex";

export function computeRandomValue(salt, address, timestamp) {
    return solidityKeccak256(
        ["string", "address", "uint256"],
        ["/zero/1.0.0" + salt, address, timestamp]
    );
}

export function getNonce(address, timestamp) {
    return this.computeRandomValue("nonce", address, timestamp)
}

export function getPNonce(address, timestamp) {
    return this.computeRandomValue("pNonce", address, timestamp)
}

export function btcAddressToHex(address) {
    return hexlify(
        (() => {
            if (address.substring(0, 3) === "bc1") {
                return arrayify(Buffer.from(address, "utf8"));
            } else {
                return base58.decode(address);
            }
        })()
    );
};