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
var chai_1 = require("chai");
var ethers_1 = require("ethers");
var hardhat_1 = require("hardhat");
require("../typechain-types");
var assertions_1 = require("./shared/assertions");
var bn_1 = require("./shared/bn");
var chain_1 = require("./shared/chain");
var contracts_1 = require("./shared/contracts");
describe("BtcVault", function () {
    var _a = hardhat_1.waffle.provider.getWallets(), wallet = _a[0], wallet1 = _a[1];
    var vault;
    var wbtc;
    var reset;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, contracts_1.deployContract)("TestERC20", 8)];
                case 1:
                    wbtc = _a.sent();
                    return [4 /*yield*/, (0, contracts_1.deployContract)("TestLendableSharesVault", wbtc.address)];
                case 2:
                    vault = _a.sent();
                    return [4 /*yield*/, (0, chain_1.createSnapshot)()];
                case 3:
                    reset = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reset()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var prepareDeposit = function (amount) {
        if (amount === void 0) { amount = bn_1.ONE_E18; }
        return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wbtc.approve(vault.address, amount)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, wbtc.mint(wallet.address, amount)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    describe("_borrowFrom", function () {
        // it("Reverts if lender has insufficient shares", async () => {
        //   await expectOverflowPanic(
        //     vault.borrowFrom(ONE_E18, wallet.address, wallet1.address, ONE_E18)
        //   );
        // });
        it("Transfers shares from lender to contract", function () { return __awaiter(void 0, void 0, void 0, function () {
            var tx, _a, _b, _c, assetsBorrowed, sharesLocked, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, prepareDeposit(bn_1.TWO_E18)];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, vault.deposit(bn_1.ONE_E18, wallet.address)];
                    case 2:
                        _e.sent();
                        tx = vault.borrowFrom(bn_1.ONE_E18, wallet.address, wallet1.address, bn_1.ONE_E18);
                        return [4 /*yield*/, (0, assertions_1.expectTransfers)(tx, [
                                // Verify transfer of lender => vault
                                [vault, wallet.address, vault.address, bn_1.ONE_E18],
                                // Verify transfer of vault => borrower to make sure test contract works
                                [wbtc, vault.address, wallet1.address, bn_1.ONE_E18],
                            ])];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(tx)
                                .to.emit(vault, "LoanCreated")
                                .withArgs(wallet.address, wallet1.address, bn_1.ONE_E18, bn_1.ONE_E18, bn_1.ONE_E18)];
                    case 4:
                        _e.sent();
                        // Verify totalAssets compensates for borrowed assets
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.totalAssets()];
                    case 5:
                        // Verify totalAssets compensates for borrowed assets
                        _a.apply(void 0, [_e.sent()]).to.eq(bn_1.ONE_E18);
                        // Verify totalBorrowedAssets increases
                        _b = chai_1.expect;
                        return [4 /*yield*/, vault.totalBorrowedAssets()];
                    case 6:
                        // Verify totalBorrowedAssets increases
                        _b.apply(void 0, [_e.sent()]).to.eq(bn_1.ONE_E18);
                        return [4 /*yield*/, vault.outstandingLoans(wallet.address, bn_1.ONE_E18)];
                    case 7:
                        _c = _e.sent(), assetsBorrowed = _c.assetsBorrowed, sharesLocked = _c.sharesLocked;
                        (0, chai_1.expect)(assetsBorrowed).to.eq(bn_1.ONE_E18);
                        (0, chai_1.expect)(sharesLocked).to.eq(bn_1.ONE_E18);
                        // Check deposit functions as expected
                        return [4 /*yield*/, (0, assertions_1.expectTransfers)(vault.deposit(bn_1.ONE_E18, wallet.address), [
                                // Verify transfer of lender => vault
                                [vault, ethers_1.constants.AddressZero, wallet.address, bn_1.ONE_E18],
                                // Verify transfer of vault => borrower to make sure test contract works
                                [wbtc, wallet.address, vault.address, bn_1.ONE_E18],
                            ])];
                    case 8:
                        // Check deposit functions as expected
                        _e.sent();
                        _d = chai_1.expect;
                        return [4 /*yield*/, vault.totalAssets()];
                    case 9:
                        _d.apply(void 0, [_e.sent()]).to.eq(bn_1.TWO_E18);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Reverts if loan id not unique", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prepareDeposit(bn_1.TWO_E18)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, vault.deposit(bn_1.TWO_E18, wallet.address)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, vault.borrowFrom(ethers_1.BigNumber.from(1), wallet.address, wallet1.address, bn_1.ONE_E18)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(vault.borrowFrom(ethers_1.BigNumber.from(1), wallet.address, wallet1.address, bn_1.ONE_E18)).to.be.revertedWith("LoanIdNotUnique(1)")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Reverts if borrowAmount exceeds max uint128", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prepareDeposit(bn_1.ONE_E18)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, vault.deposit(bn_1.ONE_E18, wallet.address)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, wbtc.mint(vault.address, bn_1.MaxUint128)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, assertions_1.expectOverflowPanic)(vault.borrowFrom(bn_1.ONE_E18, wallet.address, wallet1.address, bn_1.MaxUint128))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Reverts if shares exceeds max uint128", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prepareDeposit(bn_1.ONE_E18)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, vault.deposit(bn_1.ONE_E18, wallet.address)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, vault.freeMint(vault.address, bn_1.MaxUint128)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, assertions_1.expectOverflowPanic)(vault.borrowFrom(bn_1.ONE_E18, wallet.address, wallet1.address, bn_1.ONE_E18))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Reverts if totalBorrowedAmount exceeds max uint128", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prepareDeposit(bn_1.ONE_E18)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, vault.deposit(bn_1.ONE_E18, wallet.address)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, wbtc.mint(vault.address, bn_1.MaxUint128)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, vault.borrowFrom(bn_1.ONE_E18, wallet.address, wallet1.address, bn_1.MaxUint128.div(2))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, assertions_1.expectOverflowPanic)(vault.borrowFrom(bn_1.TWO_E18, wallet.address, wallet1.address, bn_1.MaxUint128.div(2)))];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("_repayTo", function () {
        it("Repays and deletes an existing loan", function () { return __awaiter(void 0, void 0, void 0, function () {
            var gasCost, tx, _a, _b, _c, assetsBorrowed, sharesLocked;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, prepareDeposit(bn_1.TWO_E18)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, vault.deposit(bn_1.ONE_E18, wallet.address)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, vault.estimateGas.borrowFrom(1, wallet.address, wallet1.address, bn_1.ONE_E18)];
                    case 3:
                        gasCost = _d.sent();
                        console.log("Borrow Gas Cost: " + gasCost.toNumber());
                        return [4 /*yield*/, vault.borrowFrom(1, wallet.address, wallet1.address, bn_1.ONE_E18)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, vault.estimateGas.repayTo(wallet.address, 1, bn_1.ONE_E18)];
                    case 5:
                        gasCost = _d.sent();
                        tx = vault.repayTo(wallet.address, 1, bn_1.ONE_E18);
                        console.log("Repay Gas Cost: " + gasCost.toNumber());
                        return [4 /*yield*/, (0, assertions_1.expectTransfers)(tx, [
                                // Verify transfer of lender => vault to make sure test contract works
                                [wbtc, wallet.address, vault.address, bn_1.ONE_E18],
                                // Verify transfer of vault => lender
                                [vault, vault.address, wallet.address, bn_1.ONE_E18],
                            ])];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(tx)
                                .to.emit(vault, "LoanClosed")
                                .withArgs(1, bn_1.ONE_E18, bn_1.ONE_E18, 0)];
                    case 7:
                        _d.sent();
                        // Verify borrowed assets are reduced
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.totalBorrowedAssets()];
                    case 8:
                        // Verify borrowed assets are reduced
                        _a.apply(void 0, [_d.sent()]).to.eq(0);
                        _b = chai_1.expect;
                        return [4 /*yield*/, vault.totalAssets()];
                    case 9:
                        _b.apply(void 0, [_d.sent()]).to.eq(bn_1.ONE_E18);
                        return [4 /*yield*/, vault.outstandingLoans(wallet.address, 1)];
                    case 10:
                        _c = _d.sent(), assetsBorrowed = _c.assetsBorrowed, sharesLocked = _c.sharesLocked;
                        (0, chai_1.expect)(sharesLocked).to.eq(0);
                        (0, chai_1.expect)(assetsBorrowed).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Reverts if loan does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prepareDeposit(bn_1.TWO_E18)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, vault.deposit(bn_1.ONE_E18, wallet.address)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(vault.repayTo(wallet.address, 1, bn_1.ONE_E18)).to.be.revertedWith("LoanDoesNotExist(1)")];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("Burns shares on partial repayment", function () { return __awaiter(void 0, void 0, void 0, function () {
            var tx, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, prepareDeposit(bn_1.TWO_E18)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, vault.deposit(bn_1.ONE_E18, wallet.address)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, vault.borrowFrom(1, wallet.address, wallet1.address, bn_1.ONE_E18)];
                    case 3:
                        _d.sent();
                        tx = vault.repayTo(wallet.address, 1, bn_1.HALF_E18);
                        return [4 /*yield*/, (0, assertions_1.expectTransfers)(tx, [
                                // Verify transfer of lender => vault to make sure test contract works
                                [wbtc, wallet.address, vault.address, bn_1.ONE_E18],
                                // Verify transfer of vault => lender
                                [vault, vault.address, wallet.address, bn_1.HALF_E18],
                                // Verify partial burn
                                [vault, vault.address, ethers_1.constants.AddressZero, bn_1.HALF_E18],
                            ])];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(tx)
                                .to.emit(vault, "LoanClosed")
                                .withArgs(1, bn_1.HALF_E18, bn_1.HALF_E18, bn_1.HALF_E18)];
                    case 5:
                        _d.sent();
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.totalBorrowedAssets()];
                    case 6:
                        _a.apply(void 0, [_d.sent()]).to.eq(0);
                        _b = chai_1.expect;
                        return [4 /*yield*/, vault.totalAssets()];
                    case 7:
                        _b.apply(void 0, [_d.sent()]).to.eq(bn_1.HALF_E18);
                        _c = chai_1.expect;
                        return [4 /*yield*/, vault.totalSupply()];
                    case 8:
                        _c.apply(void 0, [_d.sent()]).to.eq(bn_1.HALF_E18);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Works with null repayment", function () { return __awaiter(void 0, void 0, void 0, function () {
            var tx, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, prepareDeposit(bn_1.TWO_E18)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, vault.deposit(bn_1.ONE_E18, wallet.address)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, vault.borrowFrom(1, wallet.address, wallet1.address, bn_1.ONE_E18)];
                    case 3:
                        _d.sent();
                        tx = vault.repayTo(wallet.address, 1, 0);
                        return [4 /*yield*/, (0, assertions_1.expectTransfers)(tx, [
                                // Verify transfer of lender => vault to make sure test contract works
                                [wbtc, wallet.address, vault.address, 0],
                                // Verify partial burn
                                [vault, vault.address, ethers_1.constants.AddressZero, bn_1.ONE_E18],
                            ])];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(tx).to.emit(vault, "LoanClosed").withArgs(1, 0, 0, bn_1.ONE_E18)];
                    case 5:
                        _d.sent();
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.totalBorrowedAssets()];
                    case 6:
                        _a.apply(void 0, [_d.sent()]).to.eq(0);
                        _b = chai_1.expect;
                        return [4 /*yield*/, vault.totalAssets()];
                    case 7:
                        _b.apply(void 0, [_d.sent()]).to.eq(0);
                        _c = chai_1.expect;
                        return [4 /*yield*/, vault.totalSupply()];
                    case 8:
                        _c.apply(void 0, [_d.sent()]).to.eq(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it("Works with overpayment", function () { return __awaiter(void 0, void 0, void 0, function () {
            var tx, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, prepareDeposit(bn_1.TWO_E18)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, vault.deposit(bn_1.ONE_E18, wallet.address)];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, vault.borrowFrom(1, wallet.address, wallet1.address, bn_1.HALF_E18)];
                    case 3:
                        _d.sent();
                        tx = vault.repayTo(wallet.address, 1, bn_1.ONE_E18);
                        return [4 /*yield*/, (0, assertions_1.expectTransfers)(tx, [
                                // Verify transfer of lender => vault to make sure test contract works
                                [wbtc, wallet.address, vault.address, bn_1.ONE_E18],
                                // Verify transfer of vault => lender
                                [vault, vault.address, ethers_1.constants.AddressZero, bn_1.HALF_E18],
                            ])];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, (0, chai_1.expect)(tx).to.emit(vault, "LoanClosed").withArgs(1, 0, 0, bn_1.ONE_E18)];
                    case 5:
                        _d.sent();
                        _a = chai_1.expect;
                        return [4 /*yield*/, vault.totalBorrowedAssets()];
                    case 6:
                        _a.apply(void 0, [_d.sent()]).to.eq(0);
                        _b = chai_1.expect;
                        return [4 /*yield*/, vault.totalAssets()];
                    case 7:
                        _b.apply(void 0, [_d.sent()]).to.eq(bn_1.ONE_E18.add(bn_1.HALF_E18));
                        _c = chai_1.expect;
                        return [4 /*yield*/, vault.totalSupply()];
                    case 8:
                        _c.apply(void 0, [_d.sent()]).to.eq(bn_1.ONE_E18);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
