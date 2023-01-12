import { Level } from "level";
import { Block } from "../types"
import { protocol } from "../proto";
export class BlockStore {
  private _base: number = 0;
  private _height: number = 0;

  private _db: any;
  blockType;
  constructor(path: string) {
    this._db = new Level(path)
  }

  get base(): number {
    return this._base;
  }

  get height(): number {
    return this._height;
  }

  async saveBlock(block: Block, seenCommit) {
    this.blockType = protocol.lookupType("Block");
    await this._db.put(block.Header.Height.toString(), await this.blockType.encode(block));
  }

  async getBlock(height: number) {
   await this._db.get(height)
  }

}
