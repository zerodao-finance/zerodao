"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const level_1 = require("level");
const proto_1 = require("../proto");
/*
 * the Store class saves and loads ABCI responses,
 * validators, and consensus parameters
 */
class Store {
    constructor(path) {
        this.db = new level_1.Level(path);
        this.stateType = proto_1.protocol.lookupType("State");
    }
    async save(key, state) {
        const buffer = await this.stateType.encode(state);
        await this.db.put(key, buffer.toString());
    }
    async load(key) {
        const str = await this.db.get(key);
        return await this.stateType.decode(Buffer.from(str)).toObject();
    }
    async close() {
        await this.db.close();
    }
}
//# sourceMappingURL=store.js.map