import { hexValue } from "@ethersproject/bytes";
import { getAddress } from "@ethersproject/address";

import {
  Polygon,
  Ethereum,
  Arbitrum,
  Avalanche,
  Optimism,
  EthereumBaseChain,
} from "@renproject/chains";
import { InfuraProvider, JsonRpcProvider } from "@ethersproject/providers";
import { cachedFrom } from "@zerodao/utils";

interface IIntegratedChain {
  id: number;
  hex: string;
  name: string | string[];
  symbol: string;
  decimals?: number;
  uniswapName: string;
  explorerRootUrl?: string;
  rpcUrl: string | string[] | undefined;
}

const INFURA_PROJECT_ID =
  process.env.REACT_APP_INFURA_PROJECT_ID ||
  process.env.INFURA_PROJECT_ID ||
  "816df2901a454b18b7df259e61f92cd2";

const ETHEREUM: IIntegratedChain = {
  id: 1,
  hex: hexValue(1),
  name: "Ethereum",
  uniswapName: "MAINNET",
  symbol: "ETH",
  decimals: 18,
  rpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  explorerRootUrl: "https://etherscan.io/address/",
};

const AVALANCHE: IIntegratedChain = {
  id: 43114,
  hex: hexValue(43114),
  name: "Avalanche",
  symbol: "AVAX",
  uniswapName: "",
  decimals: 18,
  rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
  explorerRootUrl: "https://snowtrace.io/address/",
};

const ARBITRUM: IIntegratedChain = {
  id: 42161,
  hex: hexValue(42161),
  name: "Arbitrum",
  symbol: "Arb",
  uniswapName: "ARBITRUM",
  rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  explorerRootUrl: "https://snowtrace.io/address/",
};

const POLYGON: IIntegratedChain = {
  id: 137,
  hex: hexValue(137),
  name: "Polygon",
  symbol: "MATIC",
  uniswapName: "POLYGON",
  rpcUrl: `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  explorerRootUrl: "https://polygonscan.com/address/",
};

const OPTIMISM: IIntegratedChain = {
  id: 10,
  hex: hexValue(10),
  name: "Optimism",
  symbol: "OPTIMISM",
  uniswapName: "OPTIMISM",
  rpcUrl: `https://optimism-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  explorerRootUrl: "https://optimistic.etherscan.io/address/",
};

export const ID_CHAIN = {
  [1]: ETHEREUM,
  [43114]: AVALANCHE,
  [42161]: ARBITRUM,
  [137]: POLYGON,
  [10]: OPTIMISM,
};

export const NAME_CHAIN = {
  Arbitrum: ARBITRUM,
  Ethereum: ETHEREUM,
  Avalanche: AVALANCHE,
  Optimism: OPTIMISM,
  Polygon: POLYGON,
};

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
  switch (Number(chainId)) {
    case 42161:
      return "Arbitrum";
    case 43114:
      return "Avalanche";
    case 137:
      return "Polygon";
    case 1:
      return "Ethereum";
    case 10:
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

export const CHAINS = [
  [1, ETH],
  [10, ETH],
  [42161, ETH],
  [43114, AVAX],
  [137, MATIC],
].reduce((r, [chainId, currency]) => {
  const { rpcUrl, explorerRootUrl } = ID_CHAIN[Number(chainId)];
  r[Number(chainId)] = {
    chainId: hexValue(Number(chainId)),
    chainName: getChainName(chainId).toLowerCase(),
    nativeCurrency: currency,
    rpcUrl: rpcUrl,
    blockExplorerUrls: explorerRootUrl,
  };
  return r;
}, {});

export const URLS = Object.keys(CHAINS).reduce((r, chainId) => {
  r[Number(chainId)] = CHAINS[Number(chainId)].rpcUrls || [];
  return r;
}, {});

export const CONTROLLER_DEPLOYMENTS = {
  [getAddress(
    require("@zerodao/protocol/deployments/arbitrum/BadgerBridgeZeroController")
      .address
  )]: "Arbitrum",
  [getAddress(
    require("@zerodao/protocol/deployments/avalanche/BadgerBridgeZeroController")
      .address
  )]: "Avalanche",
  [getAddress(
    require("@zerodao/protocol/deployments/matic/BadgerBridgeZeroController")
      .address
  )]: "Polygon",
  [getAddress(
    require("@zerodao/protocol/deployments/mainnet/BadgerBridgeZeroController")
      .address
  )]: "Ethereum",
  [getAddress(
    require("@zerodao/protocol/deployments/mainnet/RenZECController").address
  )]: "Ethereum",
  [getAddress(
    require("@zerodao/protocol/deployments/optimism/BadgerBridgeZeroController")
      .address
  )]: "Optimism",
};

export const RPC_ENDPOINTS = {
  Arbitrum: CHAINS[42161].rpcUrl,
  Avalanche: CHAINS[43114].rpcUrl,
  Polygon: CHAINS[137].rpcUrl,
  Ethereum: CHAINS[1].rpcUrl,
  Optimism: CHAINS[10].rpcUrl,
  localhost: "http://localhost:8545",
};

export const RENVM_PROVIDERS = {
  Arbitrum,
  Polygon,
  Ethereum,
  Avalanche,
  Optimism,
};

export const providerFromChainId = cachedFrom((chainId) => {
  const chainIdNumber = Number(chainId);
  const chain = CHAINS[chainIdNumber];
  const name = chain.chainName.toLowerCase();
  const infuraKey = (() => {
    switch (name) {
      case "ethereum":
        return "mainnet";
      case "polygon":
        return "matic";
      case "arbitrum":
        return name;
    }
  })();
  if (infuraKey) return new InfuraProvider(infuraKey, INFURA_PROJECT_ID);
  return new JsonRpcProvider(chain.rpcUrl);
});

export const getVanillaProvider = (request) => {
  const checkSummedContractAddr = getAddress(request.contractAddress);
  if (Object.keys(CONTROLLER_DEPLOYMENTS).includes(checkSummedContractAddr)) {
    const chain_key = CONTROLLER_DEPLOYMENTS[checkSummedContractAddr];
    return providerFromChainId(NAME_CHAIN[chain_key].id);
  } else {
    throw new Error(
      "Not a contract currently deployed: " + checkSummedContractAddr
    );
  }
};

export const getRenVMChain = (transferRequest) => {
  const checkSummedContractAddr = getAddress(transferRequest.contractAddress);
  const ethersProvider = getVanillaProvider(transferRequest);
  const chain_key = CONTROLLER_DEPLOYMENTS[checkSummedContractAddr];
  return new RENVM_PROVIDERS[chain_key]({
    network: "mainnet",
    provider: ethersProvider,
  });
};

export const getProvider: ({
  contractAddress,
}: {
  contractAddress: string;
}) => EthereumBaseChain = (transferRequest) => {
  const checksummedAddr = getAddress(transferRequest.contractAddress);

  const ethersProvider = getVanillaProvider(transferRequest);
  const chain_key = CONTROLLER_DEPLOYMENTS[checksummedAddr];
  if (chain_key == "localhost")
    return new RENVM_PROVIDERS.Ethereum({
      network: "mainnet",
      provider: ethersProvider,
    });
  return new RENVM_PROVIDERS[chain_key]({
    provider: ethersProvider,
    network: "mainnet",
  });
};
