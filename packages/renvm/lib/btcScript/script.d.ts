import { Opcode } from "./opcodes";
export declare class Script {
    private script;
    static OP: typeof Opcode;
    OP: typeof Opcode;
    constructor();
    addOp: (op: Opcode) => this;
    addData: (data: Uint8Array) => this;
    bytes: () => Uint8Array;
    toScriptHashOut: () => Uint8Array;
    toAddress: (prefix: Uint8Array | Uint8Array) => Uint8Array;
}
