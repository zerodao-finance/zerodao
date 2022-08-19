/**
 * Returns the keccak256 hash of an array of Uint8Arrays. The inputs are
 * concatenated before being hashed.
 *
 * @param msg One ore more Uint8Arrays to hash.
 * @returns The keccak256 hash of the concatenated input Uint8Arrays.
 */
export declare const keccak256: (...msg: Uint8Array[]) => Uint8Array;
/**
 * Returns the sha256 hash of an array of Uint8Arrays. The inputs are
 * concatenated before being hashed.
 *
 * @param msg One ore more Uint8Arrays to hash.
 * @returns The sha256 hash of the concatenated input Uint8Arrays.
 */
export declare const sha256: (...msg: Uint8Array[]) => Uint8Array;
//# sourceMappingURL=utils.d.ts.map