"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPack = exports.queryTx = void 0;
const utils_1 = require("@renproject/utils");
const axios_1 = __importDefault(require("axios"));
const queryTx = async (selector, object) => {
    const packed = await (0, exports.getPack)(object);
    const version = "1";
    const hash = await utils_1.utils.toURLBase64((0, utils_1.generateTransactionHash)(version, selector, packed));
    const queryTx = async () => {
        const response = await axios_1.default.post("https://rpc.renproject.io", {
            method: "ren_queryTx",
            id: 1,
            jsonrpc: "2.0",
            params: {
                txHash: hash,
            },
        });
        return response.data.result;
    };
    const result = await queryTx();
    console.log(result);
    return result;
};
exports.queryTx = queryTx;
const getPack = async (object) => {
    const packValue = {
        t: {
            struct: [
                {
                    txid: "bytes",
                },
                {
                    txindex: "u32",
                },
                {
                    amount: "u256",
                },
                {
                    payload: "bytes",
                },
                {
                    phash: "bytes32",
                },
                {
                    to: "string",
                },
                {
                    nonce: "bytes32",
                },
                {
                    nhash: "bytes32",
                },
                {
                    gpubkey: "bytes",
                },
                {
                    ghash: "bytes32",
                },
            ],
        },
        v: {
            amount: object.amount,
            ghash: object.ghash,
            gpubkey: object.gpubkey,
            nhash: object.nhash,
            nonce: object.nonce,
            payload: object.payload,
            phash: object.phash,
            to: object.to,
            txid: object.txid,
            txindex: object.txindex,
        },
    };
    return packValue;
};
exports.getPack = getPack;
//# sourceMappingURL=queryTx.js.map