import fixtures from "zero-protocol/lib/fixtures";
import { ethers } from "ethers";
const { getAddress, isAddress } = ethers.utils;

export const txCardAmount = ({ amount, tokenName }) => {
  const bigNumAmount = ethers.BigNumber.from(amount);

  switch (tokenName ? tokenName.toLowerCase() : "") {
    case "eth":
      return ethers.utils.formatEther(bigNumAmount);
    case "avax":
      return ethers.utils.formatEther(bigNumAmount);
    case "usdc":
      return ethers.utils.formatUnits(bigNumAmount, 6);
    default:
      return ethers.utils.formatUnits(bigNumAmount, 8);
  }
};

export const selectFixture = (chainId) => {
  switch (chainId) {
    case "42161":
      return fixtures.ARBITRUM;
    case "43114":
      return fixtures.AVALANCHE;
    case "137":
      return fixtures.MATIC;
    default:
      return fixtures.ETHEREUM;
  }
};

export const tokenMapping = ({ tokenName, chainId }) => {
  const fixture = selectFixture(chainId);

  switch (tokenName.toLowerCase()) {
    case "avax":
      return ethers.constants.AddressZero;
    case "matic":
      return ethers.constants.AddressZero;
    case "eth":
      return ethers.constants.AddressZero;
    case "renbtc":
      return fixture.renBTC;
    case "wbtc":
      return fixture.WBTC;
    case "ibbtc":
      return fixture.ibBTC;
    case "usdc":
      return fixture.USDC;
  }
};

export const reverseTokenMapping = ({ tokenAddress }) => {
  const checksummedAddress = isAddress(tokenAddress)
    ? getAddress(String(tokenAddress))
    : "";

  const fixture_array = [
    fixtures.ETHEREUM,
    fixtures.ARBITRUM,
    fixtures.AVALANCHE,
  ];
  var tokenName = null;

  fixture_array.forEach((fixture) => {
    if (checksummedAddress == ethers.constants.AddressZero) {
      tokenName = "ETH";
    } else if (checksummedAddress == getAddress(fixture.renBTC)) {
      tokenName = "renBTC";
    } else if (checksummedAddress == getAddress(fixture.WBTC)) {
      tokenName = "WBTC";
    } else if (checksummedAddress == getAddress(fixture.USDC)) {
      tokenName = "USDC";
    }
  });

  return tokenName || "unknown";
};

export const available_chains = [1, 42161, 43114, 137];

export const chainIdToName = {
  [1]: "ethereum",
  [42161]: "arbitrum",
  [137]: "matic",
  [43114]: "avalanche",
};

const toLower = (s) => s && s.toLowerCase();
const { ETHEREUM, ARBITRUM, AVALANCHE, MATIC } = fixtures;

export const DECIMALS = {
  [toLower(ETHEREUM.WBTC)]: 8,
  [toLower(ETHEREUM.renBTC)]: 8,
  [toLower(ETHEREUM.USDC)]: 6,
  [toLower(ETHEREUM.ibBTC)]: 8,
  [ethers.constants.AddressZero]: 18,
  [toLower(ARBITRUM.WBTC)]: 8,
  [toLower(ARBITRUM.renBTC)]: 8,
  [toLower(ARBITRUM.USDC)]: 6,
  [toLower(ARBITRUM.ibBTC)]: 8,
  [toLower(AVALANCHE.WBTC)]: 8,
  [toLower(AVALANCHE.renBTC)]: 8,
  [toLower(AVALANCHE.USDC)]: 6,
  [toLower(AVALANCHE.ibBTC)]: 8,
  [toLower(MATIC.WBTC)]: 8,
  [toLower(MATIC.renBTC)]: 8,
  [toLower(MATIC.USDC)]: 6,
  [toLower(MATIC.ibBTC)]: 8,
};

export const REMOVED_TOKENS = {
  [1]: ["ibBTC", "AVAX", "MATIC"],
  [42161]: ["ibBTC", "AVAX", "MATIC"],
  [137]: ["ibBTC", "AVAX", "ETH"],
  [43114]: ["ibBTC", "ETH", "MATIC"],
};
