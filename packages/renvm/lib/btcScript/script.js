"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Script = void 0;
const utils_1 = require("@renproject/utils");
const btcChainUtils_1 = require("../btcChainUtils");
const opcodes_1 = require("./opcodes");
const checksum = (hash) => utils_1.utils.sha256(utils_1.utils.sha256(hash)).slice(0, 4);
class Script {
    constructor() {
        this.OP = opcodes_1.Opcode;
        this.addOp = (op) => {
            this.script = new Uint8Array([...this.script, op]);
            return this;
        };
        this.addData = (data) => {
            this.script = new Uint8Array([...this.script, data.length, ...data]);
            return this;
        };
        this.bytes = () => {
            return this.script;
        };
        this.toScriptHashOut = () => {
            return new Script()
                .addOp(Script.OP.OP_HASH160)
                .addData((0, btcChainUtils_1.hash160)(this.bytes()))
                .addOp(Script.OP.OP_EQUAL)
                .bytes();
        };
        this.toAddress = (prefix) => {
            // Hash
            const hash = (0, btcChainUtils_1.hash160)(this.bytes());
            // Prepend prefix
            const hashWithPrefix = utils_1.utils.concat([prefix, hash]);
            // Append checksum
            const hashWithChecksum = utils_1.utils.concat([
                hashWithPrefix,
                checksum(hashWithPrefix),
            ]);
            return hashWithChecksum;
        };
        this.script = new Uint8Array();
    }
}
exports.Script = Script;
Script.OP = opcodes_1.Opcode;
//# sourceMappingURL=script.js.map