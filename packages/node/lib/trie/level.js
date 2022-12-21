"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelDB = void 0;
const memory_level_1 = require("memory-level");
const ENCODING_OPTS = { keyEncoding: "buffer", valueEncoding: "buffer" };
class LevelDB {
  constructor(leveldb) {
    this._leveldb = leveldb ?? new memory_level_1.MemoryLevel(ENCODING_OPTS);
  }
  async get(key) {
    let value = null;
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS);
    } catch (error) {
      // https://github.com/Level/abstract-level/blob/915ad1317694d0ce8c580b5ab85d81e1e78a3137/abstract-level.js#L309
      // This should be `true` if the error came from LevelDB
      // so we can check for `NOT true` to identify any non-404 errors
      if (error.notFound !== true) {
        throw error;
      }
    }
    return value;
  }
  async put(key, val) {
    await this._leveldb.put(key, val, ENCODING_OPTS);
  }
  async del(key) {
    await this._leveldb.del(key, ENCODING_OPTS);
  }
  async batch(opStack) {
    await this._leveldb.batch(opStack, ENCODING_OPTS);
  }
  copy() {
    return new LevelDB(this._leveldb);
  }
}
exports.LevelDB = LevelDB;
//# sourceMappingURL=level.js.map
