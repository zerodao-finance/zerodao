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
exports.createBalanceCheckpoint = exports.getTransactionCost = exports.withSigner = exports.stopImpersonating = exports.impersonate = exports.createSnapshot = exports.faucet = exports.getTransactionTimestamp = void 0;
require("@ethersproject/providers");
require("ethers");
var utils_1 = require("ethers/lib/utils");
var hardhat_1 = require("hardhat");
require("../../typechain-types");
var TEN_THOUSAND_ETH = (0, utils_1.parseEther)("10000").toHexString().replace("0x0", "0x");
var getTransactionTimestamp = function (tx) { return __awaiter(void 0, void 0, void 0, function () {
    var timestamp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.resolve(tx)
                    .then(function (_a) {
                    var wait = _a.wait;
                    return wait();
                })
                    .then(function (_a) {
                    var blockHash = _a.blockHash;
                    return hardhat_1.ethers.provider.getBlock(blockHash);
                })];
            case 1:
                timestamp = (_a.sent()).timestamp;
                return [2 /*return*/, timestamp];
        }
    });
}); };
exports.getTransactionTimestamp = getTransactionTimestamp;
var faucet = function (address) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hardhat_1.ethers.provider.send("hardhat_setBalance", [address, TEN_THOUSAND_ETH])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.faucet = faucet;
function createSnapshot() {
    return __awaiter(this, void 0, void 0, function () {
        var snapshotId;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.network.provider.request({
                        method: "evm_snapshot"
                    })];
                case 1:
                    snapshotId = _a.sent();
                    return [2 /*return*/, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, hardhat_1.network.provider.request({
                                            method: "evm_revert",
                                            params: [snapshotId]
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, hardhat_1.network.provider.request({
                                                method: "evm_snapshot"
                                            })];
                                    case 2:
                                        snapshotId = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }];
            }
        });
    });
}
exports.createSnapshot = createSnapshot;
function impersonate(address) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.network.provider.request({
                        method: "hardhat_impersonateAccount",
                        params: [address]
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, hardhat_1.ethers.provider.getSigner(address)];
            }
        });
    });
}
exports.impersonate = impersonate;
function stopImpersonating(address) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.network.provider.request({
                        method: "hardhat_stopImpersonatingAccount",
                        params: [address]
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.stopImpersonating = stopImpersonating;
function withSigner(address, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var signer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, impersonate(address)];
                case 1:
                    signer = _a.sent();
                    return [4 /*yield*/, fn(signer)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, stopImpersonating(address)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.withSigner = withSigner;
function getTransactionCost(tx) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, wait, gasPrice, gasUsed;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve(tx)];
                case 1:
                    _a = _b.sent(), wait = _a.wait, gasPrice = _a.gasPrice;
                    return [4 /*yield*/, wait()];
                case 2:
                    gasUsed = (_b.sent()).gasUsed;
                    return [2 /*return*/, gasUsed.mul(gasPrice)];
            }
        });
    });
}
exports.getTransactionCost = getTransactionCost;
function createBalanceCheckpoint(token, account) {
    return __awaiter(this, void 0, void 0, function () {
        var bal, balanceBefore;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bal = function () {
                        return token ? token.balanceOf(account) : hardhat_1.ethers.provider.getBalance(account);
                    };
                    return [4 /*yield*/, bal()];
                case 1:
                    balanceBefore = _a.sent();
                    return [2 /*return*/, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var balanceAfter, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, bal()];
                                    case 1:
                                        balanceAfter = _c.sent();
                                        if (!(tx && !token)) return [3 /*break*/, 3];
                                        _b = (_a = balanceAfter).add;
                                        return [4 /*yield*/, getTransactionCost(tx)];
                                    case 2:
                                        balanceAfter = _b.apply(_a, [_c.sent()]);
                                        _c.label = 3;
                                    case 3: return [2 /*return*/, balanceAfter.sub(balanceBefore)];
                                }
                            });
                        }); }];
            }
        });
    });
}
exports.createBalanceCheckpoint = createBalanceCheckpoint;
