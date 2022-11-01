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
var hardhat_1 = require("hardhat");
var chai_1 = require("chai");
describe('ModuleStateCoder.sol', function () {
    var externalModuleState;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        var Factory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('ExternalModuleStateCoder')];
                case 1:
                    Factory = _a.sent();
                    return [4 /*yield*/, Factory.deploy()];
                case 2:
                    externalModuleState = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('decode', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, moduleType, loanGasE4, repayGasE4, ethRefundForLoanGas, ethRefundForRepayGas, btcFeeForLoanGas, btcFeeForRepayGas, lastUpdateTimestamp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0x00", "0xff", "0x00", "0xffffffffffffffff", "0x00", "0xffffff", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 2:
                        _a = _b.sent(), moduleType = _a.moduleType, loanGasE4 = _a.loanGasE4, repayGasE4 = _a.repayGasE4, ethRefundForLoanGas = _a.ethRefundForLoanGas, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForLoanGas = _a.btcFeeForLoanGas, btcFeeForRepayGas = _a.btcFeeForRepayGas, lastUpdateTimestamp = _a.lastUpdateTimestamp;
                        (0, chai_1.expect)(moduleType).to.eq("0x03");
                        (0, chai_1.expect)(loanGasE4).to.eq("0x00");
                        (0, chai_1.expect)(repayGasE4).to.eq("0xff");
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0x00");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0xffffffffffffffff");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0xffffff");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, moduleType, loanGasE4, repayGasE4, ethRefundForLoanGas, ethRefundForRepayGas, btcFeeForLoanGas, btcFeeForRepayGas, lastUpdateTimestamp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0xff", "0x00", "0xffffffffffffffff", "0x00", "0xffffff", "0x00", "0xffffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 2:
                        _a = _b.sent(), moduleType = _a.moduleType, loanGasE4 = _a.loanGasE4, repayGasE4 = _a.repayGasE4, ethRefundForLoanGas = _a.ethRefundForLoanGas, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForLoanGas = _a.btcFeeForLoanGas, btcFeeForRepayGas = _a.btcFeeForRepayGas, lastUpdateTimestamp = _a.lastUpdateTimestamp;
                        (0, chai_1.expect)(moduleType).to.eq("0x00");
                        (0, chai_1.expect)(loanGasE4).to.eq("0xff");
                        (0, chai_1.expect)(repayGasE4).to.eq("0x00");
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0xffffffffffffffff");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0xffffff");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0x00");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0xffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('encode', function () {
        it('Reverts when loanGasE4 overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.encode("0x00", "0x01ff", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when repayGasE4 overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.encode("0x00", "0x00", "0x01ff", "0x00", "0x00", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when ethRefundForLoanGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.encode("0x00", "0x00", "0x00", "0x01ffffffffffffffff", "0x00", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when ethRefundForRepayGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.encode("0x00", "0x00", "0x00", "0x00", "0x01ffffffffffffffff", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when btcFeeForLoanGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x01ffffff", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when btcFeeForRepayGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x01ffffff", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when lastUpdateTimestamp overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x01ffffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, moduleType, loanGasE4, repayGasE4, ethRefundForLoanGas, ethRefundForRepayGas, btcFeeForLoanGas, btcFeeForRepayGas, lastUpdateTimestamp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalModuleState.encode("0x03", "0x00", "0xff", "0x00", "0xffffffffffffffff", "0x00", "0xffffff", "0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        _a = _b.sent(), moduleType = _a.moduleType, loanGasE4 = _a.loanGasE4, repayGasE4 = _a.repayGasE4, ethRefundForLoanGas = _a.ethRefundForLoanGas, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForLoanGas = _a.btcFeeForLoanGas, btcFeeForRepayGas = _a.btcFeeForRepayGas, lastUpdateTimestamp = _a.lastUpdateTimestamp;
                        (0, chai_1.expect)(moduleType).to.eq("0x03");
                        (0, chai_1.expect)(loanGasE4).to.eq("0x00");
                        (0, chai_1.expect)(repayGasE4).to.eq("0xff");
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0x00");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0xffffffffffffffff");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0xffffff");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, moduleType, loanGasE4, repayGasE4, ethRefundForLoanGas, ethRefundForRepayGas, btcFeeForLoanGas, btcFeeForRepayGas, lastUpdateTimestamp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalModuleState.encode("0x00", "0xff", "0x00", "0xffffffffffffffff", "0x00", "0xffffff", "0x00", "0xffffffff");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        _a = _b.sent(), moduleType = _a.moduleType, loanGasE4 = _a.loanGasE4, repayGasE4 = _a.repayGasE4, ethRefundForLoanGas = _a.ethRefundForLoanGas, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForLoanGas = _a.btcFeeForLoanGas, btcFeeForRepayGas = _a.btcFeeForRepayGas, lastUpdateTimestamp = _a.lastUpdateTimestamp;
                        (0, chai_1.expect)(moduleType).to.eq("0x00");
                        (0, chai_1.expect)(loanGasE4).to.eq("0xff");
                        (0, chai_1.expect)(repayGasE4).to.eq("0x00");
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0xffffffffffffffff");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0xffffff");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0x00");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0xffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getLoanParams', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, moduleType, ethRefundForLoanGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.getLoanParams()];
                    case 2:
                        _a = _b.sent(), moduleType = _a.moduleType, ethRefundForLoanGas = _a.ethRefundForLoanGas;
                        (0, chai_1.expect)(moduleType).to.eq("0x03");
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, moduleType, ethRefundForLoanGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0xff", "0xff", "0xffffffffffffffff", "0xffffffffffffffff", "0xffffff", "0xffffff", "0xffffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.getLoanParams()];
                    case 2:
                        _a = _b.sent(), moduleType = _a.moduleType, ethRefundForLoanGas = _a.ethRefundForLoanGas;
                        (0, chai_1.expect)(moduleType).to.eq("0x00");
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0xffffffffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getBitcoinGasFees', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, btcFeeForLoanGas, btcFeeForRepayGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0xffffff", "0x00", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.getBitcoinGasFees()];
                    case 2:
                        _a = _b.sent(), btcFeeForLoanGas = _a.btcFeeForLoanGas, btcFeeForRepayGas = _a.btcFeeForRepayGas;
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0xffffff");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, btcFeeForLoanGas, btcFeeForRepayGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0xff", "0xff", "0xffffffffffffffff", "0xffffffffffffffff", "0x00", "0xffffff", "0xffffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.getBitcoinGasFees()];
                    case 2:
                        _a = _b.sent(), btcFeeForLoanGas = _a.btcFeeForLoanGas, btcFeeForRepayGas = _a.btcFeeForRepayGas;
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0xffffff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setRepayParams', function () {
        it('Reverts when ethRefundForRepayGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setRepayParams("0x00", "0x01ffffffffffffffff", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when btcFeeForRepayGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setRepayParams("0x00", "0x00", "0x01ffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, moduleType, ethRefundForRepayGas, btcFeeForRepayGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalModuleState.setRepayParams("0x03", "0x00", "0xffffff");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        _a = _b.sent(), moduleType = _a.moduleType, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForRepayGas = _a.btcFeeForRepayGas;
                        (0, chai_1.expect)(moduleType).to.eq("0x03");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0xffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, moduleType, ethRefundForRepayGas, btcFeeForRepayGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalModuleState.setRepayParams("0x00", "0xffffffffffffffff", "0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        _a = _b.sent(), moduleType = _a.moduleType, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForRepayGas = _a.btcFeeForRepayGas;
                        (0, chai_1.expect)(moduleType).to.eq("0x00");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0xffffffffffffffff");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getRepayParams', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, moduleType, ethRefundForRepayGas, btcFeeForRepayGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0x00", "0x00", "0x00", "0x00", "0x00", "0xffffff", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.getRepayParams()];
                    case 2:
                        _a = _b.sent(), moduleType = _a.moduleType, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForRepayGas = _a.btcFeeForRepayGas;
                        (0, chai_1.expect)(moduleType).to.eq("0x03");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0xffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, moduleType, ethRefundForRepayGas, btcFeeForRepayGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0xff", "0xff", "0xffffffffffffffff", "0xffffffffffffffff", "0xffffff", "0x00", "0xffffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.getRepayParams()];
                    case 2:
                        _a = _b.sent(), moduleType = _a.moduleType, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForRepayGas = _a.btcFeeForRepayGas;
                        (0, chai_1.expect)(moduleType).to.eq("0x00");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0xffffffffffffffff");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setCached', function () {
        it('Reverts when ethRefundForLoanGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setCached("0x01ffffffffffffffff", "0x00", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when ethRefundForRepayGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setCached("0x00", "0x01ffffffffffffffff", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when btcFeeForLoanGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setCached("0x00", "0x00", "0x01ffffff", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when btcFeeForRepayGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setCached("0x00", "0x00", "0x00", "0x01ffffff", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when lastUpdateTimestamp overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setCached("0x00", "0x00", "0x00", "0x00", "0x01ffffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, ethRefundForLoanGas, ethRefundForRepayGas, btcFeeForLoanGas, btcFeeForRepayGas, lastUpdateTimestamp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalModuleState.setCached("0xffffffffffffffff", "0x00", "0xffffff", "0x00", "0xffffffff");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        _a = _b.sent(), ethRefundForLoanGas = _a.ethRefundForLoanGas, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForLoanGas = _a.btcFeeForLoanGas, btcFeeForRepayGas = _a.btcFeeForRepayGas, lastUpdateTimestamp = _a.lastUpdateTimestamp;
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0xffffffffffffffff");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0xffffff");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0x00");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0xffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, ethRefundForLoanGas, ethRefundForRepayGas, btcFeeForLoanGas, btcFeeForRepayGas, lastUpdateTimestamp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalModuleState.setCached("0x00", "0xffffffffffffffff", "0x00", "0xffffff", "0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        _a = _b.sent(), ethRefundForLoanGas = _a.ethRefundForLoanGas, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForLoanGas = _a.btcFeeForLoanGas, btcFeeForRepayGas = _a.btcFeeForRepayGas, lastUpdateTimestamp = _a.lastUpdateTimestamp;
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0x00");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0xffffffffffffffff");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0xffffff");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getCached', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, ethRefundForLoanGas, ethRefundForRepayGas, btcFeeForLoanGas, btcFeeForRepayGas, lastUpdateTimestamp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0x00", "0x00", "0xffffffffffffffff", "0x00", "0xffffff", "0x00", "0xffffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.getCached()];
                    case 2:
                        _a = _b.sent(), ethRefundForLoanGas = _a.ethRefundForLoanGas, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForLoanGas = _a.btcFeeForLoanGas, btcFeeForRepayGas = _a.btcFeeForRepayGas, lastUpdateTimestamp = _a.lastUpdateTimestamp;
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0xffffffffffffffff");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0xffffff");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0x00");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0xffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, ethRefundForLoanGas, ethRefundForRepayGas, btcFeeForLoanGas, btcFeeForRepayGas, lastUpdateTimestamp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0xff", "0xff", "0x00", "0xffffffffffffffff", "0x00", "0xffffff", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.getCached()];
                    case 2:
                        _a = _b.sent(), ethRefundForLoanGas = _a.ethRefundForLoanGas, ethRefundForRepayGas = _a.ethRefundForRepayGas, btcFeeForLoanGas = _a.btcFeeForLoanGas, btcFeeForRepayGas = _a.btcFeeForRepayGas, lastUpdateTimestamp = _a.lastUpdateTimestamp;
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0x00");
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0xffffffffffffffff");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0xffffff");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setGasParams', function () {
        it('Reverts when loanGasE4 overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setGasParams("0x01ff", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when repayGasE4 overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setGasParams("0x00", "0x01ff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, loanGasE4, repayGasE4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalModuleState.setGasParams("0xff", "0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        _a = _b.sent(), loanGasE4 = _a.loanGasE4, repayGasE4 = _a.repayGasE4;
                        (0, chai_1.expect)(loanGasE4).to.eq("0xff");
                        (0, chai_1.expect)(repayGasE4).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, loanGasE4, repayGasE4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalModuleState.setGasParams("0x00", "0xff");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        _a = _b.sent(), loanGasE4 = _a.loanGasE4, repayGasE4 = _a.repayGasE4;
                        (0, chai_1.expect)(loanGasE4).to.eq("0x00");
                        (0, chai_1.expect)(repayGasE4).to.eq("0xff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getGasParams', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, loanGasE4, repayGasE4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0xff", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.getGasParams()];
                    case 2:
                        _a = _b.sent(), loanGasE4 = _a.loanGasE4, repayGasE4 = _a.repayGasE4;
                        (0, chai_1.expect)(loanGasE4).to.eq("0xff");
                        (0, chai_1.expect)(repayGasE4).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, loanGasE4, repayGasE4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0x00", "0xff", "0xffffffffffffffff", "0xffffffffffffffff", "0xffffff", "0xffffff", "0xffffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalModuleState.getGasParams()];
                    case 2:
                        _a = _b.sent(), loanGasE4 = _a.loanGasE4, repayGasE4 = _a.repayGasE4;
                        (0, chai_1.expect)(loanGasE4).to.eq("0x00");
                        (0, chai_1.expect)(repayGasE4).to.eq("0xff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getModuleType', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var moduleType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getModuleType()];
                    case 2:
                        moduleType = _a.sent();
                        (0, chai_1.expect)(moduleType).to.eq("0x03");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var moduleType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0xff", "0xff", "0xffffffffffffffff", "0xffffffffffffffff", "0xffffff", "0xffffff", "0xffffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getModuleType()];
                    case 2:
                        moduleType = _a.sent();
                        (0, chai_1.expect)(moduleType).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setModuleType', function () {
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var moduleType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setModuleType("0x03");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        moduleType = (_a.sent()).moduleType;
                        (0, chai_1.expect)(moduleType).to.eq("0x03");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var moduleType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setModuleType("0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        moduleType = (_a.sent()).moduleType;
                        (0, chai_1.expect)(moduleType).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getLoanGasE4', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loanGasE4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0xff", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getLoanGasE4()];
                    case 2:
                        loanGasE4 = _a.sent();
                        (0, chai_1.expect)(loanGasE4).to.eq("0xff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loanGasE4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0x00", "0xff", "0xffffffffffffffff", "0xffffffffffffffff", "0xffffff", "0xffffff", "0xffffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getLoanGasE4()];
                    case 2:
                        loanGasE4 = _a.sent();
                        (0, chai_1.expect)(loanGasE4).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setLoanGasE4', function () {
        it('Reverts when loanGasE4 overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setLoanGasE4("0x01ff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loanGasE4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setLoanGasE4("0xff");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        loanGasE4 = (_a.sent()).loanGasE4;
                        (0, chai_1.expect)(loanGasE4).to.eq("0xff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loanGasE4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setLoanGasE4("0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        loanGasE4 = (_a.sent()).loanGasE4;
                        (0, chai_1.expect)(loanGasE4).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getRepayGasE4', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var repayGasE4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0x00", "0xff", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getRepayGasE4()];
                    case 2:
                        repayGasE4 = _a.sent();
                        (0, chai_1.expect)(repayGasE4).to.eq("0xff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var repayGasE4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0xff", "0x00", "0xffffffffffffffff", "0xffffffffffffffff", "0xffffff", "0xffffff", "0xffffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getRepayGasE4()];
                    case 2:
                        repayGasE4 = _a.sent();
                        (0, chai_1.expect)(repayGasE4).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setRepayGasE4', function () {
        it('Reverts when repayGasE4 overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setRepayGasE4("0x01ff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var repayGasE4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setRepayGasE4("0xff");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        repayGasE4 = (_a.sent()).repayGasE4;
                        (0, chai_1.expect)(repayGasE4).to.eq("0xff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var repayGasE4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setRepayGasE4("0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        repayGasE4 = (_a.sent()).repayGasE4;
                        (0, chai_1.expect)(repayGasE4).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getEthRefundForLoanGas', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ethRefundForLoanGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0x00", "0x00", "0xffffffffffffffff", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getEthRefundForLoanGas()];
                    case 2:
                        ethRefundForLoanGas = _a.sent();
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0xffffffffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ethRefundForLoanGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0xff", "0xff", "0x00", "0xffffffffffffffff", "0xffffff", "0xffffff", "0xffffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getEthRefundForLoanGas()];
                    case 2:
                        ethRefundForLoanGas = _a.sent();
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setEthRefundForLoanGas', function () {
        it('Reverts when ethRefundForLoanGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setEthRefundForLoanGas("0x01ffffffffffffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ethRefundForLoanGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setEthRefundForLoanGas("0xffffffffffffffff");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        ethRefundForLoanGas = (_a.sent()).ethRefundForLoanGas;
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0xffffffffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ethRefundForLoanGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setEthRefundForLoanGas("0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        ethRefundForLoanGas = (_a.sent()).ethRefundForLoanGas;
                        (0, chai_1.expect)(ethRefundForLoanGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getEthRefundForRepayGas', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ethRefundForRepayGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0x00", "0x00", "0x00", "0xffffffffffffffff", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getEthRefundForRepayGas()];
                    case 2:
                        ethRefundForRepayGas = _a.sent();
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0xffffffffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ethRefundForRepayGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0xff", "0xff", "0xffffffffffffffff", "0x00", "0xffffff", "0xffffff", "0xffffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getEthRefundForRepayGas()];
                    case 2:
                        ethRefundForRepayGas = _a.sent();
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setEthRefundForRepayGas', function () {
        it('Reverts when ethRefundForRepayGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setEthRefundForRepayGas("0x01ffffffffffffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ethRefundForRepayGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setEthRefundForRepayGas("0xffffffffffffffff");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        ethRefundForRepayGas = (_a.sent()).ethRefundForRepayGas;
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0xffffffffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var ethRefundForRepayGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setEthRefundForRepayGas("0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        ethRefundForRepayGas = (_a.sent()).ethRefundForRepayGas;
                        (0, chai_1.expect)(ethRefundForRepayGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getBtcFeeForLoanGas', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var btcFeeForLoanGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0xffffff", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getBtcFeeForLoanGas()];
                    case 2:
                        btcFeeForLoanGas = _a.sent();
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0xffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var btcFeeForLoanGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0xff", "0xff", "0xffffffffffffffff", "0xffffffffffffffff", "0x00", "0xffffff", "0xffffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getBtcFeeForLoanGas()];
                    case 2:
                        btcFeeForLoanGas = _a.sent();
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setBtcFeeForLoanGas', function () {
        it('Reverts when btcFeeForLoanGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setBtcFeeForLoanGas("0x01ffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var btcFeeForLoanGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setBtcFeeForLoanGas("0xffffff");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        btcFeeForLoanGas = (_a.sent()).btcFeeForLoanGas;
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0xffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var btcFeeForLoanGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setBtcFeeForLoanGas("0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        btcFeeForLoanGas = (_a.sent()).btcFeeForLoanGas;
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getBtcFeeForRepayGas', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var btcFeeForRepayGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0xffffff", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getBtcFeeForRepayGas()];
                    case 2:
                        btcFeeForRepayGas = _a.sent();
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0xffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var btcFeeForRepayGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0xff", "0xff", "0xffffffffffffffff", "0xffffffffffffffff", "0xffffff", "0x00", "0xffffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getBtcFeeForRepayGas()];
                    case 2:
                        btcFeeForRepayGas = _a.sent();
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setBtcFeeForRepayGas', function () {
        it('Reverts when btcFeeForRepayGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setBtcFeeForRepayGas("0x01ffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var btcFeeForRepayGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setBtcFeeForRepayGas("0xffffff");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        btcFeeForRepayGas = (_a.sent()).btcFeeForRepayGas;
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0xffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var btcFeeForRepayGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setBtcFeeForRepayGas("0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        btcFeeForRepayGas = (_a.sent()).btcFeeForRepayGas;
                        (0, chai_1.expect)(btcFeeForRepayGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getLastUpdateTimestamp', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var lastUpdateTimestamp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0xffffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getLastUpdateTimestamp()];
                    case 2:
                        lastUpdateTimestamp = _a.sent();
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0xffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var lastUpdateTimestamp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalModuleState.encode("0x03", "0xff", "0xff", "0xffffffffffffffff", "0xffffffffffffffff", "0xffffff", "0xffffff", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalModuleState.getLastUpdateTimestamp()];
                    case 2:
                        lastUpdateTimestamp = _a.sent();
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setLastUpdateTimestamp', function () {
        it('Reverts when lastUpdateTimestamp overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalModuleState.setLastUpdateTimestamp("0x01ffffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var lastUpdateTimestamp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setLastUpdateTimestamp("0xffffffff");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        lastUpdateTimestamp = (_a.sent()).lastUpdateTimestamp;
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0xffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var lastUpdateTimestamp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModuleState.setLastUpdateTimestamp("0x00");
                        return [4 /*yield*/, externalModuleState.decode()];
                    case 1:
                        lastUpdateTimestamp = (_a.sent()).lastUpdateTimestamp;
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
