import { hexValue } from "@ethersproject/bytes";



interface IIntegratedChain {
  id: number,
  hex: string
  name: string | string[];
  symbol: string;
  decimals?: number;
  explorerRootUrl?: string;
  rpcUrls(): string | string[] | undefined
}


const ETHEREUM: IIntegratedChain = {
  id: 1,
  hex: hexValue(1),
  name: ["Ether", "Ethereum"],
  symbol: "ETH",
  decimals: 18,
  rpcUrls: () => process.env.infuraKey ? `https://mainnet.infura.io/v3/${process.env.infuraKey}` : undefined,
  explorerRootUrl: "https://etherscan.io/address/"
}

const AVALANCHE: IIntegratedChain = {
  id: 43114,
  hex: hexValue(43114),
  name: ["Avax", "Avalanche"],
  symbol: "AVAX",
  decimals: 18,
  rpcUrls: () => "https://api.avax.network/ext/bc/C/rpc",
  explorerRootUrl: "https://snowtrace.io/address/"
}

const ARBITRUM: IIntegratedChain = {
  id: 42161,
  hex: hexValue(42161),
  name: "Arbitrum",
  symbol: "Arb",
  rpcUrls: () => process.env.infuraKey ? `https://arbitrum-mainnet.infura.io/v3/${process.env.infuraKey}` : undefined,
  explorerRootUrl: "https://snowtrace.io/address/"
}

const POLYGON: IIntegratedChain = {
  id: 137,
  hex: hexValue(137),
  name: ["Polygon", "Matic"],
  symbol: "MATIC",
  rpcUrls: () => process.env.infuraKey ? `https://polygon-mainnet.infura.io/v3/${process.env.infuraKey}` : undefined,
  explorerRootUrl: "https://polygonscan.com/address/"
}

const OPTIMISM: IIntegratedChain = {
  id: 10,
  hex: hexValue(10),
  name: "Optimism",
  symbol: "OPTIMISM",
  rpcUrls: () => process.env.infuraKey ? `https://optimism-mainnet.infura.io/v3/${process.env.infuraKey}` : undefined,
  explorerRootUrl: "https://optimistic.etherscan.io/address/"
}

const ID_CHAIN = {
  [1]: ETHEREUM,
  [43114]: AVALANCHE,
  [42161]: ARBITRUM,
  [137]: POLYGON,
  [10]: OPTIMISM
}

const NAME_CHAIN = {
  "Arbitrum": ARBITRUM,
  "Ethereum": ETHEREUM,
  "Avalanche": AVALANCHE,
  "Optimism": OPTIMISM,
  "Polygon": POLYGON
}

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
    case "43114":
      return "Avalanche";
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
    chainId: hexValue(1),
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
    chainId: hexValue(10),
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
    chainId: hexValue(42161),
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
    chainId: hexValue(43114),
    chainName: "Avalanche",
    nativeCurrency: AVAX,
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"].filter(
      (url) => url !== undefined
    ),
    blockExplorerUrls: ["https://avascan.info/"],
  },
  137: {
    chainId: hexValue(137),
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
