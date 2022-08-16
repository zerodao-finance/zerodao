"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseTokenMapping = exports.tokenMapping = exports.chainIdToNetworkName = exports.getChainIdToName = exports.getChainUnits = exports.selectFixture = void 0;
const lodash_1 = __importDefault(require("lodash"));
const address_1 = require("@ethersproject/address");
const constants_1 = require("@ethersproject/constants");
const bignumber_1 = require("@ethersproject/bignumber");
const units_1 = require("@ethersproject/units");
const common_1 = require("@zerodao/common");
function selectFixture(chainId) {
    switch (chainId) {
        case "42161":
            return common_1.FIXTURES.ARBITRUM;
        case "43114":
            return common_1.FIXTURES.AVALANCHE;
        case "137":
            return common_1.FIXTURES.MATIC;
        case "10":
            return common_1.FIXTURES.OPTIMISM;
        default:
            return common_1.FIXTURES.ETHEREUM;
    }
}
exports.selectFixture = selectFixture;
function getChainUnits({ amount, tokenName }) {
    const BNAmount = bignumber_1.BigNumber.from(amount);
    switch (tokenName ? tokenName.toLowerCase() : "") {
        case "eth":
            return (0, units_1.formatEther)(BNAmount);
        case "avax":
            return (0, units_1.formatEther)(BNAmount);
        case "matic":
            return (0, units_1.formatEther)(BNAmount);
        case "op":
            return (0, units_1.formatEther)(BNAmount);
        case "usdc":
            return (0, units_1.formatUnits)(BNAmount, 6);
        default:
            return (0, units_1.formatUnits)(BNAmount, 8);
    }
}
exports.getChainUnits = getChainUnits;
exports.getChainIdToName = {
    [1]: "ethereum",
    [42161]: "arbitrum",
    [137]: "matic",
    [43114]: "avalanche",
    [10]: "optimism"
};
const chainIdToNetworkName = (chainId) => {
    return {
        [10]: [
            "optimism",
            [
                { BadgerBridgeZeroController: "ZeroController" },
                { BadgerBridgeZeroController: "DelegateUnderwriter" },
            ],
            [],
        ],
        [42161]: [
            "arbitrum",
            [
                { BadgerBridgeZeroController: "ZeroController" },
                { BadgerBridgeZeroController: "DelegateUnderwriter" },
            ],
            [],
        ],
        [43114]: [
            "avalanche",
            [
                { BadgerBridgeZeroController: "ZeroController" },
                { BadgerBridgeZeroController: "DelegateUnderwriter" },
            ],
            [],
        ],
        [137]: [
            "matic",
            [
                { BadgerBridgeZeroController: "ZeroController" },
                { BadgerBridgeZeroController: "DelegateUnderwriter" },
            ],
            [],
        ],
        [1]: [
            "mainnet",
            [
                { BadgerBridgeZeroController: "ZeroController" },
                { BadgerBridgeZeroController: "DelegateUnderwriter" },
            ],
            [],
        ],
    }[chainId];
};
exports.chainIdToNetworkName = chainIdToNetworkName;
function tokenMapping({ tokenName, chainId }) {
    const fixture = selectFixture(chainId);
    switch (tokenName.toLowerCase()) {
        case "avax":
            return constants_1.AddressZero;
        case "eth":
            return constants_1.AddressZero;
        case "renbtc":
            return fixture.renBTC;
        case "wbtc":
            return fixture.WBTC;
        case "ibbtc":
            return fixture.ibBTC;
        case "usdc":
            return fixture.USDC;
    }
}
exports.tokenMapping = tokenMapping;
function reverseTokenMapping({ tokenAddress, chainId }) {
    const checksummedAddress = (0, address_1.isAddress)(tokenAddress)
        ? (0, address_1.getAddress)(String(tokenAddress))
        : "";
    const fixture = selectFixture(chainId);
    if (checksummedAddress == constants_1.AddressZero)
        return "ETH";
    let tokenName = lodash_1.default.findKey(fixture, function (v) { return (0, address_1.getAddress)(v) == checksummedAddress; });
    return tokenName;
}
exports.reverseTokenMapping = reverseTokenMapping;
//# sourceMappingURL=mapping.js.map