"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sketch = void 0;
const libminisketch_wasm_1 = require("libminisketch-wasm");
const ethers_1 = require("ethers");
const lodash_1 = require("lodash");
class Sketch {
    static init(capacity) {
        return __awaiter(this, void 0, void 0, function* () {
            return new this({
                sketch: yield libminisketch_wasm_1.Minisketch.create({ fieldSize: 64, capacity }),
                capacity,
            });
        });
    }
    constructor({ sketch, capacity }) {
        this._sketch = sketch;
        this.capacity = capacity;
        this.TxMap = {};
    }
    storeTx(txHash, addToSketch = true) {
        const sketchValue = ethers_1.ethers.BigNumber.from(ethers_1.ethers.utils.arrayify(txHash).slice(23, 32)).toString();
        if (addToSketch)
            this._sketch.addUint(sketchValue);
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
    calculateDifferences(serializedSketch) {
        return __awaiter(this, void 0, void 0, function* () {
            const otherSketch = yield libminisketch_wasm_1.Minisketch.create({
                fieldSize: 64,
                capacity: this.capacity,
            });
            otherSketch.deserialize(serializedSketch);
            let missing = [], found = [];
            this._sketch.merge(otherSketch);
            const [length, res] = (0, libminisketch_wasm_1.resolve)((0, lodash_1.chunk)(this._sketch.decode(), 8));
            if (length < 0) {
                return { missing, found, rebuild: true };
            }
            else {
                res.map((r) => {
                    if (this.TxMap[r])
                        found.push(this.TxMap[r]);
                    else
                        missing.push(r);
                });
            }
            this._sketch.rebuild();
            return { missing, found, rebuild: false };
        });
    }
}
exports.Sketch = Sketch;
//# sourceMappingURL=sketch.js.map