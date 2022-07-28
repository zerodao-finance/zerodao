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
import { _TypedDataEncoder } from '@ethersproject/hash';
import { ethers } from 'ethers';


export const CONTROLLER_DEPLOYMENTS = {
    [getAddress(
        require("../deployments/arbitrum/BadgerBridgeZeroController.json").address
    )]: "Arbitrum",
    [getAddress(
        require("../deployments/avalanche/BadgerBridgeZeroController.json").address
    )]: "Avalanche",
    [getAddress(
        require("../deployments/matic/BadgerBridgeZeroController.json").address
    )]: "Polygon",
    [getAddress(
        require("../deployments/mainnet/BadgerBridgeZeroController.json").address
    )]: "Ethereum",
    [getAddress(
        require("../deployments/optimism/BadgerBridgeZeroController.json").address
    )]: "Optimism",
};

export const RPC_ENDPOINTS = {
    Arbitrum:
        "https://arbitrum-mainnet.infura.io/v3/816df2901a454b18b7df259e61f92cd2",
    Avalanche: "https://api.avax.network/ext/bc/C/rpc",
    Polygon:
        "https://polygon-mainnet.infura.io/v3/816df2901a454b18b7df259e61f92cd2",
    Ethereum: "https://mainnet.infura.io/v3/816df2901a454b18b7df259e61f92cd2",
    Optimism: "https://optimism-mainnet.infura.io/v3/ca0da016dedf4c5a9ee90bfdbafee233",
    localhost: "http://localhost:8545",
};

export const RENVM_PROVIDERS = {
    Arbitrum,
    Polygon,
    Ethereum,
    Avalanche,
    Optimism,
};



export const getVanillaProvider = (request) => {
    const checkSummedContractAddr = getAddress(request.contractAddress);
    if (Object.keys(CONTROLLER_DEPLOYMENTS).includes(checkSummedContractAddr)) {
        const chain_key = CONTROLLER_DEPLOYMENTS[checkSummedContractAddr];
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
        if (infuraKey) return new InfuraProvider(infuraKey, '816df2901a454b18b7df259e61f92cd2');
        return new JsonRpcProvider(RPC_ENDPOINTS[chain_key]);
    } else {
        throw new Error('Not a contract currently deployed: ' + checkSummedContractAddr);
    }
};

export const getRenVMChain = (transferRequest) => {
    const checkSummedContractAddr = getAddress(transferRequest.contractAddress);
    const ethersProvider = getVanillaProvider(transferRequest);
    const chain_key = CONTROLLER_DEPLOYMENTS[checkSummedContractAddr];
    return new RENVM_PROVIDERS[chain_key]({ network: "mainnet", provider: ethersProvider });
}



export const getProvider: ({ contractAddress: string }) => EthereumBaseChain =
    (transferRequest) => {
        const checksummedAddr = getAddress(
            transferRequest.contractAddress
        );

        const ethersProvider = getVanillaProvider(transferRequest);
        const chain_key = CONTROLLER_DEPLOYMENTS[checksummedAddr];
        if (chain_key == "localhost")
            return new RENVM_PROVIDERS.Ethereum({
                network: "mainnet",
                provider: ethersProvider
            });
    };

export const logger = {
    debug(v) {
        console.error(v);
    },
};