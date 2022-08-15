"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DECIMALS = void 0;
const fixtures_1 = require("./fixtures");
const constants_1 = require("@ethersproject/constants");
const toLower = (s) => s && s.toLowerCase();
exports.DECIMALS = {
    [toLower(fixtures_1.FIXTURES.ETHEREUM.WBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.ETHEREUM.renBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.ETHEREUM.USDC)]: 6,
    [toLower(fixtures_1.FIXTURES.ETHEREUM.ibBTC)]: 8,
    [constants_1.AddressZero]: 18,
    [toLower(fixtures_1.FIXTURES.ARBITRUM.WBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.ARBITRUM.renBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.ARBITRUM.USDC)]: 6,
    //@ts-ignore-error
    [toLower(fixtures_1.FIXTURES.ARBITRUM.ibBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.AVALANCHE.WBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.AVALANCHE.renBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.AVALANCHE.USDC)]: 6,
    //@ts-ignore-error
    [toLower(fixtures_1.FIXTURES.AVALANCHE.ibBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.MATIC.WBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.MATIC.renBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.MATIC.USDC)]: 6,
    //@ts-ignore-error
    [toLower(fixtures_1.FIXTURES.MATIC.ibBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.OPTIMISM.WBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.OPTIMISM.renBTC)]: 8,
    [toLower(fixtures_1.FIXTURES.OPTIMISM.USDC)]: 6,
};
//# sourceMappingURL=decimals.js.map