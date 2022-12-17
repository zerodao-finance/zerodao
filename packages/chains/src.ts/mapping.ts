import _ from "lodash";
import { isAddress, getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, formatEther } from "@ethersproject/units";
import { FIXTURES } from "@zerodao/common";

export function selectFixture(chainId) {
  switch (chainId) {
    case "42161":
      return FIXTURES.ARBITRUM;
    case "43114":
      return FIXTURES.AVALANCHE;
    case "137":
      return FIXTURES.MATIC;
    case "10":
      return FIXTURES.OPTIMISM;
    default:
      return FIXTURES.ETHEREUM;
  }
}

export function getChainUnits({ amount, tokenName }) {
  const BNAmount = BigNumber.from(amount);

  switch (tokenName ? tokenName.toLowerCase() : "") {
    case "eth":
      return formatEther(BNAmount);
    case "avax":
      return formatEther(BNAmount);
    case "matic":
      return formatEther(BNAmount);
    case "op":
      return formatEther(BNAmount);
    case "usdc":
      return formatUnits(BNAmount, 6);
    default:
      return formatUnits(BNAmount, 8);
  }
}

export const getChainIdToName = {
  [1]: "ethereum",
  [42161]: "arbitrum",
  [137]: "matic",
  [43114]: "avalanche",
  [10]: "optimism",
};

export const chainIdToNetworkName = (chainId) => {
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

export function tokenMapping({ tokenName, chainId }) {
  const fixture: any = selectFixture(chainId);

  switch (tokenName.toLowerCase()) {
    case "avax":
      return AddressZero;
    case "eth":
      return AddressZero;
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

export function reverseTokenMapping({ tokenAddress, chainId }) {
  const checksummedAddress = isAddress(tokenAddress)
    ? getAddress(String(tokenAddress))
    : "";

  const fixture = selectFixture(chainId);
  if (checksummedAddress == AddressZero) return "ETH";
  let tokenName = _.findKey(fixture, function (v) {
    return getAddress(v) == checksummedAddress;
  });
  return tokenName;
}
