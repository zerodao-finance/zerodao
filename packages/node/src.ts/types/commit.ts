import { BlockID } from "./block"

export type Commit = {
    Height: number,
    Round: number,
    BlockID: BlockID,
    Signatures: Array<{}>
}