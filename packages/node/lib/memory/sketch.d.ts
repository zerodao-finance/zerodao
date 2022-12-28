/// <reference types="node" />
import { Minisketch } from "libminisketch-wasm";
import { ethers } from "ethers";
import type { Hexable } from "@ethersproject/bytes";
export declare class Sketch {
    private _sketch;
    private TxMap;
    private capacity;
    static init(capacity: number): Promise<Sketch>;
    constructor({ sketch, capacity }: {
        sketch: Minisketch;
        capacity: number;
    });
    storeTx(txHash: Hexable, addToSketch?: boolean): void;
    rebuild(): void;
    clear(): void;
    calculateDifferences(serializedSketch: Buffer): Promise<{
        missing: string[];
        found: ethers.utils.Hexable[];
        rebuild: boolean;
    }>;
}
