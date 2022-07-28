"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.getProvider = exports.getRenVMChain = exports.getVanillaProvider = exports.RENVM_PROVIDERS = exports.RPC_ENDPOINTS = exports.CONTROLLER_DEPLOYMENTS = void 0;
const address_1 = require("@ethersproject/address");
const chains_1 = require("@renproject/chains");
const providers_1 = require("@ethersproject/providers");
exports.CONTROLLER_DEPLOYMENTS = {
    [(0, address_1.getAddress)(require("../deployments/arbitrum/BadgerBridgeZeroController.json").address)]: "Arbitrum",
    [(0, address_1.getAddress)(require("../deployments/avalanche/BadgerBridgeZeroController.json").address)]: "Avalanche",
    [(0, address_1.getAddress)(require("../deployments/matic/BadgerBridgeZeroController.json").address)]: "Polygon",
    [(0, address_1.getAddress)(require("../deployments/mainnet/BadgerBridgeZeroController.json").address)]: "Ethereum",
    [(0, address_1.getAddress)(require("../deployments/optimism/BadgerBridgeZeroController.json").address)]: "Optimism",
};
exports.RPC_ENDPOINTS = {
    Arbitrum: "https://arbitrum-mainnet.infura.io/v3/816df2901a454b18b7df259e61f92cd2",
    Avalanche: "https://api.avax.network/ext/bc/C/rpc",
    Polygon: "https://polygon-mainnet.infura.io/v3/816df2901a454b18b7df259e61f92cd2",
    Ethereum: "https://mainnet.infura.io/v3/816df2901a454b18b7df259e61f92cd2",
    Optimism: "https://optimism-mainnet.infura.io/v3/ca0da016dedf4c5a9ee90bfdbafee233",
    localhost: "http://localhost:8545",
};
exports.RENVM_PROVIDERS = {
    Arbitrum: chains_1.Arbitrum,
    Polygon: chains_1.Polygon,
    Ethereum: chains_1.Ethereum,
    Avalanche: chains_1.Avalanche,
    Optimism: chains_1.Optimism,
};
const getVanillaProvider = (request) => {
    const checkSummedContractAddr = (0, address_1.getAddress)(request.contractAddress);
    if (Object.keys(exports.CONTROLLER_DEPLOYMENTS).includes(checkSummedContractAddr)) {
        const chain_key = exports.CONTROLLER_DEPLOYMENTS[checkSummedContractAddr];
        const infuraKey = (() => {
            switch (chain_key) {
                case 'ethereum':
                    return 'mainnet';
                case 'polygon':
                    return 'matic';
                case 'arbitrum':
                    return chain_key;
            }
        })();
        if (infuraKey)
            return new providers_1.InfuraProvider(infuraKey, '816df2901a454b18b7df259e61f92cd2');
        return new providers_1.JsonRpcProvider(exports.RPC_ENDPOINTS[chain_key]);
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
};
exports.getProvider = getProvider;
exports.logger = {
    debug(v) {
        console.error(v);
    },
};
//# sourceMappingURL=provider.js.map