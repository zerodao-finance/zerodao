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
describe('LoanRecordCoder.sol', function () {
    var externalLoanRecord;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        var Factory;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory('ExternalLoanRecordCoder')];
                case 1:
                    Factory = _a.sent();
                    return [4 /*yield*/, Factory.deploy()];
                case 2:
                    externalLoanRecord = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('decode', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, sharesLocked, actualBorrowAmount, lenderDebt, btcFeeForLoanGas, expiry;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalLoanRecord.encode("0xffffffffffff", "0x00", "0xffffffffffff", "0x00", "0xffffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalLoanRecord.decode()];
                    case 2:
                        _a = _b.sent(), sharesLocked = _a.sharesLocked, actualBorrowAmount = _a.actualBorrowAmount, lenderDebt = _a.lenderDebt, btcFeeForLoanGas = _a.btcFeeForLoanGas, expiry = _a.expiry;
                        (0, chai_1.expect)(sharesLocked).to.eq("0xffffffffffff");
                        (0, chai_1.expect)(actualBorrowAmount).to.eq("0x00");
                        (0, chai_1.expect)(lenderDebt).to.eq("0xffffffffffff");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0x00");
                        (0, chai_1.expect)(expiry).to.eq("0xffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, sharesLocked, actualBorrowAmount, lenderDebt, btcFeeForLoanGas, expiry;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalLoanRecord.encode("0x00", "0xffffffffffff", "0x00", "0xffffffffffff", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalLoanRecord.decode()];
                    case 2:
                        _a = _b.sent(), sharesLocked = _a.sharesLocked, actualBorrowAmount = _a.actualBorrowAmount, lenderDebt = _a.lenderDebt, btcFeeForLoanGas = _a.btcFeeForLoanGas, expiry = _a.expiry;
                        (0, chai_1.expect)(sharesLocked).to.eq("0x00");
                        (0, chai_1.expect)(actualBorrowAmount).to.eq("0xffffffffffff");
                        (0, chai_1.expect)(lenderDebt).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0xffffffffffff");
                        (0, chai_1.expect)(expiry).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('encode', function () {
        it('Reverts when sharesLocked overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalLoanRecord.encode("0x01ffffffffffff", "0x00", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when actualBorrowAmount overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalLoanRecord.encode("0x00", "0x01ffffffffffff", "0x00", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when lenderDebt overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalLoanRecord.encode("0x00", "0x00", "0x01ffffffffffff", "0x00", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when btcFeeForLoanGas overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalLoanRecord.encode("0x00", "0x00", "0x00", "0x01ffffffffffff", "0x00")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Reverts when expiry overflows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(externalLoanRecord.encode("0x00", "0x00", "0x00", "0x00", "0x01ffffffff")).to.be.revertedWith("0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, sharesLocked, actualBorrowAmount, lenderDebt, btcFeeForLoanGas, expiry;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalLoanRecord.encode("0xffffffffffff", "0x00", "0xffffffffffff", "0x00", "0xffffffff");
                        return [4 /*yield*/, externalLoanRecord.decode()];
                    case 1:
                        _a = _b.sent(), sharesLocked = _a.sharesLocked, actualBorrowAmount = _a.actualBorrowAmount, lenderDebt = _a.lenderDebt, btcFeeForLoanGas = _a.btcFeeForLoanGas, expiry = _a.expiry;
                        (0, chai_1.expect)(sharesLocked).to.eq("0xffffffffffff");
                        (0, chai_1.expect)(actualBorrowAmount).to.eq("0x00");
                        (0, chai_1.expect)(lenderDebt).to.eq("0xffffffffffff");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0x00");
                        (0, chai_1.expect)(expiry).to.eq("0xffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to set max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, sharesLocked, actualBorrowAmount, lenderDebt, btcFeeForLoanGas, expiry;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        externalLoanRecord.encode("0x00", "0xffffffffffff", "0x00", "0xffffffffffff", "0x00");
                        return [4 /*yield*/, externalLoanRecord.decode()];
                    case 1:
                        _a = _b.sent(), sharesLocked = _a.sharesLocked, actualBorrowAmount = _a.actualBorrowAmount, lenderDebt = _a.lenderDebt, btcFeeForLoanGas = _a.btcFeeForLoanGas, expiry = _a.expiry;
                        (0, chai_1.expect)(sharesLocked).to.eq("0x00");
                        (0, chai_1.expect)(actualBorrowAmount).to.eq("0xffffffffffff");
                        (0, chai_1.expect)(lenderDebt).to.eq("0x00");
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0xffffffffffff");
                        (0, chai_1.expect)(expiry).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getSharesAndDebt', function () {
        it('Should be able to get min/max values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, sharesLocked, lenderDebt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalLoanRecord.encode("0xffffffffffff", "0x00", "0x00", "0x00", "0x00")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalLoanRecord.getSharesAndDebt()];
                    case 2:
                        _a = _b.sent(), sharesLocked = _a.sharesLocked, lenderDebt = _a.lenderDebt;
                        (0, chai_1.expect)(sharesLocked).to.eq("0xffffffffffff");
                        (0, chai_1.expect)(lenderDebt).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max/min values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, sharesLocked, lenderDebt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, externalLoanRecord.encode("0x00", "0xffffffffffff", "0xffffffffffff", "0xffffffffffff", "0xffffffff")];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, externalLoanRecord.getSharesAndDebt()];
                    case 2:
                        _a = _b.sent(), sharesLocked = _a.sharesLocked, lenderDebt = _a.lenderDebt;
                        (0, chai_1.expect)(sharesLocked).to.eq("0x00");
                        (0, chai_1.expect)(lenderDebt).to.eq("0xffffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getActualBorrowAmount', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var actualBorrowAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalLoanRecord.encode("0x00", "0xffffffffffff", "0x00", "0x00", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalLoanRecord.getActualBorrowAmount()];
                    case 2:
                        actualBorrowAmount = _a.sent();
                        (0, chai_1.expect)(actualBorrowAmount).to.eq("0xffffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var actualBorrowAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalLoanRecord.encode("0xffffffffffff", "0x00", "0xffffffffffff", "0xffffffffffff", "0xffffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalLoanRecord.getActualBorrowAmount()];
                    case 2:
                        actualBorrowAmount = _a.sent();
                        (0, chai_1.expect)(actualBorrowAmount).to.eq("0x00");
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
                    case 0: return [4 /*yield*/, externalLoanRecord.encode("0x00", "0x00", "0x00", "0xffffffffffff", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalLoanRecord.getBtcFeeForLoanGas()];
                    case 2:
                        btcFeeForLoanGas = _a.sent();
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0xffffffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var btcFeeForLoanGas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalLoanRecord.encode("0xffffffffffff", "0xffffffffffff", "0xffffffffffff", "0x00", "0xffffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalLoanRecord.getBtcFeeForLoanGas()];
                    case 2:
                        btcFeeForLoanGas = _a.sent();
                        (0, chai_1.expect)(btcFeeForLoanGas).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getExpiry', function () {
        it('Should be able to get min value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expiry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalLoanRecord.encode("0x00", "0x00", "0x00", "0x00", "0xffffffff")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalLoanRecord.getExpiry()];
                    case 2:
                        expiry = _a.sent();
                        (0, chai_1.expect)(expiry).to.eq("0xffffffff");
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to get max value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expiry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, externalLoanRecord.encode("0xffffffffffff", "0xffffffffffff", "0xffffffffffff", "0xffffffffffff", "0x00")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, externalLoanRecord.getExpiry()];
                    case 2:
                        expiry = _a.sent();
                        (0, chai_1.expect)(expiry).to.eq("0x00");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
