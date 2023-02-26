"use strict";
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
    async saveBlock(block, seenCommit) {
        this.blockType = protobuf_1.protocol.lookupType("Block");
        await this._db.put(block.Header.Height.toString(), await this.blockType.encode(block));
    }
    async getBlock(height) {
        await this._db.get(height);
    }
}
exports.BlockStore = BlockStore;
//# sourceMappingURL=block.js.map