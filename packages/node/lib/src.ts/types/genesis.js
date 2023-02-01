"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveAs = exports.GenesisDocFromJSON = void 0;
const fs_1 = __importDefault(require("fs"));
function ValidateAndComplete(doc) {
    if (doc.ChainID == "")
        throw new Error("genesis doc must include non-empty chain_id");
    if (doc.InitialHeight < 0)
        throw new Error(`initial_height cannot be negative (got ${doc.InitialHeight})`);
    if (doc.InitialHeight == 0)
        doc.InitialHeight = 1;
    return doc;
}
// basic genesis doc from json
function GenesisDocFromJSON(path_to_file) {
    try {
        const _gdoc = fs_1.default.readFileSync(path_to_file);
        return JSON.parse(_gdoc);
    }
    catch (error) {
        throw error;
    }
}
exports.GenesisDocFromJSON = GenesisDocFromJSON;
function SaveAs() {
    //TODO implement save genesis file to JSON
}
exports.SaveAs = SaveAs;
//# sourceMappingURL=genesis.js.map