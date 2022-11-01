"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getContract = exports.getContractBase = exports.deployContract = void 0;
var hardhat_1 = require("hardhat");
require("ethers");
require("@ethersproject/providers");
var dotenv = __importStar(require("dotenv"));
var chain_1 = require("./chain");
dotenv.config();
var deployContract = function (name) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var references, nameWithReference, f, c;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    references = new Map([
                        ["Consideration", "ReferenceConsideration"],
                        ["Conduit", "ReferenceConduit"],
                        ["ConduitController", "ReferenceConduitController"],
                    ]);
                    nameWithReference = process.env.REFERENCE && references.has(name)
                        ? references.get(name) || name
                        : name;
                    return [4 /*yield*/, hardhat_1.ethers.getContractFactory(nameWithReference)];
                case 1:
                    f = _a.sent();
                    return [4 /*yield*/, f.deploy.apply(f, args)];
                case 2:
                    c = _a.sent();
                    return [2 /*return*/, c];
            }
        });
    });
};
exports.deployContract = deployContract;
function getContractBase(address, name) {
    return __awaiter(this, void 0, void 0, function () {
        var contract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractAt(name, address)];
                case 1:
                    contract = _a.sent();
                    return [2 /*return*/, contract];
            }
        });
    });
}
exports.getContractBase = getContractBase;
function getContract(address, name, signer) {
    return __awaiter(this, void 0, void 0, function () {
        var contract, _signer, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getContractBase(address, name)];
                case 1:
                    contract = _b.sent();
                    if (!signer) return [3 /*break*/, 5];
                    if (!(typeof signer === "string")) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, chain_1.impersonate)(signer)];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = signer;
                    _b.label = 4;
                case 4:
                    _signer = _a;
                    contract = contract.connect(_signer);
                    _b.label = 5;
                case 5: return [2 /*return*/, contract];
            }
        });
    });
}
exports.getContract = getContract;
