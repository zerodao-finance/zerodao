"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.calculateBorrowFee = exports.getExpectedModuleFees = exports.getExpectedGlobalFees = exports.makeArrayObject = exports.divE4RoundUp = void 0;
require("ethers");
var bn_1 = require("./bn");
var chain_1 = require("./chain");
var ModuleType;
(function (ModuleType) {
    ModuleType[ModuleType["Null"] = 0] = "Null";
    ModuleType[ModuleType["LoanOverride"] = 1] = "LoanOverride";
    ModuleType[ModuleType["LoanAndRepayOverride"] = 2] = "LoanAndRepayOverride";
})(ModuleType || (ModuleType = {}));
var divE4RoundUp = function (n) { return (0, bn_1.toBN)(n).add(9999).div(1e4); };
exports.divE4RoundUp = divE4RoundUp;
var makeArrayObject = function (obj) {
    var values = Object.values(obj);
    return Object.keys(obj).reduce(function (obj, key, i) {
        var _a;
        return (__assign(__assign({}, obj), (_a = {}, _a[key] = values[i], _a[i] = values[i], _a)));
    }, {});
};
exports.makeArrayObject = makeArrayObject;
var getExpectedGlobalFees = function (dynamicBorrowFeeBips, staticBorrowFee, weiPerBitcoin, gasPrice, updateTx) { return __awaiter(void 0, void 0, void 0, function () {
    var lastUpdateTimestamp, _a, gweiPerGas, satoshiPerEth;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = bn_1.toBN;
                return [4 /*yield*/, (0, chain_1.getTransactionTimestamp)(updateTx)];
            case 1:
                lastUpdateTimestamp = _a.apply(void 0, [_b.sent()]);
                gweiPerGas = (0, bn_1.toBN)(gasPrice).div(bn_1.GWEI);
                satoshiPerEth = bn_1.ONE_BTC_PER_WEI.div(weiPerBitcoin);
                return [2 /*return*/, {
                        dynamicBorrowFeeBips: (0, bn_1.toBN)(dynamicBorrowFeeBips),
                        staticBorrowFee: (0, bn_1.toBN)(staticBorrowFee),
                        satoshiPerEth: satoshiPerEth,
                        gweiPerGas: gweiPerGas,
                        lastUpdateTimestamp: lastUpdateTimestamp
                    }];
        }
    });
}); };
exports.getExpectedGlobalFees = getExpectedGlobalFees;
var getExpectedModuleFees = function (globalFees, moduleType, _loanGas, _repayGas, updateTx) { return __awaiter(void 0, void 0, void 0, function () {
    var loanGasE4, repayGasE4, gweiPerGas, satoshiPerEth, gasPriceE4, loanRefundEth, repayRefundEth, staticBorrowFee, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                loanGasE4 = (0, exports.divE4RoundUp)(_loanGas);
                repayGasE4 = (0, exports.divE4RoundUp)(_repayGas);
                gweiPerGas = globalFees.gweiPerGas, satoshiPerEth = globalFees.satoshiPerEth;
                gasPriceE4 = (0, bn_1.toBN)(gweiPerGas, 13);
                loanRefundEth = loanGasE4.mul(gasPriceE4);
                repayRefundEth = repayGasE4.mul(gasPriceE4);
                staticBorrowFee = satoshiPerEth
                    .mul(loanRefundEth.add(repayRefundEth))
                    .div(bn_1.ONE_E18);
                _b = {
                    moduleType: moduleType,
                    loanGasE4: loanGasE4,
                    repayGasE4: repayGasE4,
                    loanRefundEth: loanRefundEth,
                    repayRefundEth: repayRefundEth,
                    staticBorrowFee: globalFees.staticBorrowFee.add(staticBorrowFee)
                };
                _a = bn_1.toBN;
                return [4 /*yield*/, (0, chain_1.getTransactionTimestamp)(updateTx)];
            case 1: return [2 /*return*/, (_b.lastUpdateTimestamp = _a.apply(void 0, [_c.sent()]),
                    _b)];
        }
    });
}); };
exports.getExpectedModuleFees = getExpectedModuleFees;
var calculateBorrowFee = function (globalFees, moduleFees, borrowAmount) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, moduleFees.staticBorrowFee.add(borrowAmount.mul(globalFees.dynamicBorrowFeeBips).div(10000))];
    });
}); };
exports.calculateBorrowFee = calculateBorrowFee;
