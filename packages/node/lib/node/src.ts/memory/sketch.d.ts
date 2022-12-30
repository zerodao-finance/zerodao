/// <reference types="node" />
import { Minisketch } from "libminisketch-wasm";
export declare class Sketch {
    private _sketch;
    private TxMap;
    private capacity;
    static init(capacity: number): Promise<Sketch>;
    constructor({ sketch, capacity }: {
        sketch: Minisketch;
        capacity: number;
    });
    storeTx(txHash: string, addToSketch?: boolean): void;
    rebuild(): void;
    clear(): void;
    serialize(): Buffer;
    calculateDifferences(serializedSketch: Buffer): Promise<{
        missing: string[];
        found: string[];
        rebuild: boolean;
    }>;
}
