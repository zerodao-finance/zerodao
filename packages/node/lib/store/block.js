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
exports.BlockStore = void 0;
const level_1 = require("level");
const protobuf_1 = require("@zerodao/protobuf");
class BlockStore {
    constructor(path) {
        this._base = 0;
        this._height = 0;
        this._db = new level_1.Level(path);
    }
    get base() {
        return this._base;
    }
    get height() {
        return this._height;
    }
    saveBlock(block, seenCommit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.blockType = protobuf_1.protocol.lookupType("Block");
            yield this._db.put(block.Header.Height.toString(), yield this.blockType.encode(block));
        });
    }
    getBlock(height) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._db.get(height);
        });
    }
}
exports.BlockStore = BlockStore;
//# sourceMappingURL=block.js.map