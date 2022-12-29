/// <reference types="node" />
import { Minisketch } from "libminisketch-wasm";
import { ethers } from "ethers";
import type { Hexable } from "@ethersproject/bytes";
export declare class Sketch {
  _sketch: Minisketch;
  TxMap: Record<string, Hexable>;
  capacity: number;
  static init(capacity: number): Promise<Sketch>;
  constructor({ sketch, capacity }: { sketch: Minisketch; capacity: number });
  storeTx(txHash: Hexable, addToSketch?: boolean): void;
  rebuild(): void;
  clear(): void;
  calculateDifferences(serializedSketch: Buffer): Promise<{
    missing: string[];
    found: ethers.utils.Hexable[];
    rebuild: boolean;
  }>;
}
