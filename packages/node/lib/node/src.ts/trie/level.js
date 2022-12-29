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
exports.LevelDB = void 0;
const memory_level_1 = require("memory-level");
const ENCODING_OPTS = { keyEncoding: "buffer", valueEncoding: "buffer" };
class LevelDB {
  constructor(leveldb) {
    this._leveldb =
      leveldb !== null && leveldb !== void 0
        ? leveldb
        : new memory_level_1.MemoryLevel(ENCODING_OPTS);
  }
  get(key) {
    return __awaiter(this, void 0, void 0, function* () {
      let value = null;
      try {
        value = yield this._leveldb.get(key, ENCODING_OPTS);
      } catch (error) {
        // https://github.com/Level/abstract-level/blob/915ad1317694d0ce8c580b5ab85d81e1e78a3137/abstract-level.js#L309
        // This should be `true` if the error came from LevelDB
        // so we can check for `NOT true` to identify any non-404 errors
        if (error.notFound !== true) {
          throw error;
        }
      }
      return value;
    });
  }
  put(key, val) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this._leveldb.put(key, val, ENCODING_OPTS);
    });
  }
  del(key) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this._leveldb.del(key, ENCODING_OPTS);
    });
  }
  batch(opStack) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this._leveldb.batch(opStack, ENCODING_OPTS);
    });
  }
  copy() {
    return new LevelDB(this._leveldb);
  }
}
exports.LevelDB = LevelDB;
//# sourceMappingURL=level.js.map
