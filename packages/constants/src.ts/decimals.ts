import { FIXTURES } from "./fixtures"
import { AddressZero } from "@ethersproject/constants";
const toLower = (s) => s && s.toLowerCase();

export const DECIMALS = {
    [toLower(FIXTURES.ETHEREUM.WBTC)]: 8,
    [toLower(FIXTURES.ETHEREUM.renBTC)]: 8,
    [toLower(FIXTURES.ETHEREUM.USDC)]: 6,
    [toLower(FIXTURES.ETHEREUM.ibBTC)]: 8,
    [AddressZero]: 18,
    [toLower(FIXTURES.ARBITRUM.WBTC)]: 8,
    [toLower(FIXTURES.ARBITRUM.renBTC)]: 8,
    [toLower(FIXTURES.ARBITRUM.USDC)]: 6,
    //@ts-ignore-error
    [toLower(FIXTURES.ARBITRUM.ibBTC)]: 8,
    [toLower(FIXTURES.AVALANCHE.WBTC)]: 8,
    [toLower(FIXTURES.AVALANCHE.renBTC)]: 8,
    [toLower(FIXTURES.AVALANCHE.USDC)]: 6,
    //@ts-ignore-error
    [toLower(FIXTURES.AVALANCHE.ibBTC)]: 8,
    [toLower(FIXTURES.MATIC.WBTC)]: 8,
    [toLower(FIXTURES.MATIC.renBTC)]: 8,
    [toLower(FIXTURES.MATIC.USDC)]: 6,
    //@ts-ignore-error
    [toLower(FIXTURES.MATIC.ibBTC)]: 8,
    [toLower(FIXTURES.OPTIMISM.WBTC)]: 8,
    [toLower(FIXTURES.OPTIMISM.renBTC)]: 8,
    [toLower(FIXTURES.OPTIMISM.USDC)]: 6,
};