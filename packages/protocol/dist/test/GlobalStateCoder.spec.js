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
describe('GlobalStateCoder.sol', function () {
    var externalGlobalState;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        var Factory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('ExternalGlobalStateCoder')];
                case 1:
                    Factory = _a.sent();
                    return [4 /*yield*/, Factory.deploy()];
                case 2:
                    externalGlobalState = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('decode', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, zeroBorrowFeeBips, renBorrowFeeBips, zeroFeeShareBips, zeroBorrowFeeStatic, renBorrowFeeStatic, satoshiPerEth, gweiPerGas, lastUpdateTimestamp, totalBitcoinBorrowed, unburnedGasReserveShares, unburnedZeroFeeShares;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x00", "0x1fff", "0x00", "0x7fffff", "0x00", "0xffff", "0x00", "0xffffffffff", "0x00", "0x0fffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 2:
                        _a = _b.sent(), zeroBorrowFeeBips = _a.zeroBorrowFeeBips, renBorrowFeeBips = _a.renBorrowFeeBips, zeroFeeShareBips = _a.zeroFeeShareBips, zeroBorrowFeeStatic = _a.zeroBorrowFeeStatic, renBorrowFeeStatic = _a.renBorrowFeeStatic, satoshiPerEth = _a.satoshiPerEth, gweiPerGas = _a.gweiPerGas, lastUpdateTimestamp = _a.lastUpdateTimestamp, totalBitcoinBorrowed = _a.totalBitcoinBorrowed, unburnedGasReserveShares = _a.unburnedGasReserveShares, unburnedZeroFeeShares = _a.unburnedZeroFeeShares;
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x07ff");
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x00");
                        (0, chai_1.expect)(zeroFeeShareBips).to.eq("0x1fff");
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x00");
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x7fffff");
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x00");
                        (0, chai_1.expect)(gweiPerGas).to.eq("0xffff");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0x00");
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0xffffffffff");
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x00");
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x0fffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, zeroBorrowFeeBips, renBorrowFeeBips, zeroFeeShareBips, zeroBorrowFeeStatic, renBorrowFeeStatic, satoshiPerEth, gweiPerGas, lastUpdateTimestamp, totalBitcoinBorrowed, unburnedGasReserveShares, unburnedZeroFeeShares;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x07ff", "0x00", "0x7fffff", "0x00", "0x3fffffff", "0x00", "0xffffffff", "0x00", "0x0fffffff", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 2:
                        _a = _b.sent(), zeroBorrowFeeBips = _a.zeroBorrowFeeBips, renBorrowFeeBips = _a.renBorrowFeeBips, zeroFeeShareBips = _a.zeroFeeShareBips, zeroBorrowFeeStatic = _a.zeroBorrowFeeStatic, renBorrowFeeStatic = _a.renBorrowFeeStatic, satoshiPerEth = _a.satoshiPerEth, gweiPerGas = _a.gweiPerGas, lastUpdateTimestamp = _a.lastUpdateTimestamp, totalBitcoinBorrowed = _a.totalBitcoinBorrowed, unburnedGasReserveShares = _a.unburnedGasReserveShares, unburnedZeroFeeShares = _a.unburnedZeroFeeShares;
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x00");
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x07ff");
                        (0, chai_1.expect)(zeroFeeShareBips).to.eq("0x00");
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x7fffff");
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x00");
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x3fffffff");
                        (0, chai_1.expect)(gweiPerGas).to.eq("0x00");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0xffffffff");
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0x00");
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x0fffffff");
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('encode', function () {
        it('Reverts when zeroBorrowFeeStatic overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.encode("0x00", "0x00", "0x00", "0xffffff", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when renBorrowFeeStatic overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0xffffff", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when satoshiPerEth overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x7fffffff", "0x00", "0x00", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when gweiPerGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x01ffff", "0x00", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when lastUpdateTimestamp overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x01ffffffff", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when totalBitcoinBorrowed overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x01ffffffffff", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when unburnedGasReserveShares overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x1fffffff", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when unburnedZeroFeeShares overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x1fffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, zeroBorrowFeeBips, renBorrowFeeBips, zeroFeeShareBips, zeroBorrowFeeStatic, renBorrowFeeStatic, satoshiPerEth, gweiPerGas, lastUpdateTimestamp, totalBitcoinBorrowed, unburnedGasReserveShares, unburnedZeroFeeShares;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalGlobalState.encode("0x07ff", "0x00", "0x1fff", "0x00", "0x7fffff", "0x00", "0xffff", "0x00", "0xffffffffff", "0x00", "0x0fffffff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        _a = _b.sent(), zeroBorrowFeeBips = _a.zeroBorrowFeeBips, renBorrowFeeBips = _a.renBorrowFeeBips, zeroFeeShareBips = _a.zeroFeeShareBips, zeroBorrowFeeStatic = _a.zeroBorrowFeeStatic, renBorrowFeeStatic = _a.renBorrowFeeStatic, satoshiPerEth = _a.satoshiPerEth, gweiPerGas = _a.gweiPerGas, lastUpdateTimestamp = _a.lastUpdateTimestamp, totalBitcoinBorrowed = _a.totalBitcoinBorrowed, unburnedGasReserveShares = _a.unburnedGasReserveShares, unburnedZeroFeeShares = _a.unburnedZeroFeeShares;
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x07ff");
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x00");
                        (0, chai_1.expect)(zeroFeeShareBips).to.eq("0x1fff");
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x00");
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x7fffff");
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x00");
                        (0, chai_1.expect)(gweiPerGas).to.eq("0xffff");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0x00");
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0xffffffffff");
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x00");
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x0fffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, zeroBorrowFeeBips, renBorrowFeeBips, zeroFeeShareBips, zeroBorrowFeeStatic, renBorrowFeeStatic, satoshiPerEth, gweiPerGas, lastUpdateTimestamp, totalBitcoinBorrowed, unburnedGasReserveShares, unburnedZeroFeeShares;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalGlobalState.encode("0x00", "0x07ff", "0x00", "0x7fffff", "0x00", "0x3fffffff", "0x00", "0xffffffff", "0x00", "0x0fffffff", "0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        _a = _b.sent(), zeroBorrowFeeBips = _a.zeroBorrowFeeBips, renBorrowFeeBips = _a.renBorrowFeeBips, zeroFeeShareBips = _a.zeroFeeShareBips, zeroBorrowFeeStatic = _a.zeroBorrowFeeStatic, renBorrowFeeStatic = _a.renBorrowFeeStatic, satoshiPerEth = _a.satoshiPerEth, gweiPerGas = _a.gweiPerGas, lastUpdateTimestamp = _a.lastUpdateTimestamp, totalBitcoinBorrowed = _a.totalBitcoinBorrowed, unburnedGasReserveShares = _a.unburnedGasReserveShares, unburnedZeroFeeShares = _a.unburnedZeroFeeShares;
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x00");
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x07ff");
                        (0, chai_1.expect)(zeroFeeShareBips).to.eq("0x00");
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x7fffff");
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x00");
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x3fffffff");
                        (0, chai_1.expect)(gweiPerGas).to.eq("0x00");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0xffffffff");
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0x00");
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x0fffffff");
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setLoanInfo', function () {
        it('Reverts when totalBitcoinBorrowed overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setLoanInfo("0x01ffffffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var totalBitcoinBorrowed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setLoanInfo("0xffffffffff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        totalBitcoinBorrowed = (_a.sent()).totalBitcoinBorrowed;
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0xffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var totalBitcoinBorrowed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setLoanInfo("0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        totalBitcoinBorrowed = (_a.sent()).totalBitcoinBorrowed;
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getLoanInfo', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var totalBitcoinBorrowed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0xffffffffff", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getLoanInfo()];
                    case 2:
                        totalBitcoinBorrowed = _a.sent();
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0xffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var totalBitcoinBorrowed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x1fff", "0x7fffff", "0x7fffff", "0x3fffffff", "0xffff", "0xffffffff", "0x00", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getLoanInfo()];
                    case 2:
                        totalBitcoinBorrowed = _a.sent();
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setFees', function () {
        it('Reverts when zeroBorrowFeeStatic overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setFees("0x00", "0x00", "0xffffff", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when renBorrowFeeStatic overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setFees("0x00", "0x00", "0x00", "0xffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, zeroBorrowFeeBips, renBorrowFeeBips, zeroBorrowFeeStatic, renBorrowFeeStatic;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalGlobalState.setFees("0x07ff", "0x00", "0x7fffff", "0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        _a = _b.sent(), zeroBorrowFeeBips = _a.zeroBorrowFeeBips, renBorrowFeeBips = _a.renBorrowFeeBips, zeroBorrowFeeStatic = _a.zeroBorrowFeeStatic, renBorrowFeeStatic = _a.renBorrowFeeStatic;
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x07ff");
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x00");
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x7fffff");
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, zeroBorrowFeeBips, renBorrowFeeBips, zeroBorrowFeeStatic, renBorrowFeeStatic;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalGlobalState.setFees("0x00", "0x07ff", "0x00", "0x7fffff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        _a = _b.sent(), zeroBorrowFeeBips = _a.zeroBorrowFeeBips, renBorrowFeeBips = _a.renBorrowFeeBips, zeroBorrowFeeStatic = _a.zeroBorrowFeeStatic, renBorrowFeeStatic = _a.renBorrowFeeStatic;
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x00");
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x07ff");
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x00");
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x7fffff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getFees', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, zeroBorrowFeeBips, renBorrowFeeBips, zeroBorrowFeeStatic, renBorrowFeeStatic;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x00", "0x00", "0x7fffff", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalGlobalState.getFees()];
                    case 2:
                        _a = _b.sent(), zeroBorrowFeeBips = _a.zeroBorrowFeeBips, renBorrowFeeBips = _a.renBorrowFeeBips, zeroBorrowFeeStatic = _a.zeroBorrowFeeStatic, renBorrowFeeStatic = _a.renBorrowFeeStatic;
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x07ff");
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x00");
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x7fffff");
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, zeroBorrowFeeBips, renBorrowFeeBips, zeroBorrowFeeStatic, renBorrowFeeStatic;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x07ff", "0x1fff", "0x00", "0x7fffff", "0x3fffffff", "0xffff", "0xffffffff", "0xffffffffff", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalGlobalState.getFees()];
                    case 2:
                        _a = _b.sent(), zeroBorrowFeeBips = _a.zeroBorrowFeeBips, renBorrowFeeBips = _a.renBorrowFeeBips, zeroBorrowFeeStatic = _a.zeroBorrowFeeStatic, renBorrowFeeStatic = _a.renBorrowFeeStatic;
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x00");
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x07ff");
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x00");
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x7fffff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setCached', function () {
        it('Reverts when satoshiPerEth overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setCached("0x7fffffff", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when gweiPerGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setCached("0x00", "0x01ffff", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when lastUpdateTimestamp overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setCached("0x00", "0x00", "0x01ffffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, satoshiPerEth, gweiPerGas, lastUpdateTimestamp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalGlobalState.setCached("0x3fffffff", "0x00", "0xffffffff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        _a = _b.sent(), satoshiPerEth = _a.satoshiPerEth, gweiPerGas = _a.gweiPerGas, lastUpdateTimestamp = _a.lastUpdateTimestamp;
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x3fffffff");
                        (0, chai_1.expect)(gweiPerGas).to.eq("0x00");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0xffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, satoshiPerEth, gweiPerGas, lastUpdateTimestamp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalGlobalState.setCached("0x00", "0xffff", "0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        _a = _b.sent(), satoshiPerEth = _a.satoshiPerEth, gweiPerGas = _a.gweiPerGas, lastUpdateTimestamp = _a.lastUpdateTimestamp;
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x00");
                        (0, chai_1.expect)(gweiPerGas).to.eq("0xffff");
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setParamsForModuleFees', function () {
        it('Reverts when satoshiPerEth overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setParamsForModuleFees("0x7fffffff", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when gweiPerGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setParamsForModuleFees("0x00", "0x01ffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, satoshiPerEth, gweiPerGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalGlobalState.setParamsForModuleFees("0x3fffffff", "0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        _a = _b.sent(), satoshiPerEth = _a.satoshiPerEth, gweiPerGas = _a.gweiPerGas;
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x3fffffff");
                        (0, chai_1.expect)(gweiPerGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, satoshiPerEth, gweiPerGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalGlobalState.setParamsForModuleFees("0x00", "0xffff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        _a = _b.sent(), satoshiPerEth = _a.satoshiPerEth, gweiPerGas = _a.gweiPerGas;
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x00");
                        (0, chai_1.expect)(gweiPerGas).to.eq("0xffff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getParamsForModuleFees', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, satoshiPerEth, gweiPerGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x3fffffff", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalGlobalState.getParamsForModuleFees()];
                    case 2:
                        _a = _b.sent(), satoshiPerEth = _a.satoshiPerEth, gweiPerGas = _a.gweiPerGas;
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x3fffffff");
                        (0, chai_1.expect)(gweiPerGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, satoshiPerEth, gweiPerGas;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x1fff", "0x7fffff", "0x7fffff", "0x00", "0xffff", "0xffffffff", "0xffffffffff", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalGlobalState.getParamsForModuleFees()];
                    case 2:
                        _a = _b.sent(), satoshiPerEth = _a.satoshiPerEth, gweiPerGas = _a.gweiPerGas;
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x00");
                        (0, chai_1.expect)(gweiPerGas).to.eq("0xffff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setUnburnedShares', function () {
        it('Reverts when unburnedGasReserveShares overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setUnburnedShares("0x1fffffff", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when unburnedZeroFeeShares overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setUnburnedShares("0x00", "0x1fffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, unburnedGasReserveShares, unburnedZeroFeeShares;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalGlobalState.setUnburnedShares("0x0fffffff", "0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        _a = _b.sent(), unburnedGasReserveShares = _a.unburnedGasReserveShares, unburnedZeroFeeShares = _a.unburnedZeroFeeShares;
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x0fffffff");
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, unburnedGasReserveShares, unburnedZeroFeeShares;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalGlobalState.setUnburnedShares("0x00", "0x0fffffff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        _a = _b.sent(), unburnedGasReserveShares = _a.unburnedGasReserveShares, unburnedZeroFeeShares = _a.unburnedZeroFeeShares;
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x00");
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x0fffffff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUnburnedShares', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, unburnedGasReserveShares, unburnedZeroFeeShares;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x0fffffff", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalGlobalState.getUnburnedShares()];
                    case 2:
                        _a = _b.sent(), unburnedGasReserveShares = _a.unburnedGasReserveShares, unburnedZeroFeeShares = _a.unburnedZeroFeeShares;
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x0fffffff");
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, unburnedGasReserveShares, unburnedZeroFeeShares;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x1fff", "0x7fffff", "0x7fffff", "0x3fffffff", "0xffff", "0xffffffff", "0xffffffffff", "0x00", "0x0fffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalGlobalState.getUnburnedShares()];
                    case 2:
                        _a = _b.sent(), unburnedGasReserveShares = _a.unburnedGasReserveShares, unburnedZeroFeeShares = _a.unburnedZeroFeeShares;
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x00");
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x0fffffff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getZeroBorrowFeeBips', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroBorrowFeeBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getZeroBorrowFeeBips()];
                    case 2:
                        zeroBorrowFeeBips = _a.sent();
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x07ff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroBorrowFeeBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x07ff", "0x1fff", "0x7fffff", "0x7fffff", "0x3fffffff", "0xffff", "0xffffffff", "0xffffffffff", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getZeroBorrowFeeBips()];
                    case 2:
                        zeroBorrowFeeBips = _a.sent();
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setZeroBorrowFeeBips', function () {
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroBorrowFeeBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setZeroBorrowFeeBips("0x07ff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        zeroBorrowFeeBips = (_a.sent()).zeroBorrowFeeBips;
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x07ff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroBorrowFeeBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setZeroBorrowFeeBips("0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        zeroBorrowFeeBips = (_a.sent()).zeroBorrowFeeBips;
                        (0, chai_1.expect)(zeroBorrowFeeBips).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getRenBorrowFeeBips', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renBorrowFeeBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x07ff", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getRenBorrowFeeBips()];
                    case 2:
                        renBorrowFeeBips = _a.sent();
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x07ff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renBorrowFeeBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x00", "0x1fff", "0x7fffff", "0x7fffff", "0x3fffffff", "0xffff", "0xffffffff", "0xffffffffff", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getRenBorrowFeeBips()];
                    case 2:
                        renBorrowFeeBips = _a.sent();
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setRenBorrowFeeBips', function () {
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renBorrowFeeBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setRenBorrowFeeBips("0x07ff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        renBorrowFeeBips = (_a.sent()).renBorrowFeeBips;
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x07ff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renBorrowFeeBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setRenBorrowFeeBips("0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        renBorrowFeeBips = (_a.sent()).renBorrowFeeBips;
                        (0, chai_1.expect)(renBorrowFeeBips).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getZeroFeeShareBips', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroFeeShareBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x1fff", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getZeroFeeShareBips()];
                    case 2:
                        zeroFeeShareBips = _a.sent();
                        (0, chai_1.expect)(zeroFeeShareBips).to.eq("0x1fff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroFeeShareBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x00", "0x7fffff", "0x7fffff", "0x3fffffff", "0xffff", "0xffffffff", "0xffffffffff", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getZeroFeeShareBips()];
                    case 2:
                        zeroFeeShareBips = _a.sent();
                        (0, chai_1.expect)(zeroFeeShareBips).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setZeroFeeShareBips', function () {
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroFeeShareBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setZeroFeeShareBips("0x1fff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        zeroFeeShareBips = (_a.sent()).zeroFeeShareBips;
                        (0, chai_1.expect)(zeroFeeShareBips).to.eq("0x1fff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroFeeShareBips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setZeroFeeShareBips("0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        zeroFeeShareBips = (_a.sent()).zeroFeeShareBips;
                        (0, chai_1.expect)(zeroFeeShareBips).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getZeroBorrowFeeStatic', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroBorrowFeeStatic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x00", "0x7fffff", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getZeroBorrowFeeStatic()];
                    case 2:
                        zeroBorrowFeeStatic = _a.sent();
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x7fffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroBorrowFeeStatic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x1fff", "0x00", "0x7fffff", "0x3fffffff", "0xffff", "0xffffffff", "0xffffffffff", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getZeroBorrowFeeStatic()];
                    case 2:
                        zeroBorrowFeeStatic = _a.sent();
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setZeroBorrowFeeStatic', function () {
        it('Reverts when zeroBorrowFeeStatic overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setZeroBorrowFeeStatic("0xffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroBorrowFeeStatic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setZeroBorrowFeeStatic("0x7fffff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        zeroBorrowFeeStatic = (_a.sent()).zeroBorrowFeeStatic;
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x7fffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var zeroBorrowFeeStatic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setZeroBorrowFeeStatic("0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        zeroBorrowFeeStatic = (_a.sent()).zeroBorrowFeeStatic;
                        (0, chai_1.expect)(zeroBorrowFeeStatic).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getRenBorrowFeeStatic', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renBorrowFeeStatic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x7fffff", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getRenBorrowFeeStatic()];
                    case 2:
                        renBorrowFeeStatic = _a.sent();
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x7fffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renBorrowFeeStatic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x1fff", "0x7fffff", "0x00", "0x3fffffff", "0xffff", "0xffffffff", "0xffffffffff", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getRenBorrowFeeStatic()];
                    case 2:
                        renBorrowFeeStatic = _a.sent();
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setRenBorrowFeeStatic', function () {
        it('Reverts when renBorrowFeeStatic overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setRenBorrowFeeStatic("0xffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renBorrowFeeStatic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setRenBorrowFeeStatic("0x7fffff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        renBorrowFeeStatic = (_a.sent()).renBorrowFeeStatic;
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x7fffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renBorrowFeeStatic;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setRenBorrowFeeStatic("0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        renBorrowFeeStatic = (_a.sent()).renBorrowFeeStatic;
                        (0, chai_1.expect)(renBorrowFeeStatic).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getSatoshiPerEth', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var satoshiPerEth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x3fffffff", "0x00", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getSatoshiPerEth()];
                    case 2:
                        satoshiPerEth = _a.sent();
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x3fffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var satoshiPerEth;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x1fff", "0x7fffff", "0x7fffff", "0x00", "0xffff", "0xffffffff", "0xffffffffff", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getSatoshiPerEth()];
                    case 2:
                        satoshiPerEth = _a.sent();
                        (0, chai_1.expect)(satoshiPerEth).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getGweiPerGas', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var gweiPerGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0xffff", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getGweiPerGas()];
                    case 2:
                        gweiPerGas = _a.sent();
                        (0, chai_1.expect)(gweiPerGas).to.eq("0xffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var gweiPerGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x1fff", "0x7fffff", "0x7fffff", "0x3fffffff", "0x00", "0xffffffff", "0xffffffffff", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getGweiPerGas()];
                    case 2:
                        gweiPerGas = _a.sent();
                        (0, chai_1.expect)(gweiPerGas).to.eq("0x00");
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
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0xffffffff", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getLastUpdateTimestamp()];
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
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x1fff", "0x7fffff", "0x7fffff", "0x3fffffff", "0xffff", "0x00", "0xffffffffff", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getLastUpdateTimestamp()];
                    case 2:
                        lastUpdateTimestamp = _a.sent();
                        (0, chai_1.expect)(lastUpdateTimestamp).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTotalBitcoinBorrowed', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var totalBitcoinBorrowed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0xffffffffff", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getTotalBitcoinBorrowed()];
                    case 2:
                        totalBitcoinBorrowed = _a.sent();
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0xffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var totalBitcoinBorrowed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x1fff", "0x7fffff", "0x7fffff", "0x3fffffff", "0xffff", "0xffffffff", "0x00", "0x0fffffff", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getTotalBitcoinBorrowed()];
                    case 2:
                        totalBitcoinBorrowed = _a.sent();
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setTotalBitcoinBorrowed', function () {
        it('Reverts when totalBitcoinBorrowed overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setTotalBitcoinBorrowed("0x01ffffffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var totalBitcoinBorrowed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setTotalBitcoinBorrowed("0xffffffffff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        totalBitcoinBorrowed = (_a.sent()).totalBitcoinBorrowed;
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0xffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var totalBitcoinBorrowed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setTotalBitcoinBorrowed("0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        totalBitcoinBorrowed = (_a.sent()).totalBitcoinBorrowed;
                        (0, chai_1.expect)(totalBitcoinBorrowed).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUnburnedGasReserveShares', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var unburnedGasReserveShares;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x0fffffff", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getUnburnedGasReserveShares()];
                    case 2:
                        unburnedGasReserveShares = _a.sent();
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x0fffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var unburnedGasReserveShares;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x1fff", "0x7fffff", "0x7fffff", "0x3fffffff", "0xffff", "0xffffffff", "0xffffffffff", "0x00", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getUnburnedGasReserveShares()];
                    case 2:
                        unburnedGasReserveShares = _a.sent();
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setUnburnedGasReserveShares', function () {
        it('Reverts when unburnedGasReserveShares overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setUnburnedGasReserveShares("0x1fffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var unburnedGasReserveShares;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setUnburnedGasReserveShares("0x0fffffff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        unburnedGasReserveShares = (_a.sent()).unburnedGasReserveShares;
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x0fffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var unburnedGasReserveShares;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setUnburnedGasReserveShares("0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        unburnedGasReserveShares = (_a.sent()).unburnedGasReserveShares;
                        (0, chai_1.expect)(unburnedGasReserveShares).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUnburnedZeroFeeShares', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var unburnedZeroFeeShares;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x00", "0x0fffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getUnburnedZeroFeeShares()];
                    case 2:
                        unburnedZeroFeeShares = _a.sent();
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x0fffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var unburnedZeroFeeShares;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalGlobalState.encode("0x07ff", "0x07ff", "0x1fff", "0x7fffff", "0x7fffff", "0x3fffffff", "0xffff", "0xffffffff", "0xffffffffff", "0x0fffffff", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalGlobalState.getUnburnedZeroFeeShares()];
                    case 2:
                        unburnedZeroFeeShares = _a.sent();
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('setUnburnedZeroFeeShares', function () {
        it('Reverts when unburnedZeroFeeShares overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalGlobalState.setUnburnedZeroFeeShares("0x1fffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var unburnedZeroFeeShares;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setUnburnedZeroFeeShares("0x0fffffff");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        unburnedZeroFeeShares = (_a.sent()).unburnedZeroFeeShares;
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x0fffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var unburnedZeroFeeShares;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalGlobalState.setUnburnedZeroFeeShares("0x00");
                        return [4 /*yield*/, externalGlobalState.decode()];
                    case 1:
                        unburnedZeroFeeShares = (_a.sent()).unburnedZeroFeeShares;
                        (0, chai_1.expect)(unburnedZeroFeeShares).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
