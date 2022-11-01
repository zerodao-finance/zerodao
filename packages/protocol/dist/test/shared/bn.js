"use strict";
exports.__esModule = true;
exports.MaxUint128 = exports.ONE_BTC_PER_WEI = exports.gwei = exports.GWEI = exports.THREE_E18 = exports.TWO_E18 = exports.ONE_E18 = exports.ONE_E8 = exports.HALF_E18 = exports.e18 = exports.toBN = void 0;
var units_1 = require("@ethereum-waffle/provider/node_modules/@ethersproject/units");
var ethers_1 = require("ethers");
var toBN = function (n, decimals) {
    if (decimals === void 0) { decimals = 0; }
    return ethers_1.BigNumber.from(10).pow(decimals).mul(n);
};
exports.toBN = toBN;
var e18 = function (n) { return (0, units_1.parseEther)(n.toString()); };
exports.e18 = e18;
exports.HALF_E18 = (0, exports.e18)("0.5");
exports.ONE_E8 = (0, exports.toBN)(1, 8);
exports.ONE_E18 = (0, exports.e18)(1);
exports.TWO_E18 = (0, exports.e18)(2);
exports.THREE_E18 = (0, exports.e18)(3);
exports.GWEI = (0, exports.toBN)(1, 9);
var gwei = function (n) { return exports.GWEI.mul(n); };
exports.gwei = gwei;
exports.ONE_BTC_PER_WEI = (0, exports.toBN)(1, 26);
exports.MaxUint128 = ethers_1.BigNumber.from(2).pow(128);
