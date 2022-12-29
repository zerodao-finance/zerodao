import { Minisketch, resolve } from "libminisketch-wasm";
import { ethers } from "ethers";
import type { Hexable } from "@ethersproject/bytes";
import { chunk } from "lodash";

export class Sketch {
  private _sketch: Minisketch;
  private TxMap: Record<string, string>;
  private capacity: number;

  static async init(capacity: number) {
    return new this({
      sketch: await Minisketch.create({ fieldSize: 64, capacity }),
      capacity,
    });
  }
  constructor({ sketch, capacity }: { sketch: Minisketch; capacity: number }) {
    this._sketch = sketch;
    this.capacity = capacity;
    this.TxMap = {};
  }

  storeTx(txHash: string, addToSketch: boolean = true) {
    const sketchValue = ethers.BigNumber.from(
      ethers.utils.arrayify(txHash).slice(23, 32)
    ).toString();
    if (addToSketch) this._sketch.addUint(sketchValue);
    this.TxMap[sketchValue] = txHash;
  }

  rebuild() {
    this._sketch.rebuild();
    Object.keys(this.TxMap).map((d) => this._sketch.addUint(d));
  }

  clear() {
    this._sketch.rebuild();
    this.TxMap = {};
  }

  serialize() {
    return this._sketch.serialize();
  }

  async calculateDifferences(serializedSketch: Buffer) {
    const otherSketch = await Minisketch.create({
      fieldSize: 64,
      capacity: this.capacity,
    });
    otherSketch.deserialize(serializedSketch);
    let missing: string[] = [],
      found: string[] = [];
    this._sketch.merge(otherSketch);
    const [length, res] = resolve(
      chunk(this._sketch.decode() as Uint8Array, 8)
    );
    if (length < 0) {
      return { missing, found, rebuild: true };
    } else {
      res.map((r) => {
        if (this.TxMap[r]) found.push(this.TxMap[r]);
        else missing.push(r);
      });
    }
    this._sketch.rebuild();
    return { missing, found, rebuild: false };
  }
}
