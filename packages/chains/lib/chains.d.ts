import { Polygon, Ethereum, Arbitrum, Avalanche, Optimism, EthereumBaseChain } from "@renproject/chains";
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
export declare const ID_CHAIN: {
    1: IIntegratedChain;
    43114: IIntegratedChain;
    42161: IIntegratedChain;
    137: IIntegratedChain;
    10: IIntegratedChain;
};
export declare const NAME_CHAIN: {
    Arbitrum: IIntegratedChain;
    Ethereum: IIntegratedChain;
    Avalanche: IIntegratedChain;
    Optimism: IIntegratedChain;
    Polygon: IIntegratedChain;
};
export declare const getChainName: (chainId: any) => "Arbitrum" | "Avalanche" | "Ethereum" | "Optimism" | "Polygon" | "Unsupported Chain";
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
export declare const providerFromChainId: (v: any) => any;
export declare const getVanillaProvider: (request: any) => any;
export declare const getRenVMChain: (transferRequest: any) => any;
export declare const getProvider: ({ contractAddress, }: {
    contractAddress: string;
}) => EthereumBaseChain;
export {};
