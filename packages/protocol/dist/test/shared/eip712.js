"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getTransferRequestDigest = exports.getApprovalDigest = exports.getDomainSeparator = exports.EIP712_TransferRequestType = void 0;
require("@ethersproject/strings");
require("ethers");
require("@ethersproject/keccak256");
require("ethers/lib/utils");
var hardhat_1 = require("hardhat");
var hash_1 = require("@ethereum-waffle/provider/node_modules/@ethersproject/hash");
var EIP712_DomainType = {
    EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
    ]
};
exports.EIP712_TransferRequestType = {
    TransferRequest: [
        {
            name: "asset",
            type: "address"
        },
        {
            name: "amount",
            type: "uint256"
        },
        {
            name: "module",
            type: "address"
        },
        {
            name: "nonce",
            type: "uint256"
        },
        {
            name: "data",
            type: "bytes"
        },
    ]
};
var EIP712_PermitType = {
    Permit: [
        {
            name: "owner",
            type: "address"
        },
        {
            name: "spender",
            type: "address"
        },
        {
            name: "value",
            type: "uint256"
        },
        {
            name: "nonce",
            type: "uint256"
        },
        {
            name: "deadline",
            type: "uint256"
        },
    ]
};
function getDomainSeparator(name, verifyingContract, version) {
    if (version === void 0) { version = "1"; }
    return {
        name: name,
        version: version,
        chainId: hardhat_1.network.config.chainId,
        verifyingContract: verifyingContract
    };
}
exports.getDomainSeparator = getDomainSeparator;
function getApprovalDigest(token, approve, nonce, deadline) {
    return __awaiter(this, void 0, void 0, function () {
        var name, domain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, token.name()];
                case 1:
                    name = _a.sent();
                    domain = getDomainSeparator(name, token.address);
                    return [2 /*return*/, hash_1._TypedDataEncoder.hash(domain, EIP712_PermitType, {
                            owner: approve.owner,
                            spender: approve.spender,
                            value: approve.value,
                            nonce: nonce,
                            deadline: deadline
                        })];
            }
        });
    });
}
exports.getApprovalDigest = getApprovalDigest;
var getTransferRequestDigest = function (contract, asset, amount, module, nonce, data) { return __awaiter(void 0, void 0, void 0, function () {
    var name, domain;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, contract.name()];
            case 1:
                name = _a.sent();
                domain = getDomainSeparator(name, contract.address);
                return [2 /*return*/, hash_1._TypedDataEncoder.hash(domain, exports.EIP712_TransferRequestType, {
                        asset: asset,
                        amount: amount,
                        module: module,
                        nonce: nonce,
                        data: data
                    })];
        }
    });
}); };
exports.getTransferRequestDigest = getTransferRequestDigest;
