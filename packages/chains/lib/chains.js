"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvider = exports.getRenVMChain = exports.getVanillaProvider = exports.providerFromChainId = exports.RENVM_PROVIDERS = exports.RPC_ENDPOINTS = exports.CONTROLLER_DEPLOYMENTS = exports.URLS = exports.CHAINS = exports.getExplorerRoot = exports.getChainName = exports.NAME_CHAIN = exports.ID_CHAIN = void 0;
const bytes_1 = require("@ethersproject/bytes");
const address_1 = require("@ethersproject/address");
const chains_1 = require("@renproject/chains");
const providers_1 = require("@ethersproject/providers");
const utils_1 = require("@zerodao/utils");
const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID || process.env.INFURA_PROJECT_ID || '816df2901a454b18b7df259e61f92cd2';
const ETHEREUM = {
    id: 1,
    hex: (0, bytes_1.hexValue)(1),
    name: "Ethereum",
    uniswapName: "MAINNET",
    symbol: "ETH",
    decimals: 18,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    explorerRootUrl: "https://etherscan.io/address/"
};
const AVALANCHE = {
    id: 43114,
    hex: (0, bytes_1.hexValue)(43114),
    name: "Avalanche",
    symbol: "AVAX",
    uniswapName: "",
    decimals: 18,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    explorerRootUrl: "https://snowtrace.io/address/"
};
const ARBITRUM = {
    id: 42161,
    hex: (0, bytes_1.hexValue)(42161),
    name: "Arbitrum",
    symbol: "Arb",
    uniswapName: "ARBITRUM",
    rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    explorerRootUrl: "https://snowtrace.io/address/"
};
const POLYGON = {
    id: 137,
    hex: (0, bytes_1.hexValue)(137),
    name: "Polygon",
    symbol: "MATIC",
    uniswapName: "POLYGON",
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    explorerRootUrl: "https://polygonscan.com/address/"
};
const OPTIMISM = {
    id: 10,
    hex: (0, bytes_1.hexValue)(10),
    name: "Optimism",
    symbol: "OPTIMISM",
    uniswapName: "OPTIMISM",
    rpcUrl: `https://optimism-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    explorerRootUrl: "https://optimistic.etherscan.io/address/"
};
exports.ID_CHAIN = {
    [1]: ETHEREUM,
    [43114]: AVALANCHE,
    [42161]: ARBITRUM,
    [137]: POLYGON,
    [10]: OPTIMISM
};
exports.NAME_CHAIN = {
    "Arbitrum": ARBITRUM,
    "Ethereum": ETHEREUM,
    "Avalanche": AVALANCHE,
    "Optimism": OPTIMISM,
    "Polygon": POLYGON
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
const getChainName = (chainId) => {
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
exports.getChainName = getChainName;
const getExplorerRoot = (chainId) => {
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
exports.getExplorerRoot = getExplorerRoot;
exports.CHAINS = [[1, ETH], [10, ETH], [42161, ETH], [43114, AVAX], [137, MATIC]].reduce((r, [chainId, currency]) => {
    const { rpcUrl, explorerRootUrl } = exports.ID_CHAIN[Number(chainId)];
    r[Number(chainId)] = {
        chainId: (0, bytes_1.hexValue)(Number(chainId)),
        chainName: (0, exports.getChainName)(chainId).toLowerCase(),
        nativeCurrency: currency,
        rpcUrl: rpcUrl,
        blockExplorerUrls: explorerRootUrl
    };
    return r;
}, {});
exports.URLS = Object.keys(exports.CHAINS).reduce((r, chainId) => {
    r[Number(chainId)] = exports.CHAINS[Number(chainId)].rpcUrls || [];
    return r;
}, {});
exports.CONTROLLER_DEPLOYMENTS = {
    [(0, address_1.getAddress)(require("@zerodao/protocol/deployments/arbitrum/BadgerBridgeZeroController").address)]: "Arbitrum",
    [(0, address_1.getAddress)(require("@zerodao/protocol/deployments/avalanche/BadgerBridgeZeroController").address)]: "Avalanche",
    [(0, address_1.getAddress)(require("@zerodao/protocol/deployments/matic/BadgerBridgeZeroController").address)]: "Polygon",
    [(0, address_1.getAddress)(require("@zerodao/protocol/deployments/mainnet/BadgerBridgeZeroController").address)]: "Ethereum",
    [(0, address_1.getAddress)(require("@zerodao/protocol/deployments/optimism/BadgerBridgeZeroController").address)]: "Optimism",
};
exports.RPC_ENDPOINTS = {
    Arbitrum: exports.CHAINS[42161].rpcUrl,
    Avalanche: exports.CHAINS[43114].rpcUrl,
    Polygon: exports.CHAINS[137].rpcUrl,
    Ethereum: exports.CHAINS[1].rpcUrl,
    Optimism: exports.CHAINS[10].rpcUrl,
    localhost: "http://localhost:8545",
};
exports.RENVM_PROVIDERS = {
    Arbitrum: chains_1.Arbitrum,
    Polygon: chains_1.Polygon,
    Ethereum: chains_1.Ethereum,
    Avalanche: chains_1.Avalanche,
    Optimism: chains_1.Optimism,
};
exports.providerFromChainId = (0, utils_1.cachedFrom)((chainId) => {
    console.log("CHAINID", chainId);
    const chainIdNumber = Number(chainId);
    const chain = exports.CHAINS[chainIdNumber];
    const name = chain.chainName.toLowerCase();
    const infuraKey = (() => {
        switch (name) {
            case 'ethereum':
                return 'mainnet';
            case 'polygon':
                return 'matic';
            case 'arbitrum':
                return name;
        }
    })();
    if (infuraKey)
        return new providers_1.InfuraProvider(infuraKey, INFURA_PROJECT_ID);
    return new providers_1.JsonRpcProvider(chain.rpcUrl);
});
const getVanillaProvider = (request) => {
    const checkSummedContractAddr = (0, address_1.getAddress)(request.contractAddress);
    if (Object.keys(exports.CONTROLLER_DEPLOYMENTS).includes(checkSummedContractAddr)) {
        const chain_key = exports.CONTROLLER_DEPLOYMENTS[checkSummedContractAddr];
        return (0, exports.providerFromChainId)(exports.NAME_CHAIN[chain_key].id);
        ;
    }
    else {
        throw new Error('Not a contract currently deployed: ' + checkSummedContractAddr);
    }
};
exports.getVanillaProvider = getVanillaProvider;
const getRenVMChain = (transferRequest) => {
    const checkSummedContractAddr = (0, address_1.getAddress)(transferRequest.contractAddress);
    const ethersProvider = (0, exports.getVanillaProvider)(transferRequest);
    const chain_key = exports.CONTROLLER_DEPLOYMENTS[checkSummedContractAddr];
    return new exports.RENVM_PROVIDERS[chain_key]({ network: "mainnet", provider: ethersProvider });
};
exports.getRenVMChain = getRenVMChain;
const getProvider = (transferRequest) => {
    const checksummedAddr = (0, address_1.getAddress)(transferRequest.contractAddress);
    const ethersProvider = (0, exports.getVanillaProvider)(transferRequest);
    const chain_key = exports.CONTROLLER_DEPLOYMENTS[checksummedAddr];
    if (chain_key == "localhost")
        return new exports.RENVM_PROVIDERS.Ethereum({
            network: "mainnet",
            provider: ethersProvider
        });
    return new exports.RENVM_PROVIDERS[chain_key]({
        provider: ethersProvider,
        network: "mainnet",
    });
};
exports.getProvider = getProvider;
//# sourceMappingURL=chains.js.map