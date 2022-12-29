"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
const memory_1 = require("../src.ts/memory");
const chai_1 = require("chai");
describe("Sketch", () => {
  let sketch;
  const txHashes = [
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefa1",
    "0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefb12",
    "0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefc123",
    "0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefd1234",
    "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefe12345",
  ];
  beforeEach(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      sketch = yield memory_1.Sketch.init(5);
    })
  );
  it("should store a transaction in the sketch and TxMap", () => {
    sketch.storeTx(txHashes[0]);
    (0, chai_1.expect)(sketch.TxMap).to.have.property(
      "1311768467294899695",
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefa1"
    );
    // console.log(sketch._sketch.decode()) // returns Uint8Array
    // expect(sketch._sketch.decode()).to.deep.include.members([49, 50, 51, 52, 53, 54, 55, 56]);
  });
  it("should rebuild the sketch", () => {
    sketch.storeTx(txHashes[0], false);
    sketch.storeTx(txHashes[1], false);
    console.log(sketch._sketch.decode());
    sketch.rebuild();
    console.log(sketch._sketch.decode());
    /* expect(sketch._sketch.decode()).to.equal([
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
      }); */
    it("should clear the sketch and TxMap", () => {
      sketch.storeTx(txHashes[0], false);
      sketch.storeTx(txHashes[1], false);
      sketch.clear();
      (0, chai_1.expect)(sketch._sketch.decode()).to.equal([]);
      (0, chai_1.expect)(sketch.TxMap).to.equal({});
    });
    it("should calculate differences between two sketches", () =>
      __awaiter(void 0, void 0, void 0, function* () {
        sketch.storeTx(txHashes[0]);
        sketch.storeTx(txHashes[1]);
        const otherSketch = yield memory_1.Sketch.init(5);
        otherSketch.storeTx(txHashes[2]);
        otherSketch.storeTx(txHashes[3]);
        const serializedSketch = otherSketch._sketch.serialize();
        const { missing, found, rebuild } = yield sketch.calculateDifferences(
          serializedSketch
        );
        (0, chai_1.expect)(missing).to.equal([
          "53",
          "54",
          "55",
          "56",
          "49",
          "50",
          "51",
          "52",
        ]);
        (0, chai_1.expect)(found).to.equal([
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefa1",
          "0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefb12",
        ]);
        (0, chai_1.expect)(rebuild).to.equal(false);
      }));
  });
});
//# sourceMappingURL=sketch.test.js.map
