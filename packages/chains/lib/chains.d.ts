import { Polygon, Ethereum, Arbitrum, Avalanche, Optimism, EthereumBaseChain } from "@renproject/chains";
import { JsonRpcProvider } from "@ethersproject/providers";
export declare const getChainName: (chainId: any) => "Arbitrum" | "Avalanche" | "Optimism" | "Polygon" | "Mainnet" | "Unsupported Chain";
export declare const getExplorerRoot: (chainId: any) => "https://etherscan.io/address/" | "https://snowtrace.io/address/" | "https://polygonscan.com/address/" | "https://optimistic.etherscan.io/address/" | "https://arbiscan.io/address/";
export declare const CHAINS: {};
export declare const URLS: {};
export declare const CONTROLLER_DEPLOYMENTS: {
    [x: string]: string;
};
export declare const RPC_ENDPOINTS: {
    Arbitrum: any;
    Avalanche: any;
    Polygon: any;
    Ethereum: any;
    Optimism: any;
    localhost: string;
};
export declare const RENVM_PROVIDERS: {
    Arbitrum: typeof Arbitrum;
    Polygon: typeof Polygon;
    Ethereum: typeof Ethereum;
    Avalanche: typeof Avalanche;
    Optimism: typeof Optimism;
};
export declare const getVanillaProvider: (request: any) => JsonRpcProvider;
export declare const getRenVMChain: (transferRequest: any) => any;
export declare const getProvider: ({ contractAddress: string }: {
    contractAddress: any;
}) => EthereumBaseChain;
