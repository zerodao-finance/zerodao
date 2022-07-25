import { ethers } from "ethers";

const ETH = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
};

const MATIC = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
};

const AVAX = {
  name: "AVAX",
  symbol: "AVAX",
  decimals: 18,
};

export const getChainName = (chainId) => {
  switch (chainId) {
    case "42161":
      return "Arbitrum";
    // case "43114":
    //   return "Avalanche";
    case "137":
      return "Polygon";
    case "1":
      return "Mainnet";
    case "10":
      return "Optimism";
    default:
      return "Unsupported Chain";
  }
};

export const getExplorerRoot = (chainId) => {
  switch (chainId) {
    case "42161":
      return "https://arbiscan.io/address/";
    case "43114":
      return "https://snowtrace.io/address/";
    case "137":
      return "https://polygonscan.com/address/";
    case "10":
      return "https://optimistic.etherscan.io/address/";
    default:
      return "https://etherscan.io/address/";
  }
};

export const CHAINS = {
  1: {
    chainId: ethers.utils.hexValue(1),
    chainName: "mainnet",
    nativeCurrency: ETH,
    rpcUrls: [
      process.env.infuraKey
        ? `https://mainnet.infura.io/v3/${process.env.infuraKey}`
        : undefined,
      "https://rpc.ankr.com/eth",
    ].filter((url) => url !== undefined),
    blockExplorerUrls: ["https://etherscan.io"],
  },
  10: {
    chainId: ethers.utils.hexValue(10),
    chainName: "Optimism",
    nativeCurrency: ETH,
    rpcUrls: [
      process.env.infuraKey
        ? `https://optimism-mainnet.infura.io/v3/${process.env.infuraKey}`
        : undefined,
      "https://mainnet.optimism.io",
    ].filter((url) => url !== undefined),
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
  },
  42161: {
    chainId: ethers.utils.hexValue(42161),
    chainName: "Arbitrum",
    nativeCurrency: ETH,
    rpcUrls: [
      process.env.infuraKey
        ? `https://arbitrum-mainnet.infura.io/v3/${process.env.infuraKey}`
        : undefined,
      "https://arb1.arbitrum.io/rpc",
    ].filter((url) => url !== undefined),
    blockExplorerUrls: ["https://arbiscan.io"],
  },
  43114: {
    chainId: ethers.utils.hexValue(43114),
    chainName: "Avalanche",
    nativeCurrency: AVAX,
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"].filter(
      (url) => url !== undefined
    ),
    blockExplorerUrls: ["https://avascan.info/"],
  },
  137: {
    chainId: ethers.utils.hexValue(137),
    chainName: "Polygon",
    nativeCurrency: MATIC,
    rpcUrls: [
      process.env.infuraKey
        ? `https://polygon-mainnet.infura.io/v3/${process.env.infuraKey}`
        : undefined,
      "https://polygon-rpc.com",
    ].filter((url) => url !== undefined),
    blockExplorerUrls: ["https://polygonscan.com"],
  },
};

export const URLS = Object.keys(CHAINS).reduce((accumulator, chainId) => {
  const validUrls = CHAINS[Number(chainId)].rpcUrls;

  if (validUrls.length) {
    accumulator[chainId] = validUrls;
  }

  return accumulator;
}, {});
