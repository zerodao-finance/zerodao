import { Sketch } from "../src.ts/memory";
import { expect } from "chai";

describe("Sketch", () => {
  let sketch: Sketch;
  const txHashes = [
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefa1",
    "0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefb12",
    "0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefc123",
    "0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefd1234",
    "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefe12345",
  ];

  beforeEach(async () => {
    sketch = await Sketch.init(5);
  });

  it("should store a transaction in the sketch and TxMap", () => {
    sketch.storeTx(txHashes[0] as any);
    expect(sketch.TxMap).to.have.property(
      "1311768467294899695",
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefa1"
    );
    // console.log(sketch._sketch.decode()) // returns Uint8Array
    // expect(sketch._sketch.decode()).to.deep.include.members([49, 50, 51, 52, 53, 54, 55, 56]);
  });

  /*  it('should rebuild the sketch', () => {
      // sketch.storeTx(txHashes[0] as any, false);
      // sketch.storeTx(txHashes[1] as any, false);
       console.log(sketch._sketch.decode())
       sketch.rebuild();
       console.log(sketch._sketch.decode())
        expect(sketch._sketch.decode()).to.equal([
         0,
         0,
         0,
         0,
         0,
         0,
         0,
         0,
         49,
         50,
         51,
         52,
         53,
         54,
         55,
         56,
         50,
         51,
         52,
         53,
         54,
         55,
         56,
         49,
         50,
         51,
         52,
         53,
         54,
         55,
         56,
       ]);
     }); 
    */
  /*  it('should clear the sketch and TxMap', () => {
       sketch.storeTx(txHashes[0] as any, false);
       sketch.storeTx(txHashes[1] as any, false);
       sketch.clear();
       console.log(sketch._sketch.decode())
       expect(sketch._sketch.decode()).to.equal([]);
       expect(sketch.TxMap).to.equal({});
     }); */

  it("should calculate differences between two sketches", async () => {
    const sketchNew = await Sketch.init(5);
    sketchNew.storeTx(txHashes[1] as any);
    sketchNew.storeTx(txHashes[2] as any);
    console.log(sketchNew.TxMap);
    const otherSketch = await Sketch.init(5);
    otherSketch.storeTx(txHashes[1] as any);
    otherSketch.storeTx(txHashes[2] as any);
    console.log(otherSketch.TxMap);
    const serializedSketch = otherSketch._sketch.serialize();
    const ourSketch = sketch._sketch.serialize();
    const { missing, found, rebuild } = await sketchNew.calculateDifferences(
      serializedSketch
    );
    // console.log(missing)
    // console.log(found)
    //console.log(rebuild)
    /*  expect(missing).to.equal(['53', '54', '55', '56', '49', '50', '51', '52']);
         expect(found).to.equal([
           '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefa1',
           '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefb12',
         ]);
         expect(rebuild).to.equal(false); */
  });
});
