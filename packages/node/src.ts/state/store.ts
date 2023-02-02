import { Level } from "level";
import path from "path";
import yargs from "yargs/yargs";
import { IState } from "./state";
import { protocol } from "../proto";
/*
 * the Store class saves and loads ABCI responses,
 * validators, and consensus parameters
 */

class Store {
  db: Level;
  stateType;
  constructor(path: string) {
    this.db = new Level(path);
    this.stateType = protocol.lookupType("State");
  }

  async save(key, state: IState) {
    const buffer: Buffer = await this.stateType.encode(state);
    await this.db.put(key, buffer.toString());
  }

  async load(key: string) {
    const str = await this.db.get(key);
    return await this.stateType.decode(Buffer.from(str)).toObject();
  }

  async close() {
    await this.db.close();
  }
}
