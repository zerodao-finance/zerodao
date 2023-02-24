"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sketch = void 0;
const libminisketch_wasm_1 = require("libminisketch-wasm");
const ethers_1 = require("ethers");
const lodash_1 = require("lodash");
const lodash_2 = __importDefault(require("lodash"));
class Sketch {
    static async init(capacity) {
        return new this({
            sketch: await libminisketch_wasm_1.Minisketch.create({ fieldSize: 64, capacity }),
            capacity,
        });
    }
    static async fromTxs(wtxs) {
        let _valHash = lodash_2.default.map(wtxs, (i) => {
            let _val = Number(ethers_1.ethers.utils.hexlify(ethers_1.ethers.utils.arrayify(i.hash).slice(24, 27)));
            return [_val, i.hash];
        });
        var sketch = await Sketch.init(wtxs.length);
        for (let [val, hash] of _valHash) {
            sketch.storeWrappedTxs(val, hash);
        }
        return sketch;
    }
    constructor({ sketch, capacity }) {
        this._sketch = sketch;
        this.capacity = capacity;
        this.TxMap = {};
    }
    storeWrappedTxs(sVal, hash) {
        this._sketch.addUint(sVal);
        this.TxMap[sVal] = hash;
    }
    storeTx(txHash, addToSketch = true) {
        const sketchValue = ethers_1.ethers.BigNumber.from(ethers_1.ethers.utils.arrayify(txHash).slice(24, 32)).toString();
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
    async calculateDifferences(serializedSketch) {
        const otherSketch = await libminisketch_wasm_1.Minisketch.create({
            fieldSize: 64,
            capacity: this.capacity,
        });
        otherSketch.deserialize(serializedSketch);
        let missing = [], found = [];
        this._sketch.merge(otherSketch);
        const [length, res] = (0, libminisketch_wasm_1.resolve)((0, lodash_1.chunk)(this._sketch.decode(), 8));
        console.log(length, res);
        console.log(this.capacity);
        if (length > this.capacity) {
            return { missing, found, rebuild: true };
        }
        else {
            if (length == 0) {
                return { missing, found, rebuild: false };
            }
            res.map((r) => {
                if (this.TxMap[r])
                    found.push(this.TxMap[r]);
                else
                    missing.push(r);
            });
        }
        this._sketch.rebuild();
        return { missing, found, rebuild: false };
    }
}
exports.Sketch = Sketch;
//# sourceMappingURL=sketch.js.map