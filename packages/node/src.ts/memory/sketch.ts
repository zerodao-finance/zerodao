import { Minisketch, resolve } from "libminisketch-wasm";
import { ethers } from "ethers";
import type { Hexable } from "@ethersproject/bytes";
import { chunk } from "lodash";

export class Sketch {
  public _sketch: Minisketch;
  public TxMap: Record<string, Hexable>;
  public capacity: number;

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
    // console.log(sketchValue)
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

    // Initialize newSketch with the data from this._sketch
    const newSketch = await Minisketch.create({
      fieldSize: 64,
      capacity: this.capacity,
    });
    newSketch.deserialize(this._sketch.serialize());

    // Merge otherSketch and newSketch into this._sketch
    this._sketch.merge(otherSketch);
    this._sketch.merge(newSketch);

    // Calculate the differences between the sketches
    let missing: string[] = [],
      found: Hexable[] = [];
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
    console.log(missing)
    console.log(found)
    return { missing, found, rebuild: false };
  } */

  async calculateDifferences(serializedSketch: Buffer) {
    // Initialize otherSketch with the data from serializedSketch
    const otherSketch = await Minisketch.create({
      fieldSize: 64,
      capacity: this.capacity,
    });
    otherSketch.deserialize(serializedSketch);

    // Merge otherSketch into this._sketch
    this._sketch.merge(otherSketch);

    // Calculate the differences between the sketches
    let missing: string[] = [],
      found: Hexable[] = [];
    const [length, res] = resolve(
      chunk(this._sketch.decode() as Uint8Array, 8)
    );
    if (length < 0) {
      return { missing, found, rebuild: true };
    } else {
      // console.log(res)
      res.map((r) => {
        if (this.TxMap[r]) found.push(this.TxMap[r]);
        else missing.push(r);
      });
    }
    return { missing, found, rebuild: false };
  }
}
