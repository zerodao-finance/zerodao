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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var chai_1 = require("chai");
var ethers_1 = require("ethers");
var utils_1 = require("ethers/lib/utils");
var hardhat_1 = require("hardhat");
require("keccak256");
require("lodash");
require("../typechain-types");
var assertions_1 = require("./shared/assertions");
var bn_1 = require("./shared/bn");
var chain_1 = require("./shared/chain");
var contracts_1 = require("./shared/contracts");
var eip712_1 = require("./shared/eip712");
var fees_1 = require("./shared/fees");
var time_1 = require("./shared/time");
var feesTimeToLive = 3600;
var DefaultDynamicBorrowFeeBips = 100;
var DefaultStaticBorrowFee = 1e5;
var DefaultWeiPerBitcoin = (0, bn_1.toBN)(2, 19);
var DefaultGasPrice = (0, bn_1.gwei)(10);
var omitNumericProperties = function (obj) {
    return Object.fromEntries(Object.entries(obj).filter(function (_a) {
        var key = _a[0];
        return !key.match(/^\d+$/);
    }));
};
var DefaultLoanGas = 200000;
var DefaultRepayGas = 300000;
describe("BtcVault", function () {
    var _a = hardhat_1.waffle.provider.getWallets(), lender = _a[0], borrower = _a[1];
    var vault;
    var wbtc;
    var registry;
    var btcEthPriceOracle;
    var gasPriceOracle;
    var eip712;
    var reset;
    var globalFees;
    var moduleFees;
    var module;
    var dynamicBorrowFeeBips = DefaultDynamicBorrowFeeBips;
    var staticBorrowFee = DefaultStaticBorrowFee;
    var weiPerBitcoin = DefaultWeiPerBitcoin;
    var gasPrice = DefaultGasPrice;
    var domainSeparator;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, contracts_1.deployContract)("TestERC20", 8)];
                case 1:
                    wbtc = _a.sent();
                    return [4 /*yield*/, (0, contracts_1.deployContract)("MockBtcEthPriceOracle")];
                case 2:
                    btcEthPriceOracle = _a.sent();
                    return [4 /*yield*/, (0, contracts_1.deployContract)("MockGasPriceOracle")];
                case 3:
                    gasPriceOracle = _a.sent();
                    return [4 /*yield*/, (0, contracts_1.deployContract)("MockGatewayRegistry", wbtc.address)];
                case 4:
                    registry = _a.sent();
                    return [4 /*yield*/, (0, contracts_1.deployContract)("BtcVault", registry.address, wbtc.address, btcEthPriceOracle.address, gasPriceOracle.address, feesTimeToLive, dynamicBorrowFeeBips, staticBorrowFee)];
                case 5:
                    vault = _a.sent();
                    return [4 /*yield*/, (0, contracts_1.deployContract)("TestModule", wbtc.address)];
                case 6:
                    module = _a.sent();
                    return [4 /*yield*/, (0, contracts_1.deployContract)("TestSignatureVerification")];
                case 7:
                    eip712 = _a.sent();
                    return [4 /*yield*/, (0, chain_1.createSnapshot)()];
                case 8:
                    reset = _a.sent();
                    domainSeparator = (0, eip712_1.getDomainSeparator)("ZeroBTC", vault.address, "v0.1");
                    return [2 /*return*/];
            }
        });
    }); });
    var addModule = function (defaultModule, overrideRepay) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, address, moduleType, tx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = defaultModule
                        ? [ethers_1.constants.AddressZero, 0]
                        : [module.address, overrideRepay ? 2 : 1], address = _a[0], moduleType = _a[1];
                    return [4 /*yield*/, vault.addModule(address, moduleType, DefaultLoanGas, DefaultRepayGas)];
                case 1:
                    tx = _b.sent();
                    return [4 /*yield*/, (0, fees_1.getExpectedModuleFees)(globalFees, moduleType, DefaultLoanGas, DefaultRepayGas, tx)];
                case 2:
                    moduleFees = _b.sent();
                    return [2 /*return*/, tx];
            }
        });
    }); };
    var updatePrices = function (newWeiPerBitcoin, newGasPrice) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    weiPerBitcoin = newWeiPerBitcoin;
                    gasPrice = newGasPrice;
                    return [4 /*yield*/, btcEthPriceOracle.setLatestAnswer(weiPerBitcoin)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, gasPriceOracle.setLatestAnswer(gasPrice)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var updateGlobalFees = function (tx) {
        if (tx === void 0) { tx = vault.deployTransaction; }
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fees_1.getExpectedGlobalFees)(dynamicBorrowFeeBips, staticBorrowFee, weiPerBitcoin, gasPrice, tx)];
                    case 1:
                        globalFees = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    var deposit = function (signer, amount) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wbtc.mint(signer.address, amount)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, wbtc.connect(signer).approve(vault.address, amount)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, vault.connect(signer).deposit(amount, signer.address)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dynamicBorrowFeeBips = DefaultDynamicBorrowFeeBips;
                    staticBorrowFee = DefaultStaticBorrowFee;
                    weiPerBitcoin = DefaultWeiPerBitcoin;
                    gasPrice = DefaultGasPrice;
                    return [4 /*yield*/, updateGlobalFees()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, reset()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe("EIP712", function () {
        it("digestPermit", function () { return __awaiter(void 0, void 0, void 0, function () {
            var permitTypeHash, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, eip712_1.getApprovalDigest)(eip712, { owner: lender.address, spender: lender.address, value: (0, bn_1.e18)(1) }, ethers_1.BigNumber.from(0), ethers_1.BigNumber.from(1000))];
                    case 1:
                        permitTypeHash = _b.sent();
                        _a = chai_1.expect;
                        return [4 /*yield*/, eip712.getPermitDigest(lender.address, lender.address, bn_1.ONE_E18, 1000, 1, "0x".padEnd(66, "0"), "0x".padEnd(66, "0"))];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).to.eq(permitTypeHash);
                        return [2 /*return*/];
                }
            });
        }); });
        it("digestTransferRequest", function () { return __awaiter(void 0, void 0, void 0, function () {
            var transferRequestDigest, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, eip712_1.getTransferRequestDigest)(eip712, lender.address, bn_1.ONE_E18, borrower.address, bn_1.TWO_E18, "0x".padEnd(66, "a"))];
                    case 1:
                        transferRequestDigest = _b.sent();
                        _a = chai_1.expect;
                        return [4 /*yield*/, eip712.getTransferRequestDigest(lender.address, bn_1.ONE_E18, borrower.address, bn_1.TWO_E18, "0x00", "0x".padEnd(66, "a"))];
                    case 2:
                        _a.apply(void 0, [_b.sent()]).to.eq(transferRequestDigest);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Constants", function () {
        it("name", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.name()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq("ZeroBTC");
                        return [2 /*return*/];
                }
            });
        }); });
        it("symbol", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.symbol()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq("ZBTC");
                        return [2 /*return*/];
                }
            });
        }); });
        it("version", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.version()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq("v0.1");
                        return [2 /*return*/];
                }
            });
        }); });
        it("gasPriceOracle", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.gasPriceOracle()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(gasPriceOracle.address);
                        return [2 /*return*/];
                }
            });
        }); });
        it("btcEthPriceOracle", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.btcEthPriceOracle()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(btcEthPriceOracle.address);
                        return [2 /*return*/];
                }
            });
        }); });
        it("feesTimeToLive", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.feesTimeToLive()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(feesTimeToLive);
                        return [2 /*return*/];
                }
            });
        }); });
        it("gatewayRegistry", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.gatewayRegistry()];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).to.eq(registry.address);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("ERC4626", function () {
        var prepareDeposit = function (amount) {
            if (amount === void 0) { amount = bn_1.ONE_E18; }
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, wbtc.approve(vault.address, amount)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, wbtc.mint(lender.address, amount)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        describe("deposit", function () {
            it("Starts at 1:1", function () { return __awaiter(void 0, void 0, void 0, function () {
                var tx, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, prepareDeposit(bn_1.ONE_E18)];
                        case 1:
                            _c.sent();
                            tx = vault.deposit(bn_1.ONE_E18, lender.address);
                            return [4 /*yield*/, (0, assertions_1.expectTransfers)(tx, [
                                    [wbtc, lender.address, vault.address, bn_1.ONE_E18],
                                    [vault, ethers_1.constants.AddressZero, lender.address, bn_1.ONE_E18],
                                ])];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, (0, chai_1.expect)(tx)
                                    .to.emit(vault, "Deposit")
                                    .withArgs(lender.address, lender.address, bn_1.ONE_E18, bn_1.ONE_E18)];
                        case 3:
                            _c.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, vault.balanceOf(lender.address)];
                        case 4:
                            _a.apply(void 0, [_c.sent()]).to.eq(bn_1.ONE_E18);
                            _b = chai_1.expect;
                            return [4 /*yield*/, vault.totalSupply()];
                        case 5:
                            _b.apply(void 0, [_c.sent()]).to.eq(bn_1.ONE_E18);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Mints tokens at conversion ratio", function () { return __awaiter(void 0, void 0, void 0, function () {
                var tx, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, prepareDeposit(bn_1.TWO_E18)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, (0, assertions_1.expectTransfers)(vault.deposit(bn_1.ONE_E18, lender.address), [
                                    [wbtc, lender.address, vault.address, bn_1.ONE_E18],
                                    [vault, ethers_1.constants.AddressZero, lender.address, bn_1.ONE_E18],
                                ])];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, wbtc.mint(vault.address, bn_1.ONE_E18)];
                        case 3:
                            _c.sent();
                            tx = vault.deposit(bn_1.ONE_E18, lender.address);
                            return [4 /*yield*/, (0, chai_1.expect)(tx)
                                    .to.emit(vault, "Deposit")
                                    .withArgs(lender.address, lender.address, bn_1.ONE_E18, bn_1.HALF_E18)];
                        case 4:
                            _c.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, vault.balanceOf(lender.address)];
                        case 5:
                            _a.apply(void 0, [_c.sent()]).to.eq(bn_1.ONE_E18.add(bn_1.HALF_E18));
                            _b = chai_1.expect;
                            return [4 /*yield*/, vault.totalSupply()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).to.eq(bn_1.ONE_E18.add(bn_1.HALF_E18));
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Reverts if transfer fails", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, chai_1.expect)(vault.deposit(1, lender.address)).to.be.revertedWith("TRANSFER_FROM_FAILED")];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("mint", function () {
            it("Starts at 1:1", function () { return __awaiter(void 0, void 0, void 0, function () {
                var tx, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, prepareDeposit(bn_1.ONE_E18)];
                        case 1:
                            _c.sent();
                            tx = vault.mint(bn_1.ONE_E18, lender.address);
                            return [4 /*yield*/, (0, assertions_1.expectTransfers)(tx, [
                                    [wbtc, lender.address, vault.address, bn_1.ONE_E18],
                                    [vault, ethers_1.constants.AddressZero, lender.address, bn_1.ONE_E18],
                                ])];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, (0, chai_1.expect)(tx)
                                    .to.emit(vault, "Deposit")
                                    .withArgs(lender.address, lender.address, bn_1.ONE_E18, bn_1.ONE_E18)];
                        case 3:
                            _c.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, vault.balanceOf(lender.address)];
                        case 4:
                            _a.apply(void 0, [_c.sent()]).to.eq(bn_1.ONE_E18);
                            _b = chai_1.expect;
                            return [4 /*yield*/, vault.totalSupply()];
                        case 5:
                            _b.apply(void 0, [_c.sent()]).to.eq(bn_1.ONE_E18);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Mints tokens at conversion ratio", function () { return __awaiter(void 0, void 0, void 0, function () {
                var tx, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, prepareDeposit(bn_1.TWO_E18)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, (0, assertions_1.expectTransfers)(vault.mint(bn_1.ONE_E18, lender.address), [
                                    [wbtc, lender.address, vault.address, bn_1.ONE_E18],
                                    [vault, ethers_1.constants.AddressZero, lender.address, bn_1.ONE_E18],
                                ])];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, wbtc.mint(vault.address, bn_1.ONE_E18)];
                        case 3:
                            _c.sent();
                            tx = vault.mint(bn_1.HALF_E18, lender.address);
                            return [4 /*yield*/, (0, chai_1.expect)(tx)
                                    .to.emit(vault, "Deposit")
                                    .withArgs(lender.address, lender.address, bn_1.ONE_E18, bn_1.HALF_E18)];
                        case 4:
                            _c.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, vault.balanceOf(lender.address)];
                        case 5:
                            _a.apply(void 0, [_c.sent()]).to.eq(bn_1.ONE_E18.add(bn_1.HALF_E18));
                            _b = chai_1.expect;
                            return [4 /*yield*/, vault.totalSupply()];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).to.eq(bn_1.ONE_E18.add(bn_1.HALF_E18));
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Reverts if transfer fails", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, chai_1.expect)(vault.mint(1, lender.address)).to.be.revertedWith("TRANSFER_FROM_FAILED")];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe("getGlobalFees", function () {
        it("getGlobalFees", function () { return __awaiter(void 0, void 0, void 0, function () {
            var fees, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = omitNumericProperties;
                        return [4 /*yield*/, vault.getGlobalFees()];
                    case 1:
                        fees = __rest.apply(void 0, [_a.apply(void 0, [_b.sent()]), []]);
                        (0, chai_1.expect)(fees).to.deep.eq(globalFees);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("pokeGlobalFees", function () {
        it("Does nothing if cache is not expired", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(vault.pokeGlobalFees()).to.not.emit(vault, "GlobalFeesCacheUpdated")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Updates cache if it has expired", function () { return __awaiter(void 0, void 0, void 0, function () {
            var tx, fees, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, updatePrices(weiPerBitcoin.div(2), gasPrice.div(2))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, time_1.advanceTime)(feesTimeToLive)];
                    case 2:
                        _b.sent();
                        tx = vault.pokeGlobalFees();
                        return [4 /*yield*/, updateGlobalFees(tx)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(tx)
                                .to.emit(vault, "GlobalFeesCacheUpdated")
                                .withArgs(globalFees.satoshiPerEth, globalFees.gweiPerGas)];
                    case 4:
                        _b.sent();
                        _a = omitNumericProperties;
                        return [4 /*yield*/, vault.getGlobalFees()];
                    case 5:
                        fees = __rest.apply(void 0, [_a.apply(void 0, [_b.sent()]), []]);
                        (0, chai_1.expect)(fees).to.deep.eq(globalFees);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("addModule", function () {
        it("Reverts if module asset does not match", function () { return __awaiter(void 0, void 0, void 0, function () {
            var badModule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, contracts_1.deployContract)("TestModule", ethers_1.constants.AddressZero)];
                    case 1:
                        badModule = _a.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(vault.addModule(badModule.address, 0, 0, 0)).to.be.revertedWith('ModuleAssetDoesNotMatch("0x0000000000000000000000000000000000000000")')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Reverts if module type is null and address is not zero", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(vault.addModule(module.address, 0, 0, 0)).to.be.revertedWith("InvalidModuleType()")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Reverts if module type is not null and address is zero", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, chai_1.expect)(vault.addModule(ethers_1.constants.AddressZero, 2, 0, 0)).to.be.revertedWith("InvalidModuleType()")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Initializes module fees", function () { return __awaiter(void 0, void 0, void 0, function () {
            var tx, fees, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, addModule(false, false)];
                    case 1:
                        tx = _b.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(tx)
                                .to.emit(vault, "ModuleFeesUpdated")
                                .withArgs(module.address, 1, moduleFees.loanGasE4, moduleFees.repayGasE4)];
                    case 2:
                        _b.sent();
                        _a = omitNumericProperties;
                        return [4 /*yield*/, vault.getModuleFees(module.address)];
                    case 3:
                        fees = __rest.apply(void 0, [_a.apply(void 0, [_b.sent()]), []]);
                        (0, chai_1.expect)(fees).to.deep.eq(moduleFees);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("loan", function () {
        describe("Module with loan override", function () {
            var defaultTransferRequest;
            var domainSeparator;
            before(function () {
                domainSeparator = (0, eip712_1.getDomainSeparator)("ZeroBTC", vault.address, "v0.1");
                defaultTransferRequest = {
                    asset: wbtc.address,
                    amount: bn_1.ONE_E8,
                    module: module.address,
                    nonce: 0,
                    data: utils_1.defaultAbiCoder.encode(["uint256"], [(0, bn_1.toBN)(1, 7)])
                };
            });
            it("Reverts if module not approved", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, chai_1.expect)(vault.loan(ethers_1.constants.AddressZero, borrower.address, lender.address, 0, "0x00", "0x00")).to.be.revertedWith("ModuleNotApproved")];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Reverts if signature is invalid", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, addModule()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, chai_1.expect)(vault.loan(module.address, borrower.address, lender.address, 0, "0x00", "0x00")).to.be.revertedWith("ECDSA: invalid signature length")];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Reverts if signature not from borrower", function () { return __awaiter(void 0, void 0, void 0, function () {
                var signature;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, addModule()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, lender._signTypedData(domainSeparator, eip712_1.EIP712_TransferRequestType, defaultTransferRequest)];
                        case 2:
                            signature = _a.sent();
                            return [4 /*yield*/, (0, chai_1.expect)(vault.loan(module.address, borrower.address, bn_1.ONE_E18, 0, signature, defaultTransferRequest.data)).to.be.revertedWith("InvalidSigner")];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should accept loan with valid signature", function () { return __awaiter(void 0, void 0, void 0, function () {
                var signature, getBalanceDifference, tx, fees, realBorrowAmount, moduleBurnAmount, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, addModule(false, true)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, deposit(lender, bn_1.ONE_E8)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, borrower._signTypedData(domainSeparator, eip712_1.EIP712_TransferRequestType, defaultTransferRequest)];
                        case 3:
                            signature = _b.sent();
                            return [4 /*yield*/, (0, chain_1.createBalanceCheckpoint)(null, lender.address)];
                        case 4:
                            getBalanceDifference = _b.sent();
                            return [4 /*yield*/, (0, chain_1.faucet)(vault.address)];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, vault.loan(module.address, borrower.address, bn_1.ONE_E8, 0, signature, defaultTransferRequest.data)];
                        case 6:
                            tx = _b.sent();
                            return [4 /*yield*/, (0, fees_1.calculateBorrowFee)(globalFees, moduleFees, bn_1.ONE_E8)];
                        case 7:
                            fees = _b.sent();
                            realBorrowAmount = bn_1.ONE_E8.sub(fees);
                            moduleBurnAmount = bn_1.ONE_E8.div(10);
                            return [4 /*yield*/, (0, chai_1.expect)(tx)
                                    // Check module executed correctly
                                    .to.emit(wbtc, "Transfer")
                                    .withArgs(vault.address, ethers_1.constants.AddressZero, moduleBurnAmount)
                                    .to.emit(wbtc, "Transfer")
                                    .withArgs(vault.address, borrower.address, realBorrowAmount.sub(moduleBurnAmount))
                                    // Check loaned shares were transferred
                                    .to.emit(vault, "Transfer")
                                    .withArgs(lender.address, vault.address, realBorrowAmount)];
                        case 8:
                            _b.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, getBalanceDifference(tx)];
                        case 9:
                            _a.apply(void 0, [_b.sent()]).to.eq(moduleFees.loanRefundEth);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("Default module", function () {
            var defaultTransferRequest;
            var domainSeparator;
            var digest;
            before(function () {
                domainSeparator = (0, eip712_1.getDomainSeparator)("ZeroBTC", vault.address, "v0.1");
                defaultTransferRequest = {
                    asset: wbtc.address,
                    amount: bn_1.ONE_E8,
                    module: ethers_1.constants.AddressZero,
                    nonce: 0,
                    data: "0x"
                };
                digest = ethers_1.BigNumber.from((0, eip712_1.getTransferRequestDigest)(vault, wbtc.address, bn_1.ONE_E8, ethers_1.constants.AddressZero, ethers_1.BigNumber.from(0), "0x"));
            });
            it("Reverts if module not approved", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, chai_1.expect)(vault.loan(ethers_1.constants.AddressZero, borrower.address, lender.address, 0, "0x00", "0x00")).to.be.revertedWith("ModuleNotApproved")];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Reverts if signature not from borrower", function () { return __awaiter(void 0, void 0, void 0, function () {
                var signature;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, addModule(true)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, lender._signTypedData(domainSeparator, eip712_1.EIP712_TransferRequestType, defaultTransferRequest)];
                        case 2:
                            signature = _a.sent();
                            return [4 /*yield*/, (0, chai_1.expect)(vault.loan(ethers_1.constants.AddressZero, borrower.address, bn_1.ONE_E18, 0, signature, defaultTransferRequest.data)).to.be.revertedWith("InvalidSigner")];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("Should accept loan with valid signature", function () { return __awaiter(void 0, void 0, void 0, function () {
                var signature, getBalanceDifference, tx, fees, realBorrowAmount, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, addModule(true)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, deposit(lender, bn_1.ONE_E8)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, borrower._signTypedData(domainSeparator, eip712_1.EIP712_TransferRequestType, defaultTransferRequest)];
                        case 3:
                            signature = _b.sent();
                            return [4 /*yield*/, (0, chain_1.createBalanceCheckpoint)(null, lender.address)];
                        case 4:
                            getBalanceDifference = _b.sent();
                            return [4 /*yield*/, (0, chain_1.faucet)(vault.address)];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, vault.loan(ethers_1.constants.AddressZero, borrower.address, bn_1.ONE_E8, 0, signature, defaultTransferRequest.data)];
                        case 6:
                            tx = _b.sent();
                            return [4 /*yield*/, (0, fees_1.calculateBorrowFee)(globalFees, moduleFees, bn_1.ONE_E8)];
                        case 7:
                            fees = _b.sent();
                            realBorrowAmount = bn_1.ONE_E8.sub(fees);
                            return [4 /*yield*/, (0, chai_1.expect)(tx)
                                    .to.emit(wbtc, "Transfer")
                                    .withArgs(vault.address, borrower.address, realBorrowAmount)
                                    // Check loaned shares were transferred
                                    .to.emit(vault, "Transfer")
                                    .withArgs(lender.address, vault.address, realBorrowAmount)
                                    .to.emit(vault, "LoanCreated")
                                    .withArgs(lender.address, borrower.address, digest, realBorrowAmount, realBorrowAmount)];
                        case 8:
                            _b.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, getBalanceDifference(tx)];
                        case 9:
                            _a.apply(void 0, [_b.sent()]).to.eq(moduleFees.loanRefundEth);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe("repay", function () {
        var takeLoan = function (module, data) { return __awaiter(void 0, void 0, void 0, function () {
            var transferRequest, loanId, signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transferRequest = {
                            asset: wbtc.address,
                            amount: bn_1.ONE_E8,
                            module: module,
                            nonce: 0,
                            data: data
                        };
                        loanId = ethers_1.BigNumber.from((0, eip712_1.getTransferRequestDigest)(vault, wbtc.address, bn_1.ONE_E8, module, ethers_1.BigNumber.from(0), data));
                        return [4 /*yield*/, deposit(lender, bn_1.ONE_E8)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, lender._signTypedData(domainSeparator, eip712_1.EIP712_TransferRequestType, transferRequest)];
                    case 2:
                        signature = _a.sent();
                        return [4 /*yield*/, vault.loan(module, borrower.address, bn_1.ONE_E8, 0, signature, data)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, loanId];
                }
            });
        }); };
        describe("Default module", function () { });
    });
});
