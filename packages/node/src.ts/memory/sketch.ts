import { Minisketch, resolve } from "libminisketch-wasm";
import { ethers } from "ethers";
import type { Hexable } from "@ethersproject/bytes";
import { chunk } from "lodash";

class Sketch {
  private _sketch: Minisketch;
  private TxMap: Record<string, Hexable>;
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
  }

  storeTx(txHash: Hexable) {
    const sketchValue = ethers.BigNumber.from(
      ethers.utils.arrayify(txHash).slice(24, 32)
    ).toString();
    this._sketch.addUint(sketchValue);
    this.TxMap[sketchValue] = txHash;
  }

  rebuildFromStore() {
    this._sketch.rebuild();
    Object.keys(this.TxMap).map((d) => this._sketch.addUint(d));
  }

  async calculateDifferences(serializedSketch: Buffer) {
    const otherSketch = await Minisketch.create({
      fieldSize: 64,
      capacity: this.capacity,
    });
    otherSketch.deserialize(serializedSketch);
    let missing: string[] = [],
      found: Hexable[] = [];
    this._sketch.merge(otherSketch);
    const [length, res] = resolve(
      chunk(this._sketch.decode() as Uint8Array, 8)
    );
    if (length < 0) {
      //TODO: rewrite this out a bit
    } else {
      res.map((r) => {
        if (this.TxMap[r]) found.push(this.TxMap[r]);
        else missing.push(r);
      });
    }
    return { missing, found };
  }
}
